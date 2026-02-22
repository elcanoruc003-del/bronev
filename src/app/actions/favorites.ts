'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

/**
 * Get user ID from session (simplified - using phone as identifier)
 */
async function getUserId(): Promise<string | null> {
  try {
    // For now, use a simple cookie-based system
    const userPhone = cookies().get('user_phone')?.value;
    if (!userPhone) return null;

    // Find or create user
    let user = await prisma.users.findUnique({
      where: { phone: userPhone },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          phone: userPhone,
          name: 'Qonaq',
          email: `${userPhone}@guest.com`,
          password: 'guest', // Not used for guests
          updatedAt: new Date(),
        },
      });
    }

    return user.id;
  } catch (error) {
    console.error('Get user ID error:', error);
    return null;
  }
}

/**
 * Set user phone in cookie
 */
export async function setUserPhone(phone: string) {
  cookies().set('user_phone', phone, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
  return { success: true };
}

/**
 * Toggle favorite
 */
export async function toggleFavorite(propertyId: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'İstifadəçi tapılmadı' };
    }

    // Check if already favorited
    const existing = await prisma.favorites.findUnique({
      where: {
        propertyId_userId: {
          propertyId,
          userId,
        },
      },
    });

    if (existing) {
      // Remove from favorites
      await prisma.favorites.delete({
        where: { id: existing.id },
      });
      return { success: true, isFavorite: false };
    } else {
      // Add to favorites
      await prisma.favorites.create({
        data: {
          id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          propertyId,
          userId,
        },
      });
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return { success: false, error: 'Xəta baş verdi' };
  }
}

/**
 * Get user favorites
 */
export async function getUserFavorites() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: true, favorites: [] };
    }

    const favorites = await prisma.favorites.findMany({
      where: { userId },
      include: {
        properties: {
          include: {
            property_images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, favorites };
  } catch (error) {
    console.error('Get favorites error:', error);
    return { success: false, favorites: [], error: 'Xəta baş verdi' };
  }
}

/**
 * Check if property is favorited
 */
export async function isFavorited(propertyId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: true, isFavorite: false };

    const favorite = await prisma.favorites.findUnique({
      where: {
        propertyId_userId: {
          propertyId,
          userId,
        },
      },
    });

    return { success: true, isFavorite: !!favorite };
  } catch (error) {
    console.error('Check favorite error:', error);
    return { success: true, isFavorite: false };
  }
}
