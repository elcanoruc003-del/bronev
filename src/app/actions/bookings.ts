'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Get user by phone
 */
async function getUserByPhone(phone: string) {
  try {
    let user = await prisma.users.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          phone,
          name: 'Qonaq',
          email: `${phone}@guest.com`,
          password: 'guest',
          updatedAt: new Date(),
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Create booking (admin creates for user)
 */
export async function createBookingForUser(data: {
  userPhone: string;
  userName: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  notes?: string;
}) {
  try {
    // Get or create user
    const user = await getUserByPhone(data.userPhone);
    if (!user) {
      return { success: false, error: 'İstifadəçi yaradıla bilmədi' };
    }

    // Update user name if provided
    if (data.userName && data.userName !== 'Qonaq') {
      await prisma.users.update({
        where: { id: user.id },
        data: { name: data.userName, updatedAt: new Date() },
      });
    }

    // Calculate nights
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Create booking
    const booking = await prisma.bookings.create({
      data: {
        id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        bookingNumber: `BRN${Date.now()}`,
        propertyId: data.propertyId,
        userId: user.id,
        checkIn,
        checkOut,
        guestCount: data.guestCount,
        guestName: data.userName,
        guestPhone: data.userPhone,
        guestEmail: user.email,
        totalNights: nights,
        basePrice: Math.floor(data.totalPrice / nights),
        totalPrice: data.totalPrice,
        status: 'CONFIRMED',
        paymentStatus: 'UNPAID',
        specialRequests: data.notes || '',
        updatedAt: new Date(),
      },
    });

    revalidatePath('/admin');
    revalidatePath('/profile');

    return { success: true, booking };
  } catch (error) {
    console.error('Create booking error:', error);
    return { success: false, error: 'Rezervasiya yaradıla bilmədi' };
  }
}

/**
 * Get user bookings
 */
export async function getUserBookings() {
  try {
    const { getCurrentUser } = await import('./auth');
    const user = await getCurrentUser();

    if (!user) {
      return { success: true, bookings: [] };
    }

    const bookings = await prisma.bookings.findMany({
      where: { userId: user.id },
      include: {
        properties: {
          include: {
            property_images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, bookings };
  } catch (error) {
    console.error('Get bookings error:', error);
    return { success: false, bookings: [], error: 'Xəta baş verdi' };
  }
}

/**
 * Get all bookings (admin)
 */
export async function getAllBookings() {
  try {
    const bookings = await prisma.bookings.findMany({
      include: {
        properties: {
          select: {
            id: true,
            title: true,
            city: true,
          },
        },
        users: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, bookings };
  } catch (error) {
    console.error('Get all bookings error:', error);
    return { success: false, bookings: [], error: 'Xəta baş verdi' };
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    await prisma.bookings.update({
      where: { id: bookingId },
      data: { 
        status: status as any,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update booking status error:', error);
    return { success: false, error: 'Status yenilənə bilmədi' };
  }
}

/**
 * Delete booking
 */
export async function deleteBooking(bookingId: string) {
  try {
    await prisma.bookings.delete({
      where: { id: bookingId },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Delete booking error:', error);
    return { success: false, error: 'Rezervasiya silinə bilmədi' };
  }
}
