export type PropertyType = 'VILLA' | 'APARTMENT' | 'HOUSE' | 'PENTHOUSE' | 'COTTAGE' | 'STUDIO' | 'LOFT';
export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'MAINTENANCE' | 'SUSPENDED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT';
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED' | 'FAILED';
export type UserRole = 'USER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';

export interface Property {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  basePricePerNight: number;
  cleaningFee: number;
  securityDeposit: number;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  area: number;
  maxGuests: number;
  minNights: number;
  maxNights: number;
  features: any;
  amenities: any;
  rules: any;
  status: PropertyStatus;
  featured: boolean;
  verified: boolean;
  views: number;
  inquiries: number;
  ownerId: string;
  images?: PropertyImage[];
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  isCover: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  propertyId: string;
  userId?: string;
  checkIn: Date;
  checkOut: Date;
  totalNights: number;
  totalPrice: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestCount: number;
  specialRequests?: string;
  promoCode?: string;
  promoDiscount: number;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  overallRating: number;
  cleanlinessRating: number;
  accuracyRating: number;
  communicationRating: number;
  locationRating: number;
  valueRating: number;
  comment: string;
  pros?: string;
  cons?: string;
  isPublished: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalProperties: number;
  activeProperties: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageRating: number;
  totalReviews: number;
  topPerformingProperty: {
    id: string;
    title: string;
    revenue: number;
    bookings: number;
  };
  recentActivity: any[];
  upcomingBookings: any[];
}

export interface PropertyStatistics {
  propertyId: string;
  period: 'day' | 'week' | 'month' | 'year';
  views: number;
  inquiries: number;
  bookings: number;
  revenue: number;
  occupancyRate: number;
  averageNightlyRate: number;
  conversionRate: number;
  responseRate: number;
  averageResponseTime: number;
}

export interface PriceCalculation {
  basePrice: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  weekendSurcharge: number;
  seasonalAdjustment: number;
  discounts: {
    weekly?: number;
    monthly?: number;
    promo?: number;
  };
  taxes: number;
  total: number;
  breakdown: PriceBreakdownItem[];
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
  type: 'charge' | 'discount' | 'tax';
}

export interface WhatsAppBookingMessage {
  propertyId: string;
  propertyTitle: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
