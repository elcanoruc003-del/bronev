import { NextRequest, NextResponse } from 'next/server';

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

    console.log('[UPLOAD] File converted to base64, size:', base64.length);

    // Upload to Cloudinary using unsigned preset
    const cloudName = 'dyfuasdbm';
    const uploadPreset = 'bronev_preset';

    console.log('[UPLOAD] Uploading to Cloudinary...');

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: dataURI,
          upload_preset: uploadPreset,
          folder: 'bronev/properties',
        }),
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
