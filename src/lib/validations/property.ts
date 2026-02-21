import { z } from 'zod';

// Enhanced Property Schema for Enterprise
export const propertySchema = z.object({
  // Basic Info
  title: z.string().min(10, 'Başlıq minimum 10 simvol olmalıdır').max(100),
  shortDescription: z.string().min(50, 'Qısa təsvir minimum 50 simvol olmalıdır').max(300),
  longDescription: z.string().min(100, 'Uzun təsvir minimum 100 simvol olmalıdır'),
  
  // Pricing
  basePricePerNight: z.number().min(1, 'Qiymət 0-dan böyük olmalıdır'),
  weeklyPrice: z.number().optional(),
  monthlyPrice: z.number().optional(),
  cleaningFee: z.number().min(0).default(0),
  securityDeposit: z.number().min(0).default(0),
  extraGuestFee: z.number().min(0).default(0),
  
  // Discounts
  weekendPriceMultiplier: z.number().min(1).max(3).default(1.0),
  weeklyDiscount: z.number().min(0).max(50).default(0),
  monthlyDiscount: z.number().min(0).max(50).default(0),
  
  // Location
  country: z.string().default('Azerbaijan'),
  city: z.string().min(2),
  district: z.string().min(2),
  address: z.string().min(5),
  zipCode: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  
  // Property Details
  type: z.enum(['VILLA', 'APARTMENT', 'HOUSE', 'PENTHOUSE', 'COTTAGE', 'STUDIO', 'LOFT']),
  bedrooms: z.number().min(0).max(20),
  beds: z.number().min(1).max(50),
  bathrooms: z.number().min(0.5).max(20),
  area: z.number().min(10).max(10000),
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  maxGuests: z.number().min(1).max(50),
  minNights: z.number().min(1).max(365).default(1),
  maxNights: z.number().min(1).max(365).default(365),
  
  // Check-in/out
  checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('14:00'),
  checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('12:00'),
  
  // Features (JSON)
  amenities: z.any().default([]),
  features: z.any().default([]),
  rules: z.any().default({}),
  
  // Status
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'MAINTENANCE', 'SUSPENDED']).default('DRAFT'),
  featured: z.boolean().default(false),
  instantBook: z.boolean().default(false),
  
  // Badges
  badges: z.array(z.string()).default([]),
  
  // SEO
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url().optional(),
}).refine(
  (data) => !data.weeklyPrice || data.weeklyPrice < data.basePricePerNight * 7,
  {
    message: 'Həftəlik qiymət günlük qiymətdən ucuz olmalıdır',
    path: ['weeklyPrice'],
  }
).refine(
  (data) => !data.monthlyPrice || data.monthlyPrice < data.basePricePerNight * 30,
  {
    message: 'Aylıq qiymət günlük qiymətdən ucuz olmalıdır',
    path: ['monthlyPrice'],
  }
).refine(
  (data) => data.maxNights >= data.minNights,
  {
    message: 'Maksimum gecə minimum gecədən çox olmalıdır',
    path: ['maxNights'],
  }
);

export const bookingSchema = z.object({
  propertyId: z.string().cuid(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().min(1).max(50),
  guestName: z.string().min(2, 'Ad daxil edin'),
  guestPhone: z.string().regex(/^(\+994|0)[0-9]{9}$/, 'Düzgün telefon nömrəsi daxil edin'),
  guestEmail: z.string().email('Düzgün email daxil edin').optional(),
  specialRequests: z.string().max(500).optional(),
  promoCode: z.string().optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: 'Çıxış tarixi giriş tarixindən sonra olmalıdır',
  path: ['checkOut'],
});

export const reviewSchema = z.object({
  propertyId: z.string().cuid(),
  overallRating: z.number().min(1).max(5),
  cleanlinessRating: z.number().min(1).max(5),
  accuracyRating: z.number().min(1).max(5),
  locationRating: z.number().min(1).max(5),
  valueRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Rəy ən azı 10 simvol olmalıdır').max(1000),
  pros: z.string().max(500).optional(),
  cons: z.string().max(500).optional(),
  images: z.array(z.string().url()).max(5).default([]),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
