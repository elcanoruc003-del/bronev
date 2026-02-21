import { prisma } from '@/lib/prisma';
import { differenceInDays, eachDayOfInterval, getDay, isWeekend } from 'date-fns';
import type { PriceCalculation } from '@/types/property';

/**
 * Enterprise Pricing Service
 * Dynamic pricing with weekend, seasonal, and discount rules
 */

export class PricingService {
  private static readonly SERVICE_FEE_PERCENTAGE = 10;
  private static readonly TAX_PERCENTAGE = 18;

  /**
   * Calculate comprehensive price breakdown
   */
  static async calculatePrice(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    guestCount: number,
    promoCode?: string
  ): Promise<PriceCalculation> {
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
      select: {
        basePricePerNight: true,
        cleaningFee: true,
        securityDeposit: true,
        extraGuestFee: true,
        maxGuests: true,
        minNights: true,
        maxNights: true,
        weeklyDiscount: true,
        monthlyDiscount: true,
        weekendPriceMultiplier: true,
        pricing_rules: {
          where: {
            isActive: true,
            startDate: { lte: checkOut },
            endDate: { gte: checkIn },
          },
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!property) throw new Error('Property not found');

    const nights = differenceInDays(checkOut, checkIn);
    
    // Validate
    if (nights < property.minNights) {
      throw new Error(`Minimum ${property.minNights} nights required`);
    }
    if (nights > property.maxNights) {
      throw new Error(`Maximum ${property.maxNights} nights allowed`);
    }
    if (guestCount > property.maxGuests) {
      throw new Error(`Maximum ${property.maxGuests} guests allowed`);
    }

    // Calculate nightly prices with dynamic rules
    const days = eachDayOfInterval({ start: checkIn, end: checkOut });
    let totalBasePrice = 0;
    let weekendSurcharge = 0;
    let seasonalAdjustment = 0;

    for (const day of days) {
      let dayPrice = property.basePricePerNight;

      // Weekend pricing
      if (isWeekend(day) && property.weekendPriceMultiplier > 1) {
        const surcharge = Math.round(
          dayPrice * (property.weekendPriceMultiplier - 1)
        );
        weekendSurcharge += surcharge;
        dayPrice += surcharge;
      }

      // Seasonal pricing rules
      for (const rule of property.pricing_rules) {
        if (day >= rule.startDate && day <= rule.endDate) {
          if (rule.adjustmentType === 'PERCENTAGE') {
            const adjustment = Math.round(dayPrice * (rule.adjustmentValue / 100));
            seasonalAdjustment += adjustment;
            dayPrice += adjustment;
          } else {
            seasonalAdjustment += rule.adjustmentValue;
            dayPrice += rule.adjustmentValue;
          }
          break; // Use highest priority rule only
        }
      }

      totalBasePrice += dayPrice;
    }

    // Extra guest fee
    const extraGuests = Math.max(0, guestCount - 2);
    const extraGuestTotal = extraGuests * property.extraGuestFee * nights;

    // Discounts
    const discounts: PriceCalculation['discounts'] = {};

    if (nights >= 7 && property.weeklyDiscount > 0) {
      discounts.weekly = Math.round(totalBasePrice * (property.weeklyDiscount / 100));
    }

    if (nights >= 30 && property.monthlyDiscount > 0) {
      discounts.monthly = Math.round(totalBasePrice * (property.monthlyDiscount / 100));
    }

    // Promo code (placeholder)
    if (promoCode) {
      const promo = await this.validatePromoCode(promoCode, propertyId);
      if (promo) {
        discounts.promo = promo.discountAmount;
      }
    }

    const totalDiscounts = Object.values(discounts).reduce((a, b) => a + b, 0);
    const subtotal = totalBasePrice + extraGuestTotal - totalDiscounts;

    // Fees
    const cleaningFee = property.cleaningFee;
    const serviceFee = Math.round(subtotal * (this.SERVICE_FEE_PERCENTAGE / 100));
    const taxes = Math.round((subtotal + serviceFee) * (this.TAX_PERCENTAGE / 100));
    const total = subtotal + cleaningFee + serviceFee + taxes;

    // Build breakdown
    const breakdown: PriceCalculation['breakdown'] = [
      {
        label: `${nights} gecə × ${property.basePricePerNight}₼`,
        amount: property.basePricePerNight * nights,
        type: 'charge',
      },
    ];

    if (weekendSurcharge > 0) {
      breakdown.push({
        label: 'Həftəsonu əlavəsi',
        amount: weekendSurcharge,
        type: 'charge',
      });
    }

    if (seasonalAdjustment > 0) {
      breakdown.push({
        label: 'Mövsümi qiymət',
        amount: seasonalAdjustment,
        type: 'charge',
      });
    }

    if (extraGuestTotal > 0) {
      breakdown.push({
        label: `Əlavə qonaq (${extraGuests} nəfər)`,
        amount: extraGuestTotal,
        type: 'charge',
      });
    }

    if (discounts.weekly) {
      breakdown.push({
        label: `Həftəlik endirim (${property.weeklyDiscount}%)`,
        amount: -discounts.weekly,
        type: 'discount',
      });
    }

    if (discounts.monthly) {
      breakdown.push({
        label: `Aylıq endirim (${property.monthlyDiscount}%)`,
        amount: -discounts.monthly,
        type: 'discount',
      });
    }

    if (discounts.promo) {
      breakdown.push({
        label: `Promo kod: ${promoCode}`,
        amount: -discounts.promo,
        type: 'discount',
      });
    }

    if (cleaningFee > 0) {
      breakdown.push({
        label: 'Təmizlik haqqı',
        amount: cleaningFee,
        type: 'charge',
      });
    }

    breakdown.push({
      label: `Xidmət haqqı (${this.SERVICE_FEE_PERCENTAGE}%)`,
      amount: serviceFee,
      type: 'charge',
    });

    breakdown.push({
      label: `ƏDV (${this.TAX_PERCENTAGE}%)`,
      amount: taxes,
      type: 'tax',
    });

    return {
      basePrice: property.basePricePerNight,
      nights,
      subtotal,
      cleaningFee,
      serviceFee,
      weekendSurcharge,
      seasonalAdjustment,
      discounts,
      taxes,
      total,
      breakdown,
    };
  }

  /**
   * Validate promo code
   */
  private static async validatePromoCode(
    code: string,
    propertyId: string
  ): Promise<{ discountAmount: number } | null> {
    // TODO: Implement promo code table and validation
    return null;
  }
}
