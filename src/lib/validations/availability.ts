import { z } from 'zod';

// Availability Schema
export const availabilitySchema = z.object({
  propertyId: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isAvailable: z.boolean().default(true),
  blockReason: z.enum(['maintenance', 'personal_use', 'booked', 'manual']).optional(),
  customPrice: z.number().int().positive().optional(),
  minNights: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Pricing Rule Schema
export const pricingRuleSchema = z.object({
  propertyId: z.string().cuid(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['SEASONAL', 'WEEKEND', 'HOLIDAY', 'EARLY_BIRD', 'LAST_MINUTE', 'LONG_STAY']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  adjustmentType: z.enum(['PERCENTAGE', 'FIXED']),
  adjustmentValue: z.number().int(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).default([]),
  priority: z.number().int().default(0),
  isActive: z.boolean().default(true),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Availability Check Schema
export const availabilityCheckSchema = z.object({
  propertyId: z.string().cuid(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().positive().optional(),
}).refine(
  (data) => data.checkOut > data.checkIn,
  {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  }
);

// Bulk Availability Update
export const bulkAvailabilitySchema = z.object({
  propertyId: z.string().cuid(),
  dates: z.array(z.coerce.date()).min(1),
  isAvailable: z.boolean(),
  blockReason: z.string().optional(),
  customPrice: z.number().int().positive().optional(),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type PricingRuleInput = z.infer<typeof pricingRuleSchema>;
export type AvailabilityCheckInput = z.infer<typeof availabilityCheckSchema>;
export type BulkAvailabilityInput = z.infer<typeof bulkAvailabilitySchema>;
