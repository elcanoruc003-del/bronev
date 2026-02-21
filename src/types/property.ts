// Enterprise-level Property Types

export interface PropertyAvailabilityCheck {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
  blockedDates: Date[];
  customPricing: Map<string, number>;
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

export interface AvailabilityCalendar {
  month: number;
  year: number;
  days: CalendarDay[];
}

export interface CalendarDay {
  date: Date;
  isAvailable: boolean;
  price: number;
  minNights: number;
  isWeekend: boolean;
  isHoliday: boolean;
  blockReason?: string;
}

export interface PropertySearchFilters {
  city?: string;
  district?: string;
  type?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  instantBook?: boolean;
  featured?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
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
  averageResponseTime: number; // minutes
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
  recentActivity: ActivityItem[];
  upcomingBookings: BookingPreview[];
}

export interface ActivityItem {
  id: string;
  type: 'booking' | 'review' | 'inquiry' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  propertyId?: string;
  userId?: string;
}

export interface BookingPreview {
  id: string;
  bookingNumber: string;
  propertyTitle: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  totalPrice: number;
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
}
