'use client';

import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUsers, FaBed, FaSwimmingPool, FaFilter, FaTimes } from 'react-icons/fa';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
}

const POOL_OPTIONS = [
  { value: '',        label: 'Hamısı',       icon: false },
  { value: 'NONE',   label: 'Hovuzsuz',     icon: false },
  { value: 'REGULAR',label: 'Sadə',         icon: true  },
  { value: 'HEATED', label: 'İsti',         icon: true  },
];

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
    const reset = { city: '', guests: '', bedrooms: '', minPrice: '', maxPrice: '', poolType: '', propertyType: '' };
    setFilters(reset);
    onSearch(reset);
  }

  function setPool(val: string) {
    const updated = { ...filters, poolType: val };
    setFilters(updated);
    onSearch(updated); // anlıq filter tətbiq et
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-3 md:p-4 border border-[#E5DDD5]/50">

      {/* Row 1 — Şəhər / Qonaq / Otaq */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="relative">
          <label htmlFor="city-select" className="sr-only">Şəhər seçin</label>
          <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-xs pointer-events-none" />
          <select
            id="city-select"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355]/20 outline-none text-sm bg-white appearance-none"
          >
            <option value="">Şəhər</option>
            <option value="İsmayıllı">İsmayıllı</option>
            <option value="Qəbələ">Qəbələ</option>
            <option value="Quba">Quba</option>
            <option value="Bakı">Bakı</option>
          </select>
        </div>

        <div className="relative">
          <label htmlFor="guests-select" className="sr-only">Qonaq sayı</label>
          <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-xs pointer-events-none" />
          <select
            id="guests-select"
            value={filters.guests}
            onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white text-sm"
          >
            <option value="">Qonaq</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10+</option>
          </select>
        </div>

        <div className="relative">
          <label htmlFor="bedrooms-select" className="sr-only">Otaq sayı</label>
          <FaBed className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] text-xs pointer-events-none" />
          <select
            id="bedrooms-select"
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none appearance-none bg-white text-sm"
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

      {/* Row 2 — Hovuz filter (həmişə görünür) */}
      <div className="mb-2">
        <div className="grid grid-cols-4 gap-1.5">
          {POOL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPool(opt.value)}
              className={`
                flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[11px] font-medium
                transition-all duration-200 w-full
                ${filters.poolType === opt.value
                  ? 'bg-[#8B7355] text-white border-[#8B7355] shadow-sm'
                  : 'bg-white text-[#6B5D4F] border-[#E5DDD5] hover:border-[#8B7355]'
                }
              `}
            >
              {opt.icon && <FaSwimmingPool className="text-[9px] flex-shrink-0" />}
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Row 3 — Ətraflı / Axtarış */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium h-10 transition-all ${
            showAdvanced
              ? 'bg-[#FAF8F5] border-[#8B7355] text-[#8B7355]'
              : 'border-[#E5DDD5] text-[#8B7355] hover:border-[#8B7355] hover:bg-[#FAF8F5]'
          }`}
        >
          <FaFilter className="text-xs" />
          <span>Ətraflı</span>
        </button>

        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm h-10"
        >
          <FaSearch className="text-xs" />
          <span>Axtarış</span>
        </button>
      </div>

      {/* Ətraflı bölmə */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-[#E5DDD5] space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#2C2416] mb-1">Növ</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none bg-white text-xs"
              >
                <option value="">Hamısı</option>
                <option value="AFRAME">A-frame</option>
                <option value="COTTAGE">Bağ evi</option>
                <option value="VILLA">Villa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2C2416] mb-1">Min ₼</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2C2416] mb-1">Max ₼</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E5DDD5] text-[#6B5D4F] hover:border-red-400 hover:text-red-500 transition-all text-xs"
            >
              <FaTimes className="text-[10px]" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
