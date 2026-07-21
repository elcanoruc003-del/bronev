// lib/cloudinaryLoader.js
export default function cloudinaryLoader({ src, width, quality }) {
  const params = [
    'f_auto', // auto best format (AVIF/WebP)
    'q_auto:best', // highest auto quality, no visible loss
    'c_limit', // never upscale
    `w_${width}`,
    'dpr_auto', // retina-aware
  ];

  const cloudName = 'wn8jydkt';
  let publicId = src;

  if (src.startsWith('http')) {
    const match = src.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    publicId = match ? match[1] : src;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${publicId}`;
}
