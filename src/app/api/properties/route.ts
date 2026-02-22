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
    const guests = searchParams.get('guests')
    const bedrooms = searchParams.get('bedrooms')
    const hasPool = searchParams.get('hasPool')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED', // Show only published properties
    }

    if (city && city !== 'Hamısı' && city.trim()) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (type && type !== 'Hamısı' && type.trim()) {
      where.type = type
    }

    if (minPrice || maxPrice) {
      where.basePricePerNight = {}
      if (minPrice) where.basePricePerNight.gte = parseInt(minPrice)
      if (maxPrice) where.basePricePerNight.lte = parseInt(maxPrice)
    }

    if (guests) {
      where.maxGuests = { gte: parseInt(guests) }
    }

    if (bedrooms) {
      where.bedrooms = { gte: parseInt(bedrooms) }
    }

    if (hasPool === 'true') {
      where.amenities = { has: 'Hovuz' }
    }

    const [properties, total] = await Promise.all([
      prisma.properties.findMany({
        where,
        include: { property_images: {
            orderBy: { order: 'asc' },
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

    // Map property_images to images for frontend compatibility
    const mappedProperties = properties.map((property: any) => ({
      ...property,
      images: property.property_images || [],
    }))

    return NextResponse.json({
      properties: mappedProperties,
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
