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
  return safeServerAction(async () => {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email və parol tələb olunur');
    }

    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const user = await authenticateUser(email, password);

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw new Error('Email və ya parol səhvdir');
    }

    // Create session
    const token = createSessionToken(user);
    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { user };
  }, 'Giriş zamanı xəta baş verdi').then(result => {
    if (result.success && result.data) {
      return { success: true, user: result.data.user };
    }
    return { success: false, error: result.error };
  });
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

    const property = await prisma.properties.create({
      data: {
        ...data,
        slug: `${slug}-${Date.now()}`,
        ownerId: currentUser.id,
      },
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

    const property = await prisma.properties.update({
      where: { id: propertyId },
      data,
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return property;
  }, 'Ev yenilənərkən xəta baş verdi');
}

/**
 * Add images to property
 */
export async function addPropertyImages(
  propertyId: string,
  images: Array<{ url: string; alt?: string; order: number }>
) {
  return safeServerAction(async () => {
    if (!propertyId || !images || images.length === 0) {
      throw new Error('Property ID və şəkillər tələb olunur');
    }

    await prisma.property_images.createMany({
      data: images.map((img: any) => ({
        ...img,
        propertyId,
      })),
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return true;
  }, 'Şəkillər əlavə edilərkən xəta baş verdi');
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
