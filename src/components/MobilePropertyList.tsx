'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaWhatsapp, FaHeart, FaStar } from 'react-icons/fa';

interface Property {
  id: string;
  title: string;
  shortDescription: string;
  basePricePerNight: number;
  city: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  images: Array<{ url: string; alt?: string }>;
  property_images?: Array<{ url: string; alt?: string }>; // Fallback
}

interface MobilePropertyListProps {
  filters?: any;
}

export default function MobilePropertyList({ filters = {} }: MobilePropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProperties();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }

    // Scroll Reveal Animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function fetchProperties() {
    try {
      setLoading(true);
      
      // Build query params from filters
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.guests) params.append('guests', filters.guests);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.hasPool) params.append('hasPool', 'true');
      if (filters.propertyType) params.append('type', filters.propertyType);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      
      // Sort: featured first, then by createdAt
      const sorted = (data.properties || []).sort((a: Property, b: Property) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      
      setProperties(sorted);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleFavorite = async (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
    
    // Try to save to backend (requires phone number)
    try {
      const { toggleFavorite: toggleFavoriteAction } = await import('@/app/actions/favorites');
      await toggleFavoriteAction(id);
    } catch (error) {
      console.log('Backend save skipped - user not logged in');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[120px] px-3 pb-20">
        {/* Skeleton Loading - Compact */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton rounded-xl aspect-[4/5]"></div>
              <div className="skeleton h-3 w-3/4 rounded"></div>
              <div className="skeleton h-2 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 pb-20">
      {/* VIP Properties Section */}
      {properties.filter(p => p.featured).length > 0 && (
        <div className="mb-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                <FaStar className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2C2416]">VIP Evlər</h2>
                <p className="text-xs text-[#6B5D4F]">Premium seçimlər</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-[#8B7355]">
              {properties.filter(p => p.featured).length} ev
            </span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {properties.filter(p => p.featured).map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} favorites={favorites} toggleFavorite={toggleFavorite} />
            ))}
          </div>
        </div>
      )}

      {/* All Properties Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-[#3E2723]">
            <span className="text-lg font-bold text-gradient bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent">
              {properties.length}
            </span>
            <span className="ml-1.5">ev</span>
          </p>
        </div>

        {properties.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FAF8F5] to-[#F5F1ED] flex items-center justify-center mb-6 shadow-premium">
              <FaMapMarkerAlt className="text-5xl text-[#C19A6B]" />
            </div>
            <h3 className="text-xl font-display font-semibold text-[#2C1810] mb-2">
              Hazırda ev yoxdur
            </h3>
            <p className="text-sm text-[#8B7E74] mb-6 max-w-xs">
              Tezliklə yeni evlər əlavə ediləcək. Bizimlə əlaqədə qalın!
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center gap-2"
            >
              <FaWhatsapp className="text-lg" />
              <span>Bizimlə əlaqə</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} favorites={favorites} toggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Property Card Component
function PropertyCard({ property, index, favorites, toggleFavorite }: {
  property: Property;
  index: number;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
}) {
  return (
    <a
      href={`/properties/${property.id}`}
      className="stagger-item scroll-reveal block"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Premium Property Card */}
      <div className="card-premium tap-scale group relative">
        {/* Image Container */}
        <div className="card-image-container relative">
          <Image
            src={property.images[0]?.url || property.property_images?.[0]?.url || '/placeholder.jpg'}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading={index < 4 ? 'eager' : 'lazy'}
            onError={(e) => {
              console.error('Image load error for property:', property.id);
              e.currentTarget.src = '/placeholder.jpg';
            }}
          />
          
          {/* Top Badges Container - Fixed Layout */}
          <div className="absolute top-2 left-2 right-2 z-10">
            {/* VIP Badge - Top Left */}
            {property.featured && (
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg mb-1">
                ⭐ VIP
              </div>
            )}
            
            {/* Price and New Badge Row */}
            <div className="flex items-start justify-between">
              {/* Price Badge */}
              <div className="badge-premium backdrop-blur-md text-xs px-2 py-1">
                <span className="font-bold">{property.basePricePerNight}₼</span>
                <span className="text-[9px] opacity-90">/gecə</span>
              </div>

              {/* Featured Badge */}
              {property.featured && (
                <div className="badge-new backdrop-blur-md pulse-soft text-[10px] px-1.5 py-0.5">
                  <FaStar className="inline text-[8px] mr-0.5" />
                  <span>Yeni</span>
                </div>
              )}
            </div>
          </div>

          {/* Favorite Button - Smaller */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(property.id);
            }}
            className="
              absolute bottom-2 right-2 z-10
              w-8 h-8 rounded-full
              glass-effect shadow-lg
              flex items-center justify-center
              transition-all duration-300
              hover:scale-110 active:scale-95
              tap-scale
            "
            aria-label="Add to favorites"
          >
            <FaHeart
              className={`
                text-sm transition-all duration-300
                ${favorites.has(property.id) 
                  ? 'text-red-500 scale-110' 
                  : 'text-white/80'
                }
              `}
            />
          </button>
        </div>

        {/* Content - Compact */}
        <div className="p-2.5 space-y-1.5">
          {/* Title - Smaller */}
          <h3 className="font-semibold text-xs leading-tight text-[#2C1810] line-clamp-1 group-hover:text-[#8B7355] transition-colors duration-300">
            {property.title}
          </h3>
          
          {/* Location - Smaller */}
          <div className="flex items-center gap-1 text-[10px] text-[#8B7E74]">
            <FaMapMarkerAlt className="text-[9px] text-[#C19A6B]" />
            <span className="line-clamp-1 font-medium">{property.city}</span>
          </div>

          {/* Features - Compact */}
          <div className="flex items-center gap-2 text-[10px] text-[#8B7E74]">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#FAF8F5] flex items-center justify-center">
                <FaBed className="text-[8px] text-[#8B7355]" />
              </div>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#FAF8F5] flex items-center justify-center">
                <FaBath className="text-[8px] text-[#8B7355]" />
              </div>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#FAF8F5] flex items-center justify-center">
                <FaRulerCombined className="text-[8px] text-[#8B7355]" />
              </div>
              <span className="font-medium">{property.area}m²</span>
            </div>
          </div>

          {/* CTA Buttons - Compact */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Salam! ${property.title} haqqında məlumat almaq istəyirəm.`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center gap-1
                py-1.5 rounded-lg
                bg-gradient-to-r from-[#25D366] to-[#20BA5A]
                text-white text-[10px] font-semibold
                shadow-sm hover:shadow-md
                transition-all duration-300
                hover:scale-[1.02] active:scale-95
                tap-scale
              "
            >
              <FaWhatsapp className="text-xs" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
              className="
                flex items-center justify-center gap-1
                py-1.5 rounded-lg
                bg-gradient-to-r from-[#4CAF50] to-[#388E3C]
                text-white text-[10px] font-semibold
                shadow-sm hover:shadow-md
                transition-all duration-300
                hover:scale-[1.02] active:scale-95
                tap-scale
              "
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>Zəng</span>
            </a>
          </div>
        </div>
      </div>
    </a>
  );
}
