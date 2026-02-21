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
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        {/* City */}
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-sm" />
          <input
            type="text"
            placeholder="Şəhər"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all text-sm"
          />
        </div>

        {/* Guests */}
        <div className="relative">
          <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-sm" />
          <select
            value={filters.guests}
            onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white transition-all text-sm"
          >
            <option value="">Qonaq sayı</option>
            <option value="1">1 nəfər</option>
            <option value="2">2 nəfər</option>
            <option value="3">3 nəfər</option>
            <option value="4">4 nəfər</option>
            <option value="5">5 nəfər</option>
            <option value="6">6+ nəfər</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <FaBed className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-sm" />
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white transition-all text-sm"
          >
            <option value="">Yataq otağı</option>
            <option value="1">1 otaq</option>
            <option value="2">2 otaq</option>
            <option value="3">3 otaq</option>
            <option value="4">4 otaq</option>
            <option value="5">5+ otaq</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
        >
          <FaSearch />
          <span>Axtar</span>
        </button>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-[#8B7355] hover:text-[#6B5D4F] font-medium flex items-center space-x-2 transition-colors text-sm"
      >
        <FaFilter className="text-xs" />
        <span>{showAdvanced ? 'Sadə axtarış' : 'Ətraflı axtarış'}</span>
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-[#E5DDD5] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-[#2C2416] mb-1.5">
                Ev növü
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none bg-white text-sm"
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
                Min qiymət (₼)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-semibold text-[#2C2416] mb-1.5">
                Max qiymət (₼)
              </label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm"
              />
            </div>
          </div>

          {/* Pool Filter & Reset */}
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <button
              onClick={() => setFilters({ ...filters, hasPool: !filters.hasPool })}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm ${
                filters.hasPool
                  ? 'bg-[#8B7355] text-white border-[#8B7355]'
                  : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
              }`}
            >
              <FaSwimmingPool className="text-sm" />
              <span>Hovuzlu</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-[#E5DDD5] text-[#6B5D4F] hover:border-red-500 hover:text-red-500 transition-all text-sm"
            >
              <FaTimes className="text-sm" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
