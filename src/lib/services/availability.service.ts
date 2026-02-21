import { prisma } from '@/lib/prisma';
import { addDays, eachDayOfInterval, isWithinInterval, startOfDay } from 'date-fns';

/**
 * Enterprise Availability Service
 * Thread-safe with transaction support
 */

export class AvailabilityService {
  /**
   * ATOMIC: Check and reserve availability in single transaction
   * Prevents race conditions
   */
  static async checkAndReserve(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    bookingId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Check availability with row lock
        const availability = await this.checkAvailability(propertyId, checkIn, checkOut, tx);
        
        if (!availability.isAvailable) {
          return { 
            success: false, 
            error: availability.reason || 'Dates not available' 
          };
        }

        // 2. Create availability block atomically
        await tx.property_availability.create({
          data: {
            id: `avail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            propertyId,
            startDate: startOfDay(checkIn),
            endDate: startOfDay(checkOut),
            isAvailable: false,
            blockReason: 'booked',
            notes: `Booking #${bookingId}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return { success: true };
      }, {
        isolationLevel: 'Serializable', // Highest isolation
        timeout: 10000, // 10s timeout
      });
    } catch (error: any) {
      console.error('Availability reservation error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to reserve dates' 
      };
    }
  }


  /**
   * Check availability (transaction-safe)
   */
  static async checkAvailability(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    tx?: any
  ): Promise<{
    isAvailable: boolean;
    blockedDates: Date[];
    reason?: string;
  }> {
    const client = tx || prisma;
    const startDate = startOfDay(checkIn);
    const endDate = startOfDay(checkOut);

    // Check blocked dates
    const blockedRecords = await client.property_availability.findMany({
      where: {
        propertyId,
        isAvailable: false,
        AND: [
          { startDate: { lte: endDate } },
          { endDate: { gte: startDate } },
        ],
      },
    });

    if (blockedRecords.length > 0) {
      const blockedDates = blockedRecords.flatMap((record: any) =>
        eachDayOfInterval({ start: record.startDate, end: record.endDate })
      );
      return {
        isAvailable: false,
        blockedDates,
        reason: blockedRecords[0].blockReason || 'Blocked',
      };
    }

    // Check existing bookings
    const existingBookings = await client.bookings.findMany({
      where: {
        propertyId,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        AND: [
          { checkIn: { lte: endDate } },
          { checkOut: { gte: startDate } },
        ],
      },
    });

    if (existingBookings.length > 0) {
      const blockedDates = existingBookings.flatMap((booking: any) =>
        eachDayOfInterval({ start: booking.checkIn, end: booking.checkOut })
      );
      return {
        isAvailable: false,
        blockedDates,
        reason: 'Already booked',
      };
    }

    return { isAvailable: true, blockedDates: [] };
  }

  /**
   * Block dates manually
   */
  static async blockDates(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
    notes?: string
  ): Promise<void> {
    await prisma.property_availability.create({
      data: {
        id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        propertyId,
        startDate: startOfDay(startDate),
        endDate: startOfDay(endDate),
        isAvailable: false,
        blockReason: reason,
        notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Unblock dates
   */
  static async unblockDates(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    await prisma.property_availability.deleteMany({
      where: {
        propertyId,
        startDate: { gte: startOfDay(startDate) },
        endDate: { lte: startOfDay(endDate) },
        isAvailable: false,
      },
    });
  }

  /**
   * Release booking dates (on cancellation)
   */
  static async releaseBookingDates(bookingId: string): Promise<void> {
    await prisma.property_availability.deleteMany({
      where: {
        notes: { contains: `Booking #${bookingId}` },
      },
    });
  }
}
