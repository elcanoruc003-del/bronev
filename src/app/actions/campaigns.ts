'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

/**
 * Get all active campaigns
 */
export async function getActiveCampaigns() {
  try {
    const campaigns = await prisma.campaigns.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        properties: {
          select: {
            id: true,
            title: true,
            city: true,
            property_images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, campaigns };
  } catch (error) {
    console.error('Get campaigns error:', error);
    return { success: false, error: 'Kampaniyalar yüklənərkən xəta baş verdi' };
  }
}

/**
 * Get single campaign by slug
 */
export async function getCampaignBySlug(slug: string) {
  try {
    const campaign = await prisma.campaigns.findUnique({
      where: { slug },
      include: {
        properties: {
          select: {
            id: true,
            title: true,
            city: true,
            property_images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!campaign) {
      return { success: false, error: 'Kampaniya tapılmadı' };
    }

    return { success: true, campaign };
  } catch (error) {
    console.error('Get campaign error:', error);
    return { success: false, error: 'Kampaniya yüklənərkən xəta baş verdi' };
  }
}

/**
 * Participate in campaign (requires login)
 */
export async function participateInCampaign(
  campaignId: string,
  data: {
    participantName: string;
    participantPhone: string;
    receiptImage: string;
  }
) {
  try {
    // Check if user is logged in
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Kampaniyaya iştirak etmək üçün giriş etməlisiniz' };
    }

    // Check if campaign exists and is active
    const campaign = await prisma.campaigns.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return { success: false, error: 'Kampaniya tapılmadı' };
    }

    if (campaign.status !== 'ACTIVE') {
      return { success: false, error: 'Bu kampaniya aktiv deyil' };
    }

    // Check if user already participated
    const existingParticipation = await prisma.campaign_participants.findUnique({
      where: {
        campaignId_userId: {
          campaignId,
          userId: user.id,
        },
      },
    });

    if (existingParticipation) {
      return { success: false, error: 'Siz artıq bu kampaniyada iştirak edirsiniz' };
    }

    // Check max participants limit
    if (campaign.maxParticipants) {
      const participantCount = await prisma.campaign_participants.count({
        where: {
          campaignId,
          status: 'APPROVED',
        },
      });

      if (participantCount >= campaign.maxParticipants) {
        return { success: false, error: 'Kampaniya iştirakçı limiti dolub' };
      }
    }

    // Generate ticket number
    const participantCount = await prisma.campaign_participants.count({
      where: { campaignId },
    });
    const ticketNumber = `TKT-${campaignId.slice(0, 8).toUpperCase()}-${String(participantCount + 1).padStart(4, '0')}`;

    // Create participation
    const participation = await prisma.campaign_participants.create({
      data: {
        id: `cpart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        campaignId,
        userId: user.id,
        participantName: data.participantName,
        participantPhone: data.participantPhone,
        receiptImage: data.receiptImage,
        status: 'PENDING',
        ticketNumber,
      },
    });

    revalidatePath('/campaigns');
    revalidatePath('/profile');

    return {
      success: true,
      participation,
      message: 'İştirakınız uğurla qeydə alındı. Çəkiniz yoxlanıldıqdan sonra təsdiqlənəcək.',
    };
  } catch (error) {
    console.error('Participate error:', error);
    return { success: false, error: 'İştirak zamanı xəta baş verdi' };
  }
}

/**
 * Get user's campaign participations
 */
export async function getUserCampaignParticipations() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Giriş tələb olunur' };
    }

    const participations = await prisma.campaign_participants.findMany({
      where: {
        userId: user.id,
      },
      include: {
        campaigns: {
          include: {
            properties: {
              select: {
                title: true,
                property_images: {
                  take: 1,
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return { success: true, participations };
  } catch (error) {
    console.error('Get participations error:', error);
    return { success: false, error: 'İştiraklar yüklənərkən xəta baş verdi' };
  }
}

/**
 * Check if user participated in a campaign
 */
export async function checkUserParticipation(campaignId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: true, participated: false };
    }

    const participation = await prisma.campaign_participants.findUnique({
      where: {
        campaignId_userId: {
          campaignId,
          userId: user.id,
        },
      },
    });

    return {
      success: true,
      participated: !!participation,
      participation: participation || null,
    };
  } catch (error) {
    console.error('Check participation error:', error);
    return { success: false, error: 'Yoxlama zamanı xəta baş verdi' };
  }
}
