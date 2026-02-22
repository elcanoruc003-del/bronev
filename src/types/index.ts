export type PropertyType = 'VILLA' | 'APARTMENT' | 'HOUSE' | 'PENTHOUSE' | 'COTTAGE' | 'STUDIO' | 'LOFT';
export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'MAINTENANCE' | 'SUSPENDED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT';
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED' | 'FAILED';
export type UserRole = 'USER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';

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