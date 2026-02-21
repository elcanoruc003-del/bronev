'use client';

import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';
import { FaUser, FaSignInAlt } from 'react-icons/fa';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <MobileHeader />
      
      <div className="px-4 py-8 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B7355] to-[#C19A6B] flex items-center justify-center">
            <FaUser className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2C2416]">Profil</h1>
            <p className="text-sm text-[#6B5D4F]">Hesab məlumatları</p>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-[#FAF8F5] border-2 border-[#E5DDD5] flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-4xl text-[#C19A6B]" />
          </div>
          <p className="text-[#2C2416] font-semibold mb-2">Daxil olmamısınız</p>
          <p className="text-sm text-[#6B5D4F] mb-6">Hesabınıza daxil olun və ya qeydiyyatdan keçin</p>
          
          <button className="px-8 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95 inline-flex items-center gap-2">
            <FaSignInAlt />
            <span>Daxil ol</span>
          </button>
        </div>
      </div>

      <MobileFooter />
    </main>
  );
}
