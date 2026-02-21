import { prisma } from '@/lib/prisma';
import { addDays, eachDayOfInterval, isWithinInterval, startOfDay } from 'date-fns';

/**
 * Enterprise-level Availability Service
 * Handles complex availability logic with overlapping prevention
 */

export class AvailabilityService {
  /**
   * Check if property is available for given date range
   */
  static async checkAvailability(
    propertyId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<{
    isAvailable: boolean;
    blockedDates: Date[];
    reason?: string;
  }> {
    const startDate = startOfDay(checkIn);
    const endDate = startOfDay(checkOut);

    // Get all availability records that overlap with requested dates
    const overlappingRecords = await prisma.propertyAvailability.findMany({
      where: {
        propertyId,
        OR: [
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: startDate } },
            ],
          },
        ],
      },
    });

    // Check for blocked dates
    const blockedDates: Date[] = [];
    let blockReason: string | undefined;

    for (const record of overlappingRecords) {
      if (!record.isAvailable) {
        const datesInRange = eachDayOfInterval({
          start: record.startDate,
          end: record.endDate,
        });

        datesInRange.forEach((date) => {
          if (isWithinInterval(date, { start: startDate, end: endDate })) {
            blockedDates.push(date);
            if (!blockReason) blockReason = record.blockReason || 'Blocked';
          }
        });
      }
    }

    // Check for existing confirmed bookings
    const existingBookings = await prisma.booking.findMany({
      where: {
        propertyId,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        OR: [
          {
            AND: [
              { checkIn: { lte: endDate } },
              { checkOut: { gte: startDate } },
            ],
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      existingBookings.forEach((booking) => {
        const datesInRange = eachDayOfInterval({
          start: booking.checkIn,
          end: booking.checkOut,
        });

        datesInRange.forEach((date) => {
          if (isWithinInterval(date, { start: startDate, end: endDate })) {
            blockedDates.push(date);
            if (!blockReason) blockReason = 'Already booked';
          }
        });
      });
    }

    return {
      isAvailable: blockedDates.length === 0,
      blockedDates,
      reason: blockReason,
    };
  }

  /**
   * Block dates (manual or automatic)
   */
  static async blockDates(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
    notes?: string
  ): Promise<void> {
    // Check for overlapping availability records
    const overlapping = await prisma.propertyAvailability.findFirst({
      where: {
        propertyId,
        OR: [
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: startDate } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      throw new Error('Overlapping availability record exists. Please remove it first.');
    }

    await prisma.propertyAvailability.create({
      data: {
        propertyId,
        startDate: startOfDay(startDate),
        endDate: startOfDay(endDate),
        isAvailable: false,
        blockReason: reason,
        notes,
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
    await prisma.propertyAvailability.deleteMany({
      where: {
        propertyId,
        startDate: { gte: startOfDay(startDate) },
        endDate: { lte: startOfDay(endDate) },
        isAvailable: false,
      },
    });
  }

  /**
   * Get calendar view for a month
   */
  static async getMonthCalendar(
    propertyId: string,
    year: number,
    month: number
  ): Promise<{
    date: Date;
    isAvailable: boolean;
    price: number;
    minNights: number;
    blockReason?: string;
  }[]> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        availability: {
          where: {
            startDate: {
              gte: new Date(year, month - 1, 1),
              lte: new Date(year, month, 0),
            },
          },
        },
        pricingRules: {
          where: {
            isActive: true,
            startDate: {
              lte: new Date(year, month, 0),
            },
            endDate: {
              gte: new Date(year, month - 1, 1),
            },
          },
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!property) throw new Error('Property not found');

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });

    return days.map((date) => {
      // Check availability
      const availabilityRecord = property.availability.find((av) =>
        isWithinInterval(date, { start: av.startDate, end: av.endDate })
      );

      // Calculate price with rules
      let price = property.basePricePerNight;
      
      if (availabilityRecord?.customPrice) {
        price = availabilityRecord.customPrice;
      } else {
        // Apply pricing rules
        for (const rule of property.pricingRules) {
          if (isWithinInterval(date, { start: rule.startDate, end: rule.endDate })) {
            if (rule.adjustmentType === 'PERCENTAGE') {
              price = Math.round(price * (1 + rule.adjustmentValue / 100));
            } else {
              price += rule.adjustmentValue;
            }
          }
        }
      }

      return {
        date,
        isAvailable: availabilityRecord ? availabilityRecord.isAvailable : true,
        price,
        minNights: availabilityRecord?.minNights || property.minNights,
        blockReason: availabilityRecord?.blockReason || undefined,
      };
    });
  }

  /**
   * Auto-block dates when booking is confirmed
   */
  static async autoBlockForBooking(bookingId: string): Promise<void> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error('Booking not found');

    await this.blockDates(
      booking.propertyId,
      booking.checkIn,
      booking.checkOut,
      'booked',
      `Auto-blocked for booking #${booking.bookingNumber}`
    );
  }

  /**
   * Auto-unblock dates when booking is cancelled
   */
  static async autoUnblockForBooking(bookingId: string): Promise<void> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error('Booking not found');

    await prisma.propertyAvailability.deleteMany({
      where: {
        propertyId: booking.propertyId,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
        blockReason: 'booked',
      },
    });
  }
}
