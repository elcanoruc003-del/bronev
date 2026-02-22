import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.properties.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Ev tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
}
