export interface Property {
  id: string
  slug: string
  title: string
  description: string
  basePricePerNight: number
  city: string
  district: string
  address?: string
  type: PropertyType
  bedrooms: number
  bathrooms: number
  area: number
  features: string[]
  amenities: string[]
  status: PropertyStatus
  featured: boolean
  views: number
  inquiries: number
  images: PropertyImage[]
  createdAt: Date
  updatedAt: Date
}

export interface PropertyImage {
  id: string
  url: string
  alt?: string
  order: number
}

export interface Booking {
  id: string
  checkIn: Date
  checkOut: Date
  totalDays: number
  totalPrice: number
  status: BookingStatus
  guestName: string
  guestPhone: string
  guestEmail?: string
  message?: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  user: {
    name: string
  }
  createdAt: Date
}

export type PropertyType = 'VILLA' | 'APARTMENT' | 'HOUSE' | 'PENTHOUSE' | 'COTTAGE'
export type PropertyStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'INACTIVE'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type UserRole = 'USER' | 'ADMIN' | 'OWNER'
