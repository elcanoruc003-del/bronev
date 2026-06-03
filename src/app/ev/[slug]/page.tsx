'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPropertyBySlug } from '@/app/actions/properties';

/**
 * /ev/[slug] — slug-based redirect to /properties/[id]
 * Handles legacy links and sitemap entries using slug.
 */
export default function EvSlugPage() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    async function resolve() {
      const slug = params.slug as string;
      if (!slug) {
        router.replace('/');
        return;
      }

      const property = await getPropertyBySlug(slug);
      if (property) {
        router.replace(`/properties/${property.id}`);
      } else {
        setError(true);
      }
    }

    resolve();
  }, [params.slug, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-xl text-[#2C2416] font-semibold mb-4">Ev tapılmadı</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5D4F] transition-colors"
          >
            Ana səhifəyə qayıt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]"></div>
    </div>
  );
}
