'use client';

import { useState } from 'react';
import MobileHeader from '@/components/MobileHeader';
import SearchFilters from '@/components/SearchFilters';
import MobilePropertyList from '@/components/MobilePropertyList';
import MobileFooter from '@/components/MobileFooter';

export default function EvlerPage() {
  const [filters, setFilters] = useState({});

  const handleSearch = (newFilters: unknown) => {
    setFilters(newFilters as Record<string, unknown>);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F5F1ED] to-[#F0EBE6]">
      <MobileHeader />

      <div className="relative pt-16 pb-2.5 px-2.5 md:px-3 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto text-center mb-2 md:mb-3">
          <h1
            className="text-base md:text-2xl font-bold text-[#2C2416] mb-0"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            <span className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent">
              Bütün Evlər
            </span>
          </h1>
          <p className="text-[9px] md:text-xs text-[#6B5D4F] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Premium villa və mənzillər
          </p>
        </div>

        <div className="relative z-10 max-w-md md:max-w-2xl mx-auto">
          <SearchFilters onSearch={handleSearch} />
        </div>
      </div>

      <MobilePropertyList filters={filters} />
      <MobileFooter />
    </main>
  );
}
