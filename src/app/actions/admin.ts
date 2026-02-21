'use server';

import { prisma } from '@/lib/prisma';
import { authenticateUser, createSessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { AnalyticsService } from '@/lib/services/analytics.service';

const SESSION_COOKIE = 'bronev_session';

/**
 * Admin login action
 */
export async function loginAdmin(email: string, password: string) {
  try {
    const user = await authenticateUser(email, password);

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return { success: false, error: 'Email və ya parol səhvdir' };
    }

    // Create session
    const token = createSessionToken(user);
    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Giriş zamanı xəta baş verdi' };
  }
}

/**
 * Admin logout action
 */
export async function logoutAdmin() {
  cookies().delete(SESSION_COOKIE);
  revalidatePath('/admin');
  return { success: true };
}

/**
 * Get current admin user
 */
export async function getCurrentAdmin() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const user = JSON.parse(decoded);

    // Verify user still exists and is active
    const dbUser = await prisma.user.findUnique({
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
  } catch {
    return null;
  }
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics() {
  try {
    const metrics = await AnalyticsService.getDashboardMetrics();
    return { success: true, data: metrics };
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return { success: false, error: 'Statistika yüklənərkən xəta baş verdi' };
  }
}

/**
 * Get all properties for admin
 */
export async function getAdminProperties() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: {
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

    return { success: true, data: properties };
  } catch (error) {
    console.error('Get properties error:', error);
    return { success: false, error: 'Evlər yüklənərkən xəta baş verdi' };
  }
}

/**
 * Delete property
 */
export async function deleteProperty(propertyId: string) {
  try {
    await prisma.property.delete({
      where: { id: propertyId },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Delete property error:', error);
    return { success: false, error: 'Ev silinərkən xəta baş verdi' };
  }
}

/**
 * Update property status
 */
export async function updatePropertyStatus(
  propertyId: string,
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'MAINTENANCE' | 'SUSPENDED'
) {
  try {
    await prisma.property.update({
      where: { id: propertyId },
      data: { 
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
        archivedAt: status === 'ARCHIVED' ? new Date() : undefined,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Update status error:', error);
    return { success: false, error: 'Status yenilənərkən xəta baş verdi' };
  }
}

/**
 * Toggle property featured
 */
export async function togglePropertyFeatured(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { featured: true },
    });

    if (!property) {
      return { success: false, error: 'Ev tapılmadı' };
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: { featured: !property.featured },
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Toggle featured error:', error);
    return { success: false, error: 'Xəta baş verdi' };
  }
}

/**
 * Get all bookings for admin
 */
export async function getAdminBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { success: true, data: bookings };
  } catch (error) {
    console.error('Get bookings error:', error);
    return { success: false, error: 'Bronlar yüklənərkən xəta baş verdi' };
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'COMPLETED'
) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status,
        confirmedAt: status === 'CONFIRMED' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Update booking status error:', error);
    return { success: false, error: 'Status yenilənərkən xəta baş verdi' };
  }
}

/**
 * Get revenue chart data
 */
export async function getRevenueChartData(months: number = 12) {
  try {
    const data = await AnalyticsService.getRevenueChartData(undefined, months);
    return { success: true, data };
  } catch (error) {
    console.error('Revenue chart error:', error);
    return { success: false, error: 'Gəlir məlumatları yüklənərkən xəta baş verdi' };
  }
}
