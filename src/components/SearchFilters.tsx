'use client'

import { useState, useRef, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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

const regions = [
  { id: 'all', name: 'Hamısı', icon: '🏠' },
  { id: 'ismayilli', name: 'İsmayıllı', icon: '🏔️' },
  { id: 'qebele', name: 'Qəbələ', icon: '🌲' },
  { id: 'sheki', name: 'Şəki', icon: '🏰' },
  { id: 'quba', name: 'Quba', icon: '⛰️' },
  { id: 'lankaran', name: 'Lənkəran', icon: '🌊' },
  { id: 'shamakhi', name: 'Şamaxı', icon: '⭐' },
  { id: 'qax', name: 'Qax', icon: '🌳' },
]

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    handleScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId)
    const region = regions.find(r => r.id === regionId)
    onSearch({
      query: '',
      city: region?.name === 'Hamısı' ? '' : region?.name || '',
      type: 'Hamısı',
      minPrice: 0,
      maxPrice: 500,
    })
  }

  return (
    <div className="sticky top-[72px] z-40 bg-gradient-to-b from-[#FAF8F5] to-transparent pb-4 pt-2">
      <div className="relative px-4 max-w-screen-xl mx-auto">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="
              absolute left-2 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 rounded-full
              glass-effect shadow-lg
              flex items-center justify-center
              text-[#8B7355] hover:text-[#C19A6B]
              transition-all duration-300
              hover:scale-110 active:scale-95
            "
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-sm" />
          </button>
        )}

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="
            flex gap-2 overflow-x-auto hide-scrollbar
            scroll-smooth
            px-1 py-2
          "
        >
          {regions.map((region, index) => (
            <button
              key={region.id}
              onClick={() => handleRegionSelect(region.id)}
              className={`
                flex-shrink-0 px-5 py-2.5 rounded-full
                font-medium text-sm whitespace-nowrap
                transition-all duration-300
                tap-scale
                ${selectedRegion === region.id
                  ? 'btn-pill active scale-105'
                  : 'btn-pill hover:scale-105'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <span className="mr-1.5">{region.icon}</span>
              {region.name}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="
              absolute right-2 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 rounded-full
              glass-effect shadow-lg
              flex items-center justify-center
              text-[#8B7355] hover:text-[#C19A6B]
              transition-all duration-300
              hover:scale-110 active:scale-95
            "
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-sm" />
          </button>
        )}

        {/* Gradient Underline */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C19A6B]/20 to-transparent" />
      </div>
    </div>
  )
}
