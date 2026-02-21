'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaWhatsapp, FaHeart, FaFilter } from 'react-icons/fa';

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

export default function MobilePropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  const cities = ['all', 'İsmayıllı', 'Qəbələ', 'Şəki', 'Quba', 'Bakı'];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const filteredProperties = properties.filter(property => {
    if (selectedCity !== 'all' && property.city !== selectedCity) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        {/* Filter Skeleton */}
        <div className="sticky top-[64px] z-40 glass-effect border-b border-[#E5DDD5]/50 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-10 w-24 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton rounded-2xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter Bar - Sticky below header */}
      <div className="sticky top-[64px] z-40 glass-effect border-b border-[#E5DDD5]/50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5DDD5] text-[#2C2416] font-medium hover:bg-[#FAF8F5] transition-all duration-300"
            >
              <FaFilter className="text-sm" />
              <span>Filtrlər</span>
            </button>
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCity === city
                        ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-md'
                        : 'bg-white text-[#6B5D4F] hover:bg-[#FAF8F5] border border-[#E5DDD5]'
                    }`}
                  >
                    {city === 'all' ? 'Hamısı' : city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-[#6B5D4F]">
            {filteredProperties.length} ev tapıldı
          </p>
        </div>
      </div>

      {/* Property Grid */}
      <div className="px-4 py-6 pb-24">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-[#FAF8F5] border-2 border-[#E5DDD5] flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-4xl text-[#C19A6B]" />
            </div>
            <p className="text-[#2C2416] font-semibold mb-2">Ev tapılmadı</p>
            <p className="text-sm text-[#6B5D4F]">Başqa filter seçin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="card-premium overflow-hidden group">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={property.images[0]?.url || '/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-2 left-2">
                      <div className="badge-premium text-xs">
                        {property.basePricePerNight} ₼/gecə
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {property.featured && (
                      <div className="absolute top-2 right-2">
                        <div className="px-2 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-[#8B7355]">
                          ⭐ Seçilmiş
                        </div>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                      <FaHeart
                        className={`text-sm transition-colors duration-300 ${
                          favorites.has(property.id) ? 'text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-[#2C2416] mb-1 line-clamp-1">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-[#6B5D4F] mb-2">
                      <FaMapMarkerAlt className="text-[10px]" />
                      <span className="line-clamp-1">{property.city}</span>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-2 text-xs text-[#6B5D4F] mb-2">
                      <div className="flex items-center gap-1">
                        <FaBed className="text-[#8B7355]" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaBath className="text-[#8B7355]" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaRulerCombined className="text-[#8B7355]" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Salam! ${property.title} haqqında məlumat almaq istəyirəm.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-[#25D366] text-white text-xs font-medium hover:bg-[#20BA5A] active:scale-95 transition-all duration-300"
                    >
                      <FaWhatsapp className="text-sm" />
                      <span>Rezerv et</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
