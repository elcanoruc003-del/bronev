import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Fayl tapılmadı' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary using unsigned preset
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dyfuasdbm';
    const uploadPreset = 'bronev_preset'; // Your unsigned preset

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

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(errorData.error?.message || 'Cloudinary yükləmə xətası');
    }

    const result = await cloudinaryResponse.json();

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Yükləmə xətası' },
      { status: 500 }
    );
  }
}
