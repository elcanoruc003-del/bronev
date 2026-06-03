'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth';

async function getUserId(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user?.id || null;
  } catch (error) {
    console.error('Get user ID error:', error);
    return null;
  }
}

export async function toggleFavorite(propertyId: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Giriş etməlisiniz', requiresAuth: true };
    }

    const existing = await prisma.favorites.findUnique({
      where: { propertyId_userId: { propertyId, userId } },
    });

    if (existing) {
      await prisma.favorites.delete({ where: { id: existing.id } });
      return { success: true, isFavorite: false };
    } else {
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

export async function getUserFavorites() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: true, favorites: [] };

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

export async function isFavorited(propertyId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: true, isFavorite: false };

    const favorite = await prisma.favorites.findUnique({
      where: { propertyId_userId: { propertyId, userId } },
    });

    return { success: true, isFavorite: !!favorite };
  } catch (error) {
    console.error('Check favorite error:', error);
    return { success: true, isFavorite: false };
  }
}
