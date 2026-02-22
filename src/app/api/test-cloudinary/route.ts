import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cloudName = 'dyfuasdbm';
    const uploadPreset = 'bronev_preset';

    // Test with a small base64 image
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: testImage,
          upload_preset: uploadPreset,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      cloudName,
      uploadPreset,
      response: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
