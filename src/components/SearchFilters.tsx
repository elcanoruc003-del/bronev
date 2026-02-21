'use client'

import { useState } from 'react'
import { FaSearch, FaFilter } from 'react-icons/fa'

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
}

interface SearchFilters {
  query: string
  city: string
  type: string
  minPrice: number
  maxPrice: number
}

const cities = ['Hamısı', 'Bakı', 'Qəbələ', 'Şəki', 'Quba', 'Lənkəran', 'Şamaxı', 'Qax']
const types = ['Hamısı', 'Villa', 'Mənzil', 'Penthouse', 'Ev', 'Bağ Evi']

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    city: 'Hamısı',
    type: 'Hamısı',
    minPrice: 0,
    maxPrice: 500,
  })

  const handleSearch = () => {
    onSearch(filters)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Şəhər, rayon və ya açar söz axtar..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-gray-800"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          <FaFilter />
          <span>Filtrlər</span>
        </button>
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:shadow-xl transition font-semibold"
        >
          Axtar
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Şəhər</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ev Tipi</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Qiymət (₼/gün)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
