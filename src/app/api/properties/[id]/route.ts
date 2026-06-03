import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Next.js 15: params is a Promise
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { prisma } = await import('@/lib/prisma')

    const property = await prisma.properties.findUnique({
      where: { id },
      include: {
        property_images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found', property: null },
        { status: 404 }
      )
    }

    // Increment view count (non-blocking)
    prisma.properties.update({
      where: { id },
      data: { views: { increment: 1 } },
    }).catch(() => {})

    const mappedProperty = {
      ...property,
      images: property.property_images || [],
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      features: Array.isArray(property.features) ? property.features : [],
    }

    return NextResponse.json({ property: mappedProperty })
  } catch (error) {
    console.error('Property Detail API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property', property: null },
      { status: 500 }
    )
  }
}
