'use client';

import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';
import { FaHeart } from 'react-icons/fa';

export default function FavoritesPage() {
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
            <p className="text-sm text-[#6B5D4F]">Bəyəndiyiniz evlər</p>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-[#FAF8F5] border-2 border-[#E5DDD5] flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-4xl text-[#C19A6B]" />
          </div>
          <p className="text-[#6B5D4F] mb-2">Hələ sevimli ev yoxdur</p>
          <p className="text-sm text-[#6B5D4F]">Bəyəndiyiniz evləri ürək ikonuna toxunaraq əlavə edin</p>
        </div>
      </div>

      <MobileFooter />
    </main>
  );
}
