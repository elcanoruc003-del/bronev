import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import type { DashboardMetrics, PropertyStatistics } from '@/types/property';

/**
 * Enterprise Analytics Service
 * Real-time statistics and insights
 */

export class AnalyticsService {
  /**
   * Get comprehensive dashboard metrics
   */
  static async getDashboardMetrics(ownerId?: string): Promise<DashboardMetrics> {
    const whereClause = ownerId ? { ownerId } : {};

    // Parallel queries for performance
    const [
      totalProperties,
      activeProperties,
      bookings,
      pendingBookings,
      confirmedBookings,
      reviews,
      topProperty,
    ] = await Promise.all([
      // Total properties
      prisma.property.count({ where: whereClause }),

      // Active properties
      prisma.property.count({
        where: { ...whereClause, status: 'PUBLISHED' },
      }),

      // All bookings
      prisma.booking.findMany({
        where: ownerId
          ? { property: { ownerId } }
          : {},
        include: {
          property: {
            select: { title: true },
          },
        },
      }),

      // Pending bookings
      prisma.booking.count({
        where: {
          ...(ownerId ? { property: { ownerId } } : {}),
          status: 'PENDING',
        },
      }),

      // Confirmed bookings
      prisma.booking.count({
        where: {
          ...(ownerId ? { property: { ownerId } } : {}),
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        },
      }),

      // Reviews
      prisma.review.findMany({
        where: ownerId
          ? { property: { ownerId } }
          : {},
      }),

      // Top performing property
      prisma.property.findFirst({
        where: whereClause,
        orderBy: { bookings: 'desc' },
        select: {
          id: true,
          title: true,
          bookings: true,
          _count: {
            select: { bookingRequests: true },
          },
        },
      }),
    ]);

    // Calculate revenue
    const totalRevenue = bookings
      .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const currentMonth = new Date();
    const monthlyRevenue = bookings
      .filter(
        (b) =>
          (b.status === 'COMPLETED' || b.status === 'CONFIRMED') &&
          b.createdAt >= startOfMonth(currentMonth) &&
          b.createdAt <= endOfMonth(currentMonth)
      )
      .reduce((sum, b) => sum + b.totalPrice, 0);

    // Calculate occupancy rate (last 30 days)
    const last30Days = subDays(new Date(), 30);
    const bookedNights = bookings
      .filter(
        (b) =>
          b.status === 'CONFIRMED' &&
          b.checkIn >= last30Days
      )
      .reduce((sum, b) => sum + b.totalNights, 0);
    const totalPossibleNights = activeProperties * 30;
    const occupancyRate = totalPossibleNights > 0
      ? (bookedNights / totalPossibleNights) * 100
      : 0;

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
      : 0;

    // Recent activity
    const recentActivity = await this.getRecentActivity(ownerId, 10);

    // Upcoming bookings
    const upcomingBookings = bookings
      .filter(
        (b) =>
          b.status === 'CONFIRMED' &&
          b.checkIn >= new Date()
      )
      .sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime())
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        bookingNumber: b.bookingNumber,
        propertyTitle: b.property.title,
        guestName: b.guestName,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status,
        totalPrice: b.totalPrice,
      }));

    return {
      totalProperties,
      activeProperties,
      totalBookings: bookings.length,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
      monthlyRevenue,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      topPerformingProperty: topProperty
        ? {
            id: topProperty.id,
            title: topProperty.title,
            revenue: bookings
              .filter((b) => b.propertyId === topProperty.id)
              .reduce((sum, b) => sum + b.totalPrice, 0),
            bookings: topProperty._count.bookingRequests,
          }
        : {
            id: '',
            title: 'N/A',
            revenue: 0,
            bookings: 0,
          },
      recentActivity,
      upcomingBookings,
    };
  }

  /**
   * Get property-specific statistics
   */
  static async getPropertyStatistics(
    propertyId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<PropertyStatistics> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'year':
        startDate = subMonths(now, 12);
        break;
    }

    const [property, bookings, reviews] = await Promise.all([
      prisma.property.findUnique({
        where: { id: propertyId },
        select: {
          views: true,
          inquiries: true,
          basePricePerNight: true,
        },
      }),

      prisma.booking.findMany({
        where: {
          propertyId,
          createdAt: { gte: startDate },
        },
      }),

      prisma.review.findMany({
        where: {
          propertyId,
          createdAt: { gte: startDate },
        },
      }),
    ]);

    if (!property) throw new Error('Property not found');

    const confirmedBookings = bookings.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED'
    );

    const revenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalNights = confirmedBookings.reduce((sum, b) => sum + b.totalNights, 0);

    // Calculate occupancy rate
    const daysInPeriod = Math.ceil(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const occupancyRate = daysInPeriod > 0 ? (totalNights / daysInPeriod) * 100 : 0;

    // Calculate average nightly rate
    const averageNightlyRate = totalNights > 0 ? revenue / totalNights : property.basePricePerNight;

    // Calculate conversion rate
    const conversionRate = property.inquiries > 0
      ? (confirmedBookings.length / property.inquiries) * 100
      : 0;

    // Calculate response metrics (mock for now)
    const responseRate = 95; // TODO: Implement real response tracking
    const averageResponseTime = 45; // minutes

    return {
      propertyId,
      period,
      views: property.views,
      inquiries: property.inquiries,
      bookings: confirmedBookings.length,
      revenue,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      averageNightlyRate: Math.round(averageNightlyRate),
      conversionRate: Math.round(conversionRate * 10) / 10,
      responseRate,
      averageResponseTime,
    };
  }

  /**
   * Track property view
   */
  static async trackView(propertyId: string): Promise<void> {
    await prisma.property.update({
      where: { id: propertyId },
      data: { views: { increment: 1 } },
    });
  }

  /**
   * Track inquiry
   */
  static async trackInquiry(propertyId: string): Promise<void> {
    await prisma.property.update({
      where: { id: propertyId },
      data: { inquiries: { increment: 1 } },
    });
  }

  /**
   * Get recent activity feed
   */
  private static async getRecentActivity(
    ownerId: string | undefined,
    limit: number
  ) {
    const whereClause = ownerId ? { property: { ownerId } } : {};

    const [recentBookings, recentReviews] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { id: true, title: true } },
        },
      }),

      prisma.review.findMany({
        where: ownerId ? { property: { ownerId } } : {},
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { id: true, title: true } },
          user: { select: { name: true } },
        },
      }),
    ]);

    const activities = [
      ...recentBookings.map((b) => ({
        id: b.id,
        type: 'booking' as const,
        title: 'Yeni bron sorğusu',
        description: `${b.guestName} - ${b.property.title}`,
        timestamp: b.createdAt,
        propertyId: b.propertyId,
        userId: b.userId || undefined,
      })),
      ...recentReviews.map((r) => ({
        id: r.id,
        type: 'review' as const,
        title: 'Yeni rəy',
        description: `${r.user.name} - ${r.property.title} (${r.overallRating}⭐)`,
        timestamp: r.createdAt,
        propertyId: r.propertyId,
        userId: r.userId,
      })),
    ];

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get revenue chart data
   */
  static async getRevenueChartData(
    ownerId: string | undefined,
    months: number = 12
  ): Promise<{ month: string; revenue: number }[]> {
    const startDate = subMonths(new Date(), months);

    const bookings = await prisma.booking.findMany({
      where: {
        ...(ownerId ? { property: { ownerId } } : {}),
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        createdAt: { gte: startDate },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    // Group by month
    const revenueByMonth = new Map<string, number>();

    bookings.forEach((booking) => {
      const monthKey = booking.createdAt.toISOString().slice(0, 7); // YYYY-MM
      const current = revenueByMonth.get(monthKey) || 0;
      revenueByMonth.set(monthKey, current + booking.totalPrice);
    });

    // Convert to array and sort
    return Array.from(revenueByMonth.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
