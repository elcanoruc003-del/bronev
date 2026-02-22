'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaUsers, FaMapMarkerAlt, FaArrowLeft, FaWhatsapp, FaCalendar, FaHeart } from 'react-icons/fa';

interface Property {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  basePricePerNight: number;
  city: string;
  district: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  maxGuests: number;
  amenities: string[];
  features: string[];
  images: Array<{ url: string; alt?: string }>;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Booking form
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchProperty();
    checkFavoriteStatus();
  }, [params.id]);

  useEffect(() => {
    calculateNights();
  }, [checkIn, checkOut]);

  function checkFavoriteStatus() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favs = JSON.parse(savedFavorites);
      setIsFavorite(favs.includes(params.id));
    }
  }

  async function toggleFavorite() {
    const savedFavorites = localStorage.getItem('favorites');
    let favs = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (isFavorite) {
      favs = favs.filter((id: string) => id !== params.id);
    } else {
      favs.push(params.id);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
    
    // Try to save to backend
    try {
      const { toggleFavorite: toggleFavoriteAction } = await import('@/app/actions/favorites');
      await toggleFavoriteAction(params.id as string);
    } catch (error) {
      console.log('Backend save skipped - user not logged in');
    }
  }

  async function fetchProperty() {
    try {
      const res = await fetch(`/api/properties/${params.id}`);
      const data = await res.json();
      if (data.property) {
        setProperty(data.property);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateNights() {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      if (property) {
        setTotalPrice(diffDays * property.basePricePerNight);
      }
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }

  function handleWhatsAppBooking() {
    if (!property || !checkIn || !checkOut || nights === 0) {
      alert('Zəhmət olmasa bütün məlumatları doldurun');
      return;
    }

    const message = `Salam! Ev haqqında məlumat almaq istəyirəm:

🏠 *${property.title}*
🆔 ID: ${property.id}
📍 Ünvan: ${property.city}, ${property.address}

📅 Giriş: ${checkIn}
📅 Çıxış: ${checkOut}
🌙 Gecə sayı: ${nights}
👥 Qonaq sayı: ${guests}

💰 Qiymət: ${property.basePricePerNight}₼/gecə
💵 Cəmi: ${totalPrice}₼

Ətraflı məlumat almaq istəyirəm.`;

    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
          <p className="mt-4 text-[#6B5D4F]">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-[#2C2416]">Ev tapılmadı</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-[#8B7355] text-white rounded-lg"
          >
            Ana səhifəyə qayıt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-[#6B5D4F] hover:text-[#2C2416]"
          >
            <FaArrowLeft />
            <span>Geri</span>
          </button>
          
          <button
            onClick={toggleFavorite}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#E5DDD5] transition-colors"
          >
            <FaHeart className={`text-xl ${isFavorite ? 'text-red-500' : 'text-[#6B5D4F]'}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Images Gallery - Professional Grid Layout */}
        <div className="mb-6">
          {property.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* First image - larger on desktop */}
              <div className="col-span-2 md:col-span-2 md:row-span-2">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <Image
                    src={property.images[0].url}
                    alt={property.images[0].alt || property.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
              </div>
              
              {/* All other images - uniform size */}
              {property.images.slice(1).map((image, index) => (
                <div key={index} className="col-span-1">
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <Image
                      src={image.url}
                      alt={image.alt || property.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-[#2C2416] mb-2">{property.title}</h1>
              <div className="flex items-center text-[#6B5D4F]">
                <FaMapMarkerAlt className="mr-2" />
                <span>{property.city}, {property.district}</span>
              </div>
              <p className="text-sm text-[#8B7355] mt-1">ID: {property.id}</p>
            </div>

            {/* Features */}
            <div className="flex items-center gap-6 text-[#2C2416]">
              <div className="flex items-center gap-2">
                <FaBed className="text-[#8B7355]" />
                <span>{property.bedrooms} otaq</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-[#8B7355]" />
                <span>{property.bathrooms} vanna</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRulerCombined className="text-[#8B7355]" />
                <span>{property.area}m²</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-[#8B7355]" />
                <span>{property.maxGuests} qonaq</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#2C2416] mb-4">Haqqında</h2>
              <p className="text-[#6B5D4F] whitespace-pre-line">{property.longDescription}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#2C2416] mb-4">İmkanlar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-[#6B5D4F]">
                      <div className="w-2 h-2 rounded-full bg-[#8B7355]"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-[#2C2416]">{property.basePricePerNight}₼</p>
                <p className="text-sm text-[#6B5D4F]">gecəlik</p>
              </div>

              <div className="space-y-4">
                {/* Check-in */}
                <div>
                  <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                    <FaCalendar className="inline mr-2" />
                    Giriş tarixi
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                    <FaCalendar className="inline mr-2" />
                    Çıxış tarixi
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                    <FaUsers className="inline mr-2" />
                    Qonaq sayı
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                  >
                    {[...Array(property.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} nəfər
                      </option>
                    ))}
                  </select>
                </div>

                {/* Summary */}
                {nights > 0 && (
                  <div className="bg-[#FAF8F5] rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B5D4F]">Gecə sayı:</span>
                      <span className="font-semibold text-[#2C2416]">{nights}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B5D4F]">Qonaq:</span>
                      <span className="font-semibold text-[#2C2416]">{guests} nəfər</span>
                    </div>
                    <div className="border-t border-[#E5DDD5] pt-2 flex justify-between">
                      <span className="font-semibold text-[#2C2416]">Cəmi:</span>
                      <span className="text-xl font-bold text-[#8B7355]">{totalPrice}₼</span>
                    </div>
                  </div>
                )}

                {/* WhatsApp Button */}
                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#20BA5A] text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <FaWhatsapp className="text-xl" />
                  <span>WhatsApp ilə sifariş et</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
