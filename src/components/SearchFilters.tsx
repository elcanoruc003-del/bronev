'use client';

import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUsers, FaBed, FaSwimmingPool, FaFilter, FaTimes } from 'react-icons/fa';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    guests: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    hasPool: false,
    propertyType: '',
  });

  function handleSearch() {
    onSearch(filters);
  }

  function handleReset() {
    const resetFilters = {
      city: '',
      guests: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      hasPool: false,
      propertyType: '',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-2.5 md:p-3 border border-[#E5DDD5]/50">
      {/* Basic Filters - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 md:gap-2 mb-2">
        {/* City - Full width on mobile */}
        <div className="relative col-span-2 md:col-span-2">
          <FaMapMarkerAlt className="absolute left-2 top-1/2 -translate-y-1/2 text-[#8B7355] text-[10px]" />
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full pl-7 pr-2 py-1.5 md:py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355]/20 outline-none transition-all text-[11px] md:text-xs bg-white appearance-none"
          >
            <option value="">Şəhər</option>
            <option value="İsmayıllı">İsmayıllı</option>
            <option value="Qəbələ">Qəbələ</option>
            <option value="Quba">Quba</option>
            <option value="Bakı">Bakı</option>
          </select>
        </div>

        {/* Guests */}
        <div className="relative">
          <FaUsers className="absolute left-2 top-1/2 -translate-y-1/2 text-[#8B7355] text-[10px]" />
          <select
            value={filters.guests}
            onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
            className="w-full pl-7 pr-1 py-1.5 md:py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white transition-all text-[11px] md:text-xs"
          >
            <option value="">Qonaq</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6+</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <FaBed className="absolute left-2 top-1/2 -translate-y-1/2 text-[#8B7355] text-[10px]" />
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            className="w-full pl-7 pr-1 py-1.5 md:py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white transition-all text-[11px] md:text-xs"
          >
            <option value="">Otaq</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1 text-[11px] md:text-xs"
        >
          <FaSearch className="text-[10px]" />
          <span className="hidden md:inline">Axtar</span>
        </button>
      </div>

      {/* Advanced Filters Toggle - Compact */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-[#8B7355] hover:text-[#6B5D4F] font-medium flex items-center space-x-1 transition-colors text-[10px] md:text-xs"
      >
        <FaFilter className="text-[9px]" />
        <span>{showAdvanced ? 'Gizlət' : 'Ətraflı'}</span>
      </button>

      {/* Advanced Filters - Mobile Optimized */}
      {showAdvanced && (
        <div className="mt-2 pt-2 border-t border-[#E5DDD5] space-y-1.5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
            {/* Property Type */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-semibold text-[#2C2416] mb-0.5">
                Növ
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="w-full px-2 py-1.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none bg-white text-[11px] md:text-xs"
              >
                <option value="">Hamısı</option>
                <option value="VILLA">Villa</option>
                <option value="APARTMENT">Mənzil</option>
                <option value="HOUSE">Ev</option>
                <option value="COTTAGE">Bağ evi</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-semibold text-[#2C2416] mb-0.5">
                Min (₼)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-2 py-1.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-[11px] md:text-xs"
              />
            </div>

            {/* Max Price */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[9px] md:text-[10px] font-semibold text-[#2C2416] mb-0.5">
                Max (₼)
              </label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-2 py-1.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-[11px] md:text-xs"
              />
            </div>
          </div>

          {/* Pool Filter & Reset - Compact */}
          <div className="flex items-center space-x-1.5 flex-wrap gap-1">
            <button
              onClick={() => setFilters({ ...filters, hasPool: !filters.hasPool })}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border transition-all text-[10px] md:text-xs ${
                filters.hasPool
                  ? 'bg-[#8B7355] text-white border-[#8B7355]'
                  : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
              }`}
            >
              <FaSwimmingPool className="text-[9px]" />
              <span>Hovuz</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-[#E5DDD5] text-[#6B5D4F] hover:border-red-500 hover:text-red-500 transition-all text-[10px] md:text-xs"
            >
              <FaTimes className="text-[9px]" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
