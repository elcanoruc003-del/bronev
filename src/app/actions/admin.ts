'use server';

import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import { authenticateUser, createSessionToken, verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { AnalyticsService } from '@/lib/services/analytics.service';

const SESSION_COOKIE = 'bronev_session';

/**
 * Safe wrapper for server actions
 * Catches errors and returns standardized responses
 */
async function safeServerAction<T>(
  action: () => Promise<T>,
  errorMessage: string = 'Xəta baş verdi'
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    console.error(`Server action error: ${errorMessage}`, error);
    return { 
      success: false, 
      error: errorMessage,
    };
  }
}

/**
 * Admin login action with comprehensive error handling
 */
export async function loginAdmin(email: string, password: string) {
  try {
    console.log('[LOGIN] Starting login attempt for:', email);
    
    // Validate inputs
    if (!email || !password) {
      console.log('[LOGIN] Missing credentials');
      return { success: false, error: 'Email və parol tələb olunur' };
    }

    // Check database connection
    console.log('[LOGIN] Checking database connection...');
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('[LOGIN] Database connection failed');
      return { success: false, error: 'Verilənlər bazası əlçatan deyil' };
    }
    console.log('[LOGIN] Database connected');

    // Authenticate user
    console.log('[LOGIN] Authenticating user...');
    const user = await authenticateUser(email, password);
    
    if (!user) {
      console.log('[LOGIN] User not found or invalid credentials');
      return { success: false, error: 'Email və ya parol səhvdir' };
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      console.log('[LOGIN] User is not admin:', user.role);
      return { success: false, error: 'Admin icazəsi yoxdur' };
    }

    console.log('[LOGIN] User authenticated:', user.email);

    // Create session
    const token = createSessionToken(user);
    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('[LOGIN] Session created successfully');
    return { success: true, user };
  } catch (error: any) {
    console.error('[LOGIN] Error:', error);
    return { 
      success: false, 
      error: error.message || 'Giriş zamanı xəta baş verdi'
    };
  }
}

/**
 * Admin logout action
 */
export async function logoutAdmin() {
  try {
    cookies().delete(SESSION_COOKIE);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Çıxış zamanı xəta baş verdi' };
  }
}

/**
 * Get current admin user with validation
 */
export async function getCurrentAdmin() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const user = verifySessionToken(token);
    if (!user) {
      cookies().delete(SESSION_COOKIE);
      return null;
    }

    // Verify user still exists and is active
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Database unavailable during auth check');
      return null;
    }

    const dbUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        isBanned: true,
      },
    });

    if (!dbUser || !dbUser.isActive || dbUser.isBanned) {
      cookies().delete(SESSION_COOKIE);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get current admin error:', error);
    return null;
  }
}

/**
 * Get dashboard metrics with error handling
 */
export async function getDashboardMetrics() {
  return safeServerAction(async () => {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const metrics = await AnalyticsService.getDashboardMetrics();
    return metrics;
  }, 'Statistika yüklənərkən xəta baş verdi');
}

/**
 * Get all properties for admin
 */
