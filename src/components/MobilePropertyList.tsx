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
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[120px] px-4 pb-24">
        {/* Skeleton Loading */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton rounded-[18px] aspect-[4/5]"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
              <div className="skeleton h-3 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] px-4 pb-24">
      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-[#3E2723]">
          <span className="text-lg font-semibold text-gradient">{properties.length}</span> ev tapıldı
        </p>
      </div>

      {/* Property Grid */}
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
        <div className="grid grid-cols-2 gap-4">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="stagger-item scroll-reveal"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Premium Property Card */}
              <div className="card-premium tap-scale group">
                {/* Image Container */}
                <div className="card-image-container relative">
                  <Image
                    src={property.images[0]?.url || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                  
                  {/* Top Badges Container */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                    {/* Price Badge */}
                    <div className="badge-premium backdrop-blur-md">
                      <span className="font-bold">{property.basePricePerNight}₼</span>
                      <span className="text-[10px] opacity-90">/gecə</span>
                    </div>

                    {/* Featured Badge */}
                    {property.featured && (
                      <div className="badge-new backdrop-blur-md pulse-soft">
                        <FaStar className="inline text-[10px] mr-1" />
                        <span>Yeni</span>
                      </div>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(property.id);
                    }}
                    className="
                      absolute bottom-3 right-3 z-10
                      w-10 h-10 rounded-full
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
                        text-base transition-all duration-300
                        ${favorites.has(property.id) 
                          ? 'text-red-500 scale-110' 
                          : 'text-white/80'
                        }
                      `}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-2.5">
                  {/* Title */}
                  <h3 className="font-semibold text-[15px] leading-tight text-[#2C1810] line-clamp-1 group-hover:text-[#8B7355] transition-colors duration-300">
                    {property.title}
                  </h3>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-[#8B7E74]">
                    <FaMapMarkerAlt className="text-[11px] text-[#C19A6B]" />
                    <span className="line-clamp-1 font-medium">{property.city}, {property.district}</span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-3 text-xs text-[#8B7E74]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-[#FAF8F5] flex items-center justify-center">
                        <FaBed className="text-[10px] text-[#8B7355]" />
                      </div>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-[#FAF8F5] flex items-center justify-center">
                        <FaBath className="text-[10px] text-[#8B7355]" />
                      </div>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-[#FAF8F5] flex items-center justify-center">
                        <FaRulerCombined className="text-[10px] text-[#8B7355]" />
                      </div>
                      <span className="font-medium">{property.area}m²</span>
                    </div>
                  </div>

                  {/* WhatsApp CTA Button */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Salam! ${property.title} haqqında məlumat almaq istəyirəm.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex items-center justify-center gap-1.5
                        py-2.5 rounded-full
                        bg-gradient-to-r from-[#25D366] to-[#20BA5A]
                        text-white text-xs font-semibold
                        shadow-md hover:shadow-lg
                        transition-all duration-300
                        hover:scale-[1.02] active:scale-95
                        tap-scale
                      "
                    >
                      <FaWhatsapp className="text-base" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
                      className="
                        flex items-center justify-center gap-1.5
                        py-2.5 rounded-full
                        bg-gradient-to-r from-[#4CAF50] to-[#388E3C]
                        text-white text-xs font-semibold
                        shadow-md hover:shadow-lg
                        transition-all duration-300
                        hover:scale-[1.02] active:scale-95
                        tap-scale
                      "
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>Zəng et</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
