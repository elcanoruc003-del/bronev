import { prisma } from '@/lib/prisma';
import { differenceInDays, eachDayOfInterval, isWeekend } from 'date-fns';
import type { PriceCalculation } from '@/types/property';

/**
 * Enterprise Pricing Service
 * Handles dynamic pricing with multiple rules
 */

export class PricingService {
  private static readonly SERVICE_FEE_PERCENTAGE = 10; // 10%
  private static readonly TAX_PERCENTAGE = 18; // 18% VAT

  /**
   * Calculate total price for a booking
   */
  static async calculatePrice(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    promoCode?: string
  ): Promise<PriceCalculation> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        pricingRules: {
          where: {
            isActive: true,
            startDate: { lte: checkOut },
            endDate: { gte: checkIn },
          },
          orderBy: { priority: 'desc' },
        },
        availability: {
          where: {
            startDate: { lte: checkOut },
            endDate: { gte: checkIn },
          },
        },
      },
    });

    if (!property) throw new Error('Property not found');

    const nights = differenceInDays(checkOut, checkIn);
    if (nights < property.minNights) {
      throw new Error(`Minimum stay is ${property.minNights} nights`);
    }
    if (nights > property.maxNights) {
      throw new Error(`Maximum stay is ${property.maxNights} nights`);
    }

    // Calculate base price for each night
    const days = eachDayOfInterval({ start: checkIn, end: addDays(checkOut, -1) });
    let totalBasePrice = 0;
    let weekendSurcharge = 0;
    let seasonalAdjustment = 0;

    for (const day of days) {
      let dayPrice = property.basePricePerNight;

      // Check for custom pricing in availability
      const customPricing = property.availability.find(
        (av) => day >= av.startDate && day <= av.endDate && av.customPrice
      );

      if (customPricing?.customPrice) {
        dayPrice = customPricing.customPrice;
      } else {
        // Apply weekend multiplier
        if (isWeekend(day)) {
          const weekendExtra = Math.round(
            dayPrice * (property.weekendPriceMultiplier - 1)
          );
          weekendSurcharge += weekendExtra;
          dayPrice += weekendExtra;
        }

        // Apply pricing rules
        for (const rule of property.pricingRules) {
          if (day >= rule.startDate && day <= rule.endDate) {
            // Check day of week for weekend rules
            if (rule.daysOfWeek.length > 0) {
              const dayOfWeek = day.getDay();
              if (!rule.daysOfWeek.includes(dayOfWeek)) continue;
            }

            let adjustment = 0;
            if (rule.adjustmentType === 'PERCENTAGE') {
              adjustment = Math.round(dayPrice * (rule.adjustmentValue / 100));
            } else {
              adjustment = rule.adjustmentValue;
            }

            seasonalAdjustment += adjustment;
            dayPrice += adjustment;
          }
        }
      }

      totalBasePrice += dayPrice;
    }

    // Calculate discounts
    const discounts: PriceCalculation['discounts'] = {};

    // Weekly discount (7+ nights)
    if (nights >= 7 && property.weeklyDiscount > 0) {
      discounts.weekly = Math.round(
        totalBasePrice * (property.weeklyDiscount / 100)
      );
    }

    // Monthly discount (30+ nights)
    if (nights >= 30 && property.monthlyDiscount > 0) {
      discounts.monthly = Math.round(
        totalBasePrice * (property.monthlyDiscount / 100)
      );
    }

    // Promo code discount
    if (promoCode) {
      // TODO: Implement promo code validation
      discounts.promo = 0;
    }

    const totalDiscounts = Object.values(discounts).reduce((a, b) => a + b, 0);
    const subtotal = totalBasePrice - totalDiscounts;

    // Fees
    const cleaningFee = property.cleaningFee;
    const serviceFee = Math.round(subtotal * (this.SERVICE_FEE_PERCENTAGE / 100));
    const taxes = Math.round((subtotal + serviceFee) * (this.TAX_PERCENTAGE / 100));

    const total = subtotal + cleaningFee + serviceFee + taxes;

    // Build breakdown
    const breakdown: PriceCalculation['breakdown'] = [
      {
        label: `${nights} nights × base rate`,
        amount: property.basePricePerNight * nights,
        type: 'charge',
      },
    ];

    if (weekendSurcharge > 0) {
      breakdown.push({
        label: 'Weekend surcharge',
        amount: weekendSurcharge,
        type: 'charge',
      });
    }

    if (seasonalAdjustment > 0) {
      breakdown.push({
        label: 'Seasonal adjustment',
        amount: seasonalAdjustment,
        type: 'charge',
      });
    }

    if (discounts.weekly) {
      breakdown.push({
        label: `Weekly discount (${property.weeklyDiscount}%)`,
        amount: -discounts.weekly,
        type: 'discount',
      });
    }

    if (discounts.monthly) {
      breakdown.push({
        label: `Monthly discount (${property.monthlyDiscount}%)`,
        amount: -discounts.monthly,
        type: 'discount',
      });
    }

    if (cleaningFee > 0) {
      breakdown.push({
        label: 'Cleaning fee',
        amount: cleaningFee,
        type: 'charge',
      });
    }

    breakdown.push({
      label: `Service fee (${this.SERVICE_FEE_PERCENTAGE}%)`,
      amount: serviceFee,
      type: 'charge',
    });

    breakdown.push({
      label: `Taxes (${this.TAX_PERCENTAGE}%)`,
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
   * Get average nightly rate for a property
   */
  static async getAverageNightlyRate(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const calculation = await this.calculatePrice(propertyId, startDate, endDate);
    return Math.round(calculation.subtotal / calculation.nights);
  }
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
