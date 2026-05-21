'use client';

import { useState } from 'react';
import MobileHeader from '@/components/MobileHeader';
import SearchFilters from '@/components/SearchFilters';
import MobilePropertyList from '@/components/MobilePropertyList';
import MobileFooter from '@/components/MobileFooter';

export default function Page() {
  const [filters, setFilters] = useState({});

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F5F1ED] to-[#F0EBE6]">
      {/* Header */}
      <MobileHeader />
      
      {/* Hero & Filters Section with Background Image */}
      <div className="relative pt-16 pb-2.5 px-2.5 md:px-3 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop')`,
            }}
          />
          {/* Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/95 via-[#FAF8F5]/90 to-[#FAF8F5]/95"></div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#8B7355] blur-3xl"></div>
          <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-[#C19A6B] blur-3xl"></div>
          <div className="absolute bottom-10 left-1/2 w-36 h-36 rounded-full bg-[#8B7355] blur-3xl"></div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B7355' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Hero Content - Ultra Compact for Mobile */}
        <div className="relative z-10 max-w-7xl mx-auto text-center mb-2 md:mb-3">
          <h1 
            className="text-base md:text-2xl font-bold text-[#2C2416] mb-0"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            <span className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent">
              Günlük Kirayə Evlər
            </span>
          </h1>
          <p className="text-[9px] md:text-xs text-[#6B5D4F] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Premium villa və mənzillər
          </p>
        </div>

        {/* Search Filters - Optimal Width */}
        <div className="relative z-10 max-w-md md:max-w-2xl mx-auto">
          <SearchFilters onSearch={handleSearch} />
        </div>
      </div>

      {/* Welcome Notice Banner */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 -mt-1 mb-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg shadow-sm p-3 md:p-4">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-bold text-blue-900 mb-1">
                Bron-Evə xoş gəlmisiniz!
              </h3>
              <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
                Ev qiymətləri qonaq sayından və gün sayından asılı olaraq dəyişir. Sayta yerləşdirilən qiymətlər standart olaraq nəzərdə tutulub. Bayram günləri, tətil günləri, şənbə günləri tək günlər və s. qiymətlər tamamilə fərqlidir. Qiyməti dəqiq öyrənmək və ətraflı məlumat almaq üçün rezerv düyməsinə klik edib bizə mesaj göndərərək və ya nömrəmizlə əlaqə saxlayaraq ətraflı məlumat əldə edə bilərsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <MobilePropertyList filters={filters} />
      
      {/* Footer */}
      <MobileFooter />
    </main>
  );
}
