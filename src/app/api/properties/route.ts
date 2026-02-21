import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {
      status: 'AVAILABLE',
    }

    if (city && city !== 'Hamısı') {
      where.city = city
    }

    if (type && type !== 'Hamısı') {
      where.type = type
    }

    if (minPrice || maxPrice) {
      where.basePricePerNight = {}
      if (minPrice) where.basePricePerNight.gte = parseInt(minPrice)
      if (maxPrice) where.basePricePerNight.lte = parseInt(maxPrice)
    }

    const [properties, total] = await Promise.all([
      prisma.properties.findMany({
        where,
        include: { property_images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.properties.count({ where }),
    ])

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Properties API Error:', error)
    return NextResponse.json(
      { error: 'Database not configured', properties: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } },
      { status: 200 }
    )
  }
}
