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
    poolType: '',
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
      poolType: '',
      propertyType: '',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-3 md:p-4 border border-[#E5DDD5]/50">
      {/* First Row - Main Filters */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {/* City */}
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-xs" />
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355]/20 outline-none transition-all text-sm bg-white appearance-none"
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
          <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-xs" />
          <select
            value={filters.guests}
            onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white transition-all text-sm"
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
          <FaBed className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-xs" />
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white transition-all text-sm"
          >
            <option value="">Otaq</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>

      {/* Second Row - Advanced Toggle & Search */}
      <div className="grid grid-cols-2 gap-2">
        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5DDD5] text-[#8B7355] hover:border-[#8B7355] hover:bg-[#FAF8F5] transition-all text-sm font-medium"
        >
          <FaFilter className="text-xs" />
          <span>Ətraflı</span>
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
        >
          <FaSearch className="text-xs" />
          <span>Axtarış</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-[#E5DDD5] space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-[#2C2416] mb-1.5">
                Növ
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none bg-white text-sm"
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
              <label className="block text-xs font-semibold text-[#2C2416] mb-1.5">
                Min (₼)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm"
              />
            </div>

            {/* Max Price */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-[#2C2416] mb-1.5">
                Max (₼)
              </label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm"
              />
            </div>
          </div>

          {/* Pool Filter & Reset */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FaSwimmingPool className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-xs" />
              <select
                value={filters.poolType}
                onChange={(e) => setFilters({ ...filters, poolType: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none bg-white text-sm appearance-none"
              >
                <option value="">Hovuz</option>
                <option value="NONE">Hovuzsuz</option>
                <option value="REGULAR">Sadə Hovuzlu</option>
                <option value="HEATED">İsti Hovuzlu</option>
              </select>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5DDD5] text-[#6B5D4F] hover:border-red-500 hover:text-red-500 transition-all text-sm"
            >
              <FaTimes className="text-xs" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