export async function getAdminProperties() {
  return safeServerAction(async () => {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const properties = await prisma.properties.findMany({
      include: {
        property_images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        _count: {
          select: {
            bookingRequests: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return properties;
  }, 'Evlər yüklənərkən xəta baş verdi');
}

/**
 * Delete property
 */
export async function deleteProperty(propertyId: string) {
  return safeServerAction(async () => {
    if (!propertyId) {
      throw new Error('Property ID tələb olunur');
    }

    await prisma.properties.delete({
      where: { id: propertyId },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return true;
  }, 'Ev silinərkən xəta baş verdi');
}

/**
 * Update property status
 */
export async function updatePropertyStatus(
  propertyId: string,
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'MAINTENANCE' | 'SUSPENDED'
) {
  return safeServerAction(async () => {
    if (!propertyId || !status) {
      throw new Error('Property ID və status tələb olunur');
    }

    await prisma.properties.update({
      where: { id: propertyId },
      data: { 
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
        archivedAt: status === 'ARCHIVED' ? new Date() : undefined,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return true;
  }, 'Status yenilənərkən xəta baş verdi');
}

/**
 * Toggle property featured
 */
export async function togglePropertyFeatured(propertyId: string) {
  return safeServerAction(async () => {
    if (!propertyId) {
      throw new Error('Property ID tələb olunur');
    }

    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
      select: { featured: true },
    });

    if (!property) {
      throw new Error('Ev tapılmadı');
    }

    await prisma.properties.update({
      where: { id: propertyId },
      data: { featured: !property.featured },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return true;
  }, 'Xəta baş verdi');
}

/**
 * Get all bookings for admin
 */
export async function getAdminBookings() {
  return safeServerAction(async () => {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const bookings = await prisma.bookings.findMany({
      include: {
        properties: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return bookings;
  }, 'Bronlar yüklənərkən xəta baş verdi');
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'COMPLETED'
) {
  return safeServerAction(async () => {
    if (!bookingId || !status) {
      throw new Error('Booking ID və status tələb olunur');
    }

    await prisma.bookings.update({
      where: { id: bookingId },
      data: { 
        status,
        confirmedAt: status === 'CONFIRMED' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    revalidatePath('/admin');

    return true;
  }, 'Status yenilənərkən xəta baş verdi');
}

/**
 * Get revenue chart data
 */
export async function getRevenueChartData(months: number = 12) {
  return safeServerAction(async () => {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const bookings = await prisma.bookings.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        totalPrice: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by month
    const monthlyData = bookings.reduce((acc: any, booking: any) => {
      const month = booking.createdAt.toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, count: 0 };
      }
      acc[month].revenue += booking.totalPrice;
      acc[month].count += 1;
      return acc;
    }, {});

    return Object.values(monthlyData);
  }, 'Gəlir məlumatları yüklənərkən xəta baş verdi');
}

/**
 * Create new property
 */
export async function createProperty(data: any) {
  return safeServerAction(async () => {
    const currentUser = await getCurrentAdmin();
    if (!currentUser) {
      throw new Error('Giriş tələb olunur');
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const now = new Date();

    // Prepare property data with proper types
    const propertyData = {
      id: data.id,
      title: data.title,
      slug: `${slug}-${Date.now()}`,
      city: data.city,
      district: data.district,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      type: data.type,
      bedrooms: data.bedrooms,
      beds: data.beds,
      bathrooms: data.bathrooms,
      area: data.area,
      maxGuests: data.maxGuests,
      basePricePerNight: data.basePricePerNight,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      featured: data.featured || false,
      status: 'PUBLISHED' as const, // Publish immediately
      publishedAt: now,
      amenities: data.amenities || [],
      features: data.features || [],
      ownerId: currentUser.id,
      updatedAt: now,
    };

    console.log('Creating property with data:', JSON.stringify(propertyData, null, 2));

    const property = await prisma.properties.create({
      data: propertyData,
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return property;
  }, 'Ev əlavə edilərkən xəta baş verdi');
}

/**
 * Update property
 */
export async function updateProperty(propertyId: string, data: any) {
  return safeServerAction(async () => {
    if (!propertyId) {
      throw new Error('Property ID tələb olunur');
    }

    const now = new Date();

    // Prepare update data
    const updateData: any = {
      title: data.title,
      city: data.city,
      district: data.district || data.city,
      address: data.address,
      type: data.type,
      bedrooms: Number(data.bedrooms),
      beds: Number(data.beds || data.bedrooms),
      bathrooms: Number(data.bathrooms),
      area: Number(data.area),
      maxGuests: Number(data.maxGuests),
      basePricePerNight: Number(data.basePricePerNight),
      shortDescription: data.shortDescription || data.longDescription?.substring(0, 150),
      longDescription: data.longDescription || data.shortDescription,
      featured: Boolean(data.featured),
      updatedAt: now,
    };

    // Only update amenities and features if provided
    if (data.amenities) updateData.amenities = data.amenities;
    if (data.features) updateData.features = data.features;

    const property = await prisma.properties.update({
      where: { id: propertyId },
      data: updateData,
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return property;
  }, 'Ev yenilənərkən xəta baş verdi');
}

/**
 * Add images to property with proper transaction handling
 */
export async function addPropertyImages(
  propertyId: string,
  images: Array<{ url: string; alt?: string; order: number }>
) {
  try {
    console.log('[addPropertyImages] Starting transaction for property:', propertyId);
    console.log('[addPropertyImages] Images to add:', images.length);

    if (!propertyId || !images || images.length === 0) {
      console.error('[addPropertyImages] Invalid input:', { propertyId, imageCount: images?.length });
      return { success: false, error: 'Property ID və şəkillər tələb olunur' };
    }

    // Verify property exists
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });

    if (!property) {
      console.error('[addPropertyImages] Property not found:', propertyId);
      return { success: false, error: 'Ev tapılmadı' };
    }

    console.log('[addPropertyImages] Property verified, creating images...');

    // Create images one by one with detailed logging
    const createdImages = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const imageId = `img_${propertyId}_${Date.now()}_${i}`;
      
      console.log(`[addPropertyImages] Creating image ${i + 1}/${images.length}:`, {
        id: imageId,
        url: img.url,
        order: img.order,
        propertyId,
      });

      try {
        const createdImage = await prisma.property_images.create({
          data: {
            id: imageId,
            url: img.url,
            alt: img.alt || '',
            order: img.order,
            propertyId: propertyId,
          },
        });
        
        console.log(`[addPropertyImages] Image ${i + 1} created successfully:`, createdImage.id);
        createdImages.push(createdImage);
      } catch (imgError: any) {
        console.error(`[addPropertyImages] Failed to create image ${i + 1}:`, imgError);
        throw imgError;
      }
    }

    console.log('[addPropertyImages] All images created successfully:', createdImages.length);

    // Verify images were created
    const verifyImages = await prisma.property_images.findMany({
      where: { propertyId },
      select: { id: true, url: true, order: true },
    });

    console.log('[addPropertyImages] Verification - images in DB:', verifyImages.length);

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/properties/${propertyId}`);

    return { success: true, data: createdImages };
  } catch (error: any) {
    console.error('[addPropertyImages] Transaction failed:', error);
    console.error('[addPropertyImages] Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    return { 
      success: false, 
      error: `Şəkillər əlavə edilərkən xəta: ${error.message}` 
    };
  }
}

/**
 * Update image order
 */
export async function updateImageOrder(imageId: string, newOrder: number) {
  try {
    await prisma.property_images.update({
      where: { id: imageId },
      data: { order: newOrder },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error('[updateImageOrder] Error:', error);
    return { success: false, error: 'Şəkil sırası yenilənə bilmədi' };
  }
}

/**
 * Delete property image
 */
export async function deletePropertyImage(imageId: string) {
  return safeServerAction(async () => {
    if (!imageId) {
      throw new Error('Image ID tələb olunur');
    }

    await prisma.property_images.delete({
      where: { id: imageId },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return true;
  }, 'Şəkil silinərkən xəta baş verdi');
}

/**
 * Get single property for editing
 */
export async function getPropertyForEdit(propertyId: string) {
  return safeServerAction(async () => {
    if (!propertyId) {
      throw new Error('Property ID tələb olunur');
    }

    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
      include: {
        property_images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!property) {
      throw new Error('Ev tapılmadı');
    }

    return property;
  }, 'Ev yüklənərkən xəta baş verdi');
}


/**
 * Get all users for admin
 */
export async function getAdminUsers() {
  return safeServerAction(async () => {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            favorites: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }, 'İstifadəçilər yüklənərkən xəta');
}

/**
 * Get comprehensive dashboard statistics
 */
export async function getComprehensiveDashboardStats() {
  return safeServerAction(async () => {
    // Get all properties
    const allProperties = await prisma.properties.findMany({
      include: {
        property_images: true,
      },
    });

    // Get all bookings
    const allBookings = await prisma.bookings.findMany({
      include: {
        properties: true,
        users: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all users
    const allUsers = await prisma.users.findMany();

    // Calculate statistics
    const totalProperties = allProperties.length;
    const publishedProperties = allProperties.filter(p => p.status === 'PUBLISHED').length;
    const featuredProperties = allProperties.filter(p => p.featured).length;
    const totalViews = allProperties.reduce((sum, p) => sum + (p.views || 0), 0);

    const totalBookings = allBookings.length;
    const confirmedBookings = allBookings.filter(b => b.status === 'CONFIRMED').length;
    const pendingBookings = allBookings.filter(b => b.status === 'PENDING').length;
    const cancelledBookings = allBookings.filter(b => b.status === 'CANCELLED').length;

    const totalRevenue = allBookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Monthly revenue (current month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = allBookings
      .filter(b => b.status === 'CONFIRMED' && new Date(b.createdAt) >= monthStart)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Weekly revenue
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRevenue = allBookings
      .filter(b => b.status === 'CONFIRMED' && new Date(b.createdAt) >= weekStart)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Average booking value
    const avgBookingValue = confirmedBookings > 0 ? totalRevenue / confirmedBookings : 0;

    // Most popular properties
    const propertyBookingCounts = allProperties.map(p => ({
      id: p.id,
      title: p.title,
      city: p.city,
      bookingCount: allBookings.filter(b => b.propertyId === p.id).length,
      revenue: allBookings
        .filter(b => b.propertyId === p.id && b.status === 'CONFIRMED')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    }));
    const topProperties = propertyBookingCounts
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);

    // City statistics
    const cityStats = allProperties.reduce((acc: any, p) => {
      if (!acc[p.city]) {
        acc[p.city] = { count: 0, bookings: 0, revenue: 0 };
      }
      acc[p.city].count++;
      const cityBookings = allBookings.filter(b => b.propertyId === p.id);
      acc[p.city].bookings += cityBookings.length;
      acc[p.city].revenue += cityBookings
        .filter(b => b.status === 'CONFIRMED')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      return acc;
    }, {});

    // Recent bookings
    const recentBookings = allBookings.slice(0, 10).map(b => ({
      id: b.id,
      propertyTitle: b.properties?.title || 'N/A',
      userName: b.users?.name || 'N/A',
      userPhone: b.users?.phone || 'N/A',
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt,
    }));

    return {
      overview: {
        totalProperties,
        publishedProperties,
        featuredProperties,
        totalViews,
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalUsers: allUsers.length,
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        weekly: weeklyRevenue,
        average: avgBookingValue,
      },
      topProperties,
      cityStats,
      recentBookings,
    };
  }, 'Statistikalar yüklənərkən xəta');
}
