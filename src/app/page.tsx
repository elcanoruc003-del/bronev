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
      
      {/* Compact Hero & Filters */}
      <div className="relative pt-16 pb-4 px-3 overflow-hidden">
        {/* Hero Content - Compact */}
        <div className="relative z-10 max-w-7xl mx-auto text-center mb-4">
          <h1 className="text-xl md:text-3xl font-bold text-[#2C2416] mb-1">
            <span className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent">
              Günlük Kirayə Evləri
            </span>
          </h1>
          <p className="text-xs md:text-sm text-[#6B5D4F]">
            Premium villa və mənzillər
          </p>
        </div>

        {/* Search Filters - Compact */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <SearchFilters onSearch={handleSearch} />
        </div>
      </div>

      {/* Properties List */}
      <MobilePropertyList filters={filters} />
      
      {/* Footer */}
      <MobileFooter />
    </main>
  );
}
