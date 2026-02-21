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
    <main className="min-h-screen relative">
      <MobileHeader />
      <div className="px-4 py-6">
        <SearchFilters onSearch={handleSearch} />
      </div>
      <MobilePropertyList filters={filters} />
      <MobileFooter />
    </main>
  );
}
