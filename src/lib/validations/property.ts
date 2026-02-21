import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(10, 'Başlıq ən azı 10 simvol olmalıdır').max(100),
  description: z.string().min(50, 'Təsvir ən azı 50 simvol olmalıdır'),
  pricePerDay: z.number().min(1, 'Qiymət 0-dan böyük olmalıdır'),
  city: z.string().min(2, 'Şəhər seçin'),
  district: z.string().min(2, 'Rayon daxil edin'),
  address: z.string().optional(),
  type: z.enum(['VILLA', 'APARTMENT', 'HOUSE', 'PENTHOUSE', 'COTTAGE']),
  bedrooms: z.number().min(1).max(20),
  bathrooms: z.number().min(1).max(10),
  area: z.number().min(10).max(10000),
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
})

export const bookingSchema = z.object({
  propertyId: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  guestName: z.string().min(2, 'Ad daxil edin'),
  guestPhone: z.string().regex(/^(\+994|0)[0-9]{9}$/, 'Düzgün telefon nömrəsi daxil edin'),
  guestEmail: z.string().email('Düzgün email daxil edin').optional(),
  message: z.string().optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: 'Çıxış tarixi giriş tarixindən sonra olmalıdır',
  path: ['checkOut'],
})

export const reviewSchema = z.object({
  propertyId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Rəy ən azı 10 simvol olmalıdır').max(500),
})

export type PropertyInput = z.infer<typeof propertySchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
