'use server'

import { prisma } from '@/lib/prisma'
import { propertySchema, bookingSchema } from '@/lib/validations/property'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { BookingService } from '@/lib/services/booking.service'
import { AnalyticsService } from '@/lib/services/analytics.service'

export async function getProperties(filters?: {
  city?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}) {
  try {
    const page = filters?.page || 1
    const limit = filters?.limit || 12
    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED', // Show only published properties
    }

    if (filters?.city && filters.city !== 'Hamısı') {
      where.city = filters.city
    }

    if (filters?.type && filters.type !== 'Hamısı') {
      where.type = filters.type
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.basePricePerNight = {}
      if (filters.minPrice) where.basePricePerNight.gte = filters.minPrice
      if (filters.maxPrice) where.basePricePerNight.lte = filters.maxPrice
    }

    const [properties, total] = await Promise.all([
      prisma.properties.findMany({
        where,
        include: { property_images: {
            orderBy: { order: 'asc' },
            take: 1,
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

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Get Properties Error:', error)
    throw new Error('Evlər yüklənərkən xəta baş verdi')
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    const property = await prisma.properties.findUnique({
      where: { slug },
      include: { property_images: {
          orderBy: { order: 'asc' },
        },
        users: {
          select: {
            name: true,
            phone: true,
          },
        },
        reviews: {
          include: {
            users: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (property) {
      await prisma.properties.update({
        where: { id: property.id },
        data: { views: { increment: 1 } },
      })
    }

    return property
  } catch (error) {
    console.error('Get Property Error:', error)
    return null
  }
}

export async function createProperty(data: any, ownerId: string) {
  try {
    const validated = propertySchema.parse(data)
    const slug = generateSlug(validated.title)

    const property = await prisma.properties.create({
      data: {
        ...validated,
        slug,
        ownerId,
      } as any,
    })

    revalidatePath('/')
    revalidatePath('/evler')

    return { success: true, property }
  } catch (error) {
    console.error('Create Property Error:', error)
    return { success: false, error: 'Ev əlavə edilərkən xəta baş verdi' }
  }
}

export async function updateProperty(id: string, data: any) {
  try {
    const validated = propertySchema.parse(data)
    const slug = generateSlug(validated.title)

    const property = await prisma.properties.update({
      where: { id },
      data: {
        ...validated,
        slug,
      },
    })

    revalidatePath('/')
    revalidatePath('/evler')
    revalidatePath(`/ev/${slug}`)

    return { success: true, property }
  } catch (error) {
    console.error('Update Property Error:', error)
    return { success: false, error: 'Ev yenilənərkən xəta baş verdi' }
  }
}

export async function deleteProperty(id: string) {
  try {
    await prisma.properties.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/evler')

    return { success: true }
  } catch (error) {
    console.error('Delete Property Error:', error)
    return { success: false, error: 'Ev silinərkən xəta baş verdi' }
  }
}

export async function createBooking(data: any) {
  try {
    // Use enterprise booking service with transaction
    const result = await BookingService.createBooking({
      propertyId: data.propertyId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      guestCount: data.guests || data.guestCount || 2,
      guestName: data.guestName,
      guestEmail: data.guestEmail || '',
      guestPhone: data.guestPhone,
      specialRequests: data.specialRequests,
      promoCode: data.promoCode,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath('/admin');
    return { success: true, booking: result.booking };
  } catch (error) {
    console.error('Create Booking Error:', error);
    return { success: false, error: 'Bron edilərkən xəta baş verdi' };
  }
}
