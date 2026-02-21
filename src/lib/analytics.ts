import { prisma } from './prisma'

export interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalViews: number
  totalInquiries: number
  totalBookings: number
  conversionRate: number
  averagePrice: number
  topPerformingProperty: {
    id: string
    title: string
    views: number
    inquiries: number
  } | null
  recentActivity: Array<{
    type: 'view' | 'inquiry' | 'booking'
    propertyTitle: string
    timestamp: Date
  }>
  viewsByCity: Array<{
    city: string
    count: number
  }>
  priceDistribution: Array<{
    range: string
    count: number
  }>
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get all properties with aggregations
    const [
      totalProperties,
      activeProperties,
      properties,
      bookings,
    ] = await Promise.all([
      prisma.properties.count(),
      prisma.properties.count({ where: { status: 'PUBLISHED' as any } }),
      prisma.properties.findMany({
        select: {
          id: true,
          title: true,
          basePricePerNight: true,
          views: true,
          inquiries: true,
          city: true,
          status: true,
        },
      }),
      prisma.bookings.count(),
    ])

    // Calculate totals
    const totalViews = properties.reduce((sum: number, p: any) => sum + p.views, 0)
    const totalInquiries = properties.reduce((sum: number, p: any) => sum + p.inquiries, 0)
    
    // Calculate conversion rate (inquiries / views * 100)
    const conversionRate = totalViews > 0 
      ? Number(((totalInquiries / totalViews) * 100).toFixed(2))
      : 0

    // Calculate average price
    const averagePrice = properties.length > 0
      ? Math.round(properties.reduce((sum: number, p: any) => sum + p.basePricePerNight, 0) / properties.length)
      : 0

    // Find top performing property
    const topPerformingProperty = properties.length > 0
      ? properties.reduce((top: any, current: any) => {
          const topScore = top.views + (top.inquiries * 10)
          const currentScore = current.views + (current.inquiries * 10)
          return currentScore > topScore ? current : top
        })
      : null

    // Views by city
    const viewsByCity = properties.reduce((acc: Array<{ city: string; count: number }>, property: any) => {
      const existing = acc.find((item: any) => item.city === property.city)
      if (existing) {
        existing.count += property.views
      } else {
        acc.push({ city: property.city, count: property.views })
      }
      return acc
    }, [] as Array<{ city: string; count: number }>)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)

    // Price distribution
    const priceRanges = [
      { range: '0-100₼', min: 0, max: 100 },
      { range: '100-200₼', min: 100, max: 200 },
      { range: '200-300₼', min: 200, max: 300 },
      { range: '300-500₼', min: 300, max: 500 },
      { range: '500+₼', min: 500, max: Infinity },
    ]

    const priceDistribution = priceRanges.map(range => ({
      range: range.range,
      count: properties.filter((p: any) => 
        p.basePricePerNight >= range.min && p.basePricePerNight < range.max
      ).length,
    }))

    // Recent activity (mock for now, will be real with activity log)
    const recentActivity = properties
      .slice(0, 5)
      .map((p: any) => ({
        type: 'view' as const,
        propertyTitle: p.title,
        timestamp: new Date(),
      }))

    return {
      totalProperties,
      activeProperties,
      totalViews,
      totalInquiries,
      totalBookings: bookings,
      conversionRate,
      averagePrice,
      topPerformingProperty: topPerformingProperty ? {
        id: topPerformingProperty.id,
        title: topPerformingProperty.title,
        views: topPerformingProperty.views,
        inquiries: topPerformingProperty.inquiries,
      } : null,
      recentActivity,
      viewsByCity,
      priceDistribution,
    }
  } catch (error) {
    console.error('Dashboard Stats Error:', error)
    throw new Error('Statistika yüklənərkən xəta baş verdi')
  }
}

export async function trackPropertyView(propertyId: string) {
  try {
    await prisma.properties.update({
      where: { id: propertyId },
      data: { views: { increment: 1 } },
    })
  } catch (error) {
    console.error('Track View Error:', error)
  }
}

export async function trackPropertyInquiry(propertyId: string) {
  try {
    await prisma.properties.update({
      where: { id: propertyId },
      data: { inquiries: { increment: 1 } },
    })
  } catch (error) {
    console.error('Track Inquiry Error:', error)
  }
}

// Real-time stats calculation
export function calculatePerformanceScore(views: number, inquiries: number): number {
  // Score formula: views + (inquiries * 10)
  // Higher weight for inquiries as they indicate higher engagement
  return views + (inquiries * 10)
}

export function getPerformanceRating(score: number): {
  rating: string
  color: string
  description: string
} {
  if (score >= 500) {
    return {
      rating: 'Əla',
      color: 'text-green-600',
      description: 'Çox yüksək performans',
    }
  } else if (score >= 300) {
    return {
      rating: 'Yaxşı',
      color: 'text-blue-600',
      description: 'Yaxşı performans',
    }
  } else if (score >= 100) {
    return {
      rating: 'Orta',
      color: 'text-yellow-600',
      description: 'Orta performans',
    }
  } else {
    return {
      rating: 'Zəif',
      color: 'text-red-600',
      description: 'Təkmilləşdirmə lazımdır',
    }
  }
}
