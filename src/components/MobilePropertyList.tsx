'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaWhatsapp, FaHeart } from 'react-icons/fa';

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
  images: Array<{ url: string; alt?: string }>;
}

export default function MobilePropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

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

  const cities = ['all', 'Bakı', 'Qəbələ', 'Şəki', 'Quba', 'Şamaxı'];
  const priceRanges = [
    { value: 'all', label: 'Bütün qiymətlər' },
    { value: '0-100', label: '0-100 ₼' },
    { value: '100-200', label: '100-200 ₼' },
    { value: '200-500', label: '200-500 ₼' },
    { value: '500+', label: '500+ ₼' },
  ];

  const filteredProperties = properties.filter((property) => {
    if (selectedCity !== 'all' && property.city !== selectedCity) return false;
    
    if (priceRange !== 'all') {
      const price = property.basePricePerNight;
      if (priceRange === '0-100' && (price < 0 || price > 100)) return false;
      if (priceRange === '100-200' && (price < 100 || price > 200)) return false;
      if (priceRange === '200-500' && (price < 200 || price > 500)) return false;
      if (priceRange === '500+' && price < 500) return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Filters */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 space-y-3">
        {/* City Filter */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {city === 'all' ? 'Hamısı' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-4 py-4">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Ev tapılmadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageUrl = property.images[0]?.url || '/placeholder.jpg';

  const handleWhatsApp = () => {
    const message = `Salam! ${property.title} haqqında məlumat almaq istəyirəm.`;
    const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition"
        >
          <FaHeart className={`text-xs ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md">
          <p className="text-xs font-bold">{property.basePricePerNight} ₼</p>
          <p className="text-[10px] opacity-90">gecəlik</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5">
        {/* Location */}
        <div className="flex items-center gap-1 mb-1.5">
          <FaMapMarkerAlt className="text-gray-400 text-[10px]" />
          <p className="text-[11px] text-gray-600 font-medium">{property.city}</p>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {property.title}
        </h3>

        {/* Features */}
        <div className="flex items-center gap-3 mb-2.5 text-gray-600">
          <div className="flex items-center gap-1">
            <FaBed className="text-[11px]" />
            <span className="text-[11px] font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath className="text-[11px]" />
            <span className="text-[11px] font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRulerCombined className="text-[11px]" />
            <span className="text-[11px] font-medium">{property.area}m²</span>
          </div>
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-1.5 transition text-xs font-semibold"
        >
          <FaWhatsapp className="text-sm" />
          <span>Əlaqə</span>
        </button>
      </div>
    </div>
  );
}
