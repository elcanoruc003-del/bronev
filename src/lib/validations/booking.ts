import { z } from 'zod';

/**
 * Booking validation schemas
 */

export const createBookingSchema = z.object({
  propertyId: z.string().min(1, 'Property ID required'),
  checkIn: z.coerce.date().refine(
    (date) => date > new Date(),
    'Check-in must be in the future'
  ),
  checkOut: z.coerce.date(),
  guestCount: z.number().int().min(1).max(20),
  guestName: z.string().min(2).max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
  specialRequests: z.string().max(500).optional(),
  promoCode: z.string().max(20).optional(),
}).refine(
  (data) => data.checkOut > data.checkIn,
  {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  }
);

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'CHECKED_IN', 'CHECKED_OUT']),
  reason: z.string().max(500).optional(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1),
  reason: z.string().min(10).max(500),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
