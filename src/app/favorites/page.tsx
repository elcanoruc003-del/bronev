'use client';

import { useState, useEffect } from 'react';
import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';
import { FaHeart, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { getUserFavorites } from '@/app/actions/favorites';

interface Favorite {
  id: string;
  properties: {
    id: string;
    title: string;
    city: string;
    district: string;
    basePricePerNight: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    property_images: Array<{ url: string; alt?: string }>;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const result = await getUserFavorites();
      if (result.success) {
        setFavorites(result.favorites as Favorite[]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <MobileHeader />
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-4xl text-[#8B7355]" />
        </div>
        <MobileFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <MobileHeader />
      
      <div className="px-4 py-8 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B7355] to-[#C19A6B] flex items-center justify-center">
            <FaHeart className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2C2416]">Sevimlilər</h1>
            <p className="text-sm text-[#6B5D4F]">
              {favorites.length > 0 ? `${favorites.length} ev` : 'Bəyəndiyiniz evlər'}
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-[#FAF8F5] border-2 border-[#E5DDD5] flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-4xl text-[#C19A6B]" />
            </div>
            <p className="text-[#6B5D4F] mb-2">Hələ sevimli ev yoxdur</p>
            <p className="text-sm text-[#6B5D4F]">Bəyəndiyiniz evləri ürək ikonuna toxunaraq əlavə edin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite) => (
              <a
                key={favorite.id}
                href={`/properties/${favorite.properties.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={favorite.properties.property_images[0]?.url || '/placeholder.jpg'}
                    alt={favorite.properties.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white text-xs px-3 py-1 rounded-full">
                    {favorite.properties.basePricePerNight}₼/gecə
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-[#2C2416] mb-2 line-clamp-1">
                    {favorite.properties.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-xs text-[#6B5D4F] mb-3">
                    <FaMapMarkerAlt className="text-[#8B7355]" />
                    <span>{favorite.properties.city}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#6B5D4F]">
                    <div className="flex items-center gap-1">
                      <FaBed className="text-[#8B7355]" />
                      <span>{favorite.properties.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaBath className="text-[#8B7355]" />
                      <span>{favorite.properties.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRulerCombined className="text-[#8B7355]" />
                      <span>{favorite.properties.area}m²</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <MobileFooter />
    </main>
  );
}
