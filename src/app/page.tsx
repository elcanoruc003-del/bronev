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
      
      {/* Hero Section with Background */}
      <div className="relative pt-20 pb-8 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B7355' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2416] mb-4">
            Azərbaycanın Ən Yaxşı
            <span className="block mt-2 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent">
              Günlük Kirayə Evləri
            </span>
          </h1>
          <p className="text-lg text-[#6B5D4F] max-w-2xl mx-auto">
            Premium villa və mənzillər. Etibarlı xidmət, unudulmaz təcrübə.
          </p>
        </div>

        {/* Search Filters */}
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
