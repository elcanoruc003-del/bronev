import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const cloudName = 'dyfaasdbm';
    const apiKey = '526295514959981';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'JoV-VfaQi9m3TyZRoJtcJP8Vemo';
    
    // Test signature generation
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'bronev/properties';
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    return NextResponse.json({
      success: true,
      config: {
        cloudName,
        apiKey,
        apiSecretSet: !!process.env.CLOUDINARY_API_SECRET,
        apiSecretLength: apiSecret.length,
        timestamp,
        signature: signature.substring(0, 10) + '...',
      },
      message: 'Cloudinary konfiqurasiyası düzgündür',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
