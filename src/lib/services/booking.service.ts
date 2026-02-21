import { prisma } from '@/lib/prisma';
import { AvailabilityService } from './availability.service';
import { PricingService } from './pricing.service';
import { differenceInDays } from 'date-fns';

/**
 * Enterprise Booking Service
 * Transaction-safe booking creation
 */

interface CreateBookingInput {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  promoCode?: string;
}

export class BookingService {
  /**
   * Create booking atomically
   */
  static async createBooking(input: CreateBookingInput): Promise<{
    success: boolean;
    booking?: any;
    error?: string;
  }> {
    try {
      // Validate dates
      const nights = differenceInDays(input.checkOut, input.checkIn);
      if (nights < 1) {
        return { success: false, error: 'Invalid date range' };
      }

      // Calculate price first
      const pricing = await PricingService.calculatePrice(
        input.propertyId,
        input.checkIn,
        input.checkOut,
        input.guestCount,
        input.promoCode
      );

      // Create booking in transaction
      const result = await prisma.$transaction(async (tx) => {
        // 1. Check and reserve availability
        const availability = await AvailabilityService.checkAvailability(
          input.propertyId,
          input.checkIn,
          input.checkOut,
          tx
        );

        if (!availability.isAvailable) {
          throw new Error(availability.reason || 'Dates not available');
        }

        // 2. Generate booking number
        const bookingNumber = await this.generateBookingNumber(tx);

        // 3. Create booking
        const booking = await tx.bookings.create({
          data: {
            id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            bookingNumber,
            propertyId: input.propertyId,
            guestName: input.guestName,
            guestEmail: input.guestEmail,
            guestPhone: input.guestPhone,
            guestCount: input.guestCount,
            checkIn: input.checkIn,
            checkOut: input.checkOut,
            totalNights: nights,
            basePrice: pricing.basePrice * nights,
            cleaningFee: pricing.cleaningFee,
            serviceFee: pricing.serviceFee,
            taxes: pricing.taxes,
            totalPrice: pricing.total,
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            specialRequests: input.specialRequests,
            promoCode: input.promoCode,
            promoDiscount: pricing.discounts.promo || 0,
            discountAmount: Object.values(pricing.discounts).reduce((a, b) => a + b, 0),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // 4. Block dates
        await tx.property_availability.create({
          data: {
            id: `avail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            propertyId: input.propertyId,
            startDate: input.checkIn,
            endDate: input.checkOut,
            isAvailable: false,
            blockReason: 'booked',
            notes: `Booking #${bookingNumber}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // 5. Increment inquiry counter
        await tx.properties.update({
          where: { id: input.propertyId },
          data: { inquiries: { increment: 1 } },
        });

        return booking;
      }, {
        isolationLevel: 'Serializable',
        timeout: 10000,
      });

      return { success: true, booking: result };
    } catch (error: any) {
      console.error('Booking creation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create booking',
      };
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(
    bookingId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Update booking status
        const booking = await tx.bookings.update({
          where: { id: bookingId },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancellationReason: reason,
            updatedAt: new Date(),
          },
        });

        // 2. Release dates
        await tx.property_availability.deleteMany({
          where: {
            propertyId: booking.propertyId,
            notes: { contains: `Booking #${booking.bookingNumber}` },
          },
        });
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Confirm booking
   */
  static async confirmBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await prisma.bookings.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate unique booking number
   */
  private static async generateBookingNumber(tx: any): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Get count for today
    const count = await tx.bookings.count({
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `BRN${year}${month}${sequence}`;
  }
}
