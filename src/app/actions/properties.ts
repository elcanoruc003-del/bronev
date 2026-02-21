'use server'

import { prisma } from '@/lib/prisma'
import { propertySchema, bookingSchema } from '@/lib/validations/property'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

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
      status: 'AVAILABLE',
    }

    if (filters?.city && filters.city !== 'Hamısı') {
      where.city = filters.city
    }

    if (filters?.type && filters.type !== 'Hamısı') {
      where.type = filters.type
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.pricePerDay = {}
      if (filters.minPrice) where.pricePerDay.gte = filters.minPrice
      if (filters.maxPrice) where.pricePerDay.lte = filters.maxPrice
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
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
      prisma.property.count({ where }),
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
    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            name: true,
            phone: true,
          },
        },
        reviews: {
          include: {
            user: {
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
      await prisma.property.update({
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

    const property = await prisma.property.create({
      data: {
        ...validated,
        slug,
        ownerId,
      },
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

    const property = await prisma.property.update({
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
    await prisma.property.delete({
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
    const validated = bookingSchema.parse(data)

    const checkIn = new Date(validated.checkIn)
    const checkOut = new Date(validated.checkOut)
    const totalDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    const property = await prisma.property.findUnique({
      where: { id: validated.propertyId },
      select: { pricePerDay: true },
    })

    if (!property) {
      return { success: false, error: 'Ev tapılmadı' }
    }

    const totalPrice = totalDays * property.pricePerDay

    const booking = await prisma.booking.create({
      data: {
        ...validated,
        checkIn,
        checkOut,
        totalDays,
        totalPrice,
      },
    })

    await prisma.property.update({
      where: { id: validated.propertyId },
      data: { inquiries: { increment: 1 } },
    })

    return { success: true, booking }
  } catch (error) {
    console.error('Create Booking Error:', error)
    return { success: false, error: 'Bron edilərkən xəta baş verdi' }
  }
}
