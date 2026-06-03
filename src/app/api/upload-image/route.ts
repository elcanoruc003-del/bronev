import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Image upload endpoint — uses Cloudinary SDK with env credentials only.
 * No hardcoded secrets.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Fayl tapılmadı' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Yalnız şəkil faylları yükləyə bilərsiniz' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fayl ölçüsü 10MB-dan çox ola bilməz' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error('[UPLOAD] Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Şəkil yüklənərkən xəta baş verdi' },
      { status: 500 }
    );
  }
}
