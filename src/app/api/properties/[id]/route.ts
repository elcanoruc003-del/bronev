import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    
    console.log('[Detail API] Fetching property:', params.id);
    
    const property = await prisma.properties.findUnique({
      where: { id: params.id },
      include: {
        property_images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!property) {
      console.log('[Detail API] Property not found:', params.id);
      return NextResponse.json(
        { error: 'Property not found', property: null },
        { status: 404 }
      )
    }

    console.log('[Detail API] Found property with', property.property_images?.length || 0, 'images');

    // Map property_images to images for frontend compatibility
    const mappedProperty = {
      ...property,
      images: property.property_images || [],
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      features: Array.isArray(property.features) ? property.features : [],
    }

    console.log('[Detail API] Returning property with', mappedProperty.images.length, 'images');

    return NextResponse.json({ property: mappedProperty })
  } catch (error) {
    console.error('Property Detail API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property', property: null },
      { status: 500 }
    )
  }
}
