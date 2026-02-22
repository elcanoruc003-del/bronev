import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('[UPLOAD] Starting image upload...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[UPLOAD] No file provided');
      return NextResponse.json(
        { error: 'Fayl tapılmadı' },
        { status: 400 }
      );
    }

    console.log('[UPLOAD] File received:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[UPLOAD] Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Yalnız şəkil faylları yükləyə bilərsiniz' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.error('[UPLOAD] File too large:', file.size);
      return NextResponse.json(
        { error: 'Fayl ölçüsü 10MB-dan çox ola bilməz' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    console.log('[UPLOAD] File converted to base64');

    // Cloudinary credentials
    const cloudName = 'dyfuasdbm';
    const apiKey = '526295514959981';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'JoV-VfaQi9m3TyZRoJtcJP8Vemo';
    
    // Generate timestamp
    const timestamp = Math.round(Date.now() / 1000);
    
    // Create signature
    const folder = 'bronev/properties';
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    console.log('[UPLOAD] Uploading to Cloudinary with signature...');

    // Upload with signature
    const uploadFormData = new FormData();
    uploadFormData.append('file', dataURI);
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('timestamp', timestamp.toString());
    uploadFormData.append('signature', signature);
    uploadFormData.append('folder', folder);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    const result = await cloudinaryResponse.json();
    console.log('[UPLOAD] Cloudinary response status:', cloudinaryResponse.status);

    if (!cloudinaryResponse.ok) {
      console.error('[UPLOAD] Cloudinary error:', result);
      return NextResponse.json(
        { error: result.error?.message || 'Cloudinary yükləmə xətası' },
        { status: cloudinaryResponse.status }
      );
    }

    console.log('[UPLOAD] Upload successful:', result.secure_url);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error('[UPLOAD] Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Server xətası' },
      { status: 500 }
    );
  }
}
