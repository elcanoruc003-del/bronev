import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Environment Check API
 * Check if environment variables are set correctly
 * 
 * Usage: GET https://bron-ev.com/api/check-env?secret=CHECK_SECRET_2024
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple security check
    if (secret !== 'CHECK_SECRET_2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        DATABASE_URL: {
          exists: !!process.env.DATABASE_URL,
          value: process.env.DATABASE_URL 
            ? `${process.env.DATABASE_URL.substring(0, 20)}...` 
            : 'NOT SET',
        },
        NEXT_PUBLIC_PHONE_NUMBER: {
          exists: !!process.env.NEXT_PUBLIC_PHONE_NUMBER,
          value: process.env.NEXT_PUBLIC_PHONE_NUMBER || 'NOT SET',
        },
        NEXT_PUBLIC_WHATSAPP_NUMBER: {
          exists: !!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
          value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'NOT SET',
        },
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: {
          exists: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          value: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'NOT SET',
        },
      },
    };

    // Try database connection
    let dbStatus = 'UNKNOWN';
    let dbError = null;
    let userCount = 0;

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'CONNECTED';
      
      // Count users
      userCount = await prisma.users.count();
    } catch (error: any) {
      dbStatus = 'FAILED';
      dbError = error.message;
    }

    return NextResponse.json({
      ...checks,
      database: {
        status: dbStatus,
        error: dbError,
        userCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Check failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
