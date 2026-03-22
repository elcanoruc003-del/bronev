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
  weekendPriceMultiplier?: number;
  guestPricing?: Array<{ minGuests: number; maxGuests: number; weekday: number; weekend: number }>; // Aralıq əsaslı qiymət
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
  }, [checkIn, checkOut, guests, property]);

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

  function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 6 || day === 0; // 6 = Şənbə, 0 = Bazar
  }

  function getPriceForGuests(guestCount: number): { weekday: number; weekend: number } | null {
    if (!property?.guestPricing || property.guestPricing.length === 0) return null;
    
    // Qonaq sayına uyğun aralığı tap
    const range = property.guestPricing.find(
      r => guestCount >= r.minGuests && guestCount <= r.maxGuests
    );
    
    return range ? { weekday: range.weekday, weekend: range.weekend } : null;
  }

  function calculateNights() {
    if (checkIn && checkOut && property) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      
      // Qonaq sayına görə qiymət varsa, onu istifadə et
      const guestPrice = getPriceForGuests(guests);
      
      if (guestPrice) {
        let total = 0;
        const currentDate = new Date(start);
        
        // Hər gecəni yoxla və həftəiçi/həftəsonu qiymətini tətbiq et
        for (let i = 0; i < diffDays; i++) {
          if (isWeekend(currentDate)) {
            total += guestPrice.weekend;
          } else {
            total += guestPrice.weekday;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setTotalPrice(total);
      } else {
        // Əgər qonaq sayına görə qiymət yoxdursa, ümumi qiyməti istifadə et
        let total = 0;
        const currentDate = new Date(start);
        const weekendMultiplier = property.weekendPriceMultiplier || 1.0;
        
        for (let i = 0; i < diffDays; i++) {
          if (isWeekend(currentDate)) {
            total += property.basePricePerNight * weekendMultiplier;
          } else {
            total += property.basePricePerNight;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setTotalPrice(Math.round(total));
      }
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }

  function getPriceBreakdown(): string {
    if (!checkIn || !checkOut || !property || nights === 0) return '';
    
    const start = new Date(checkIn);
    let breakdown = '';
    let weekdayNights = 0;
    let weekendNights = 0;
    
    const currentDate = new Date(start);
    for (let i = 0; i < nights; i++) {
      if (isWeekend(currentDate)) {
        weekendNights++;
      } else {
        weekdayNights++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const guestPrice = getPriceForGuests(guests);
    
    if (guestPrice) {
      if (weekdayNights > 0) {
        breakdown += `${weekdayNights} həftəiçi gecə × ${guestPrice.weekday}₼ = ${weekdayNights * guestPrice.weekday}₼\n`;
      }
      if (weekendNights > 0) {
        breakdown += `${weekendNights} həftəsonu gecə × ${guestPrice.weekend}₼ = ${weekendNights * guestPrice.weekend}₼`;
      }
    } else {
      const weekendMultiplier = property.weekendPriceMultiplier || 1.0;
      if (weekdayNights > 0) {
        breakdown += `${weekdayNights} həftəiçi gecə × ${property.basePricePerNight}₼ = ${weekdayNights * property.basePricePerNight}₼\n`;
      }
      if (weekendNights > 0) {
        const weekendPrice = Math.round(property.basePricePerNight * weekendMultiplier);
        breakdown += `${weekendNights} həftəsonu gecə × ${weekendPrice}₼ = ${weekendNights * weekendPrice}₼`;
      }
    }
    
    return breakdown;
  }

  function handleWhatsAppBooking() {
    if (!property || !checkIn || !checkOut || nights === 0) {
      alert('Zəhmət olmasa bütün məlumatları doldurun');
      return;
    }

    const priceBreakdown = getPriceBreakdown();
    const message = `Salam! Ev haqqında məlumat almaq istəyirəm:

🏠 *${property.title}*
🆔 ID: ${property.id}
📍 Ünvan: ${property.city}, ${property.address}

📅 Giriş: ${checkIn}
📅 Çıxış: ${checkOut}
🌙 Gecə sayı: ${nights}
👥 Qonaq sayı: ${guests}

💰 Qiymət:
${priceBreakdown}

💵 *Cəmi: ${totalPrice}₼*

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
      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2.5 md:py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1.5 md:space-x-2 text-[#6B5D4F] hover:text-[#2C2416] text-xs md:text-base"
          >
            <FaArrowLeft className="text-xs md:text-base" />
            <span>Geri</span>
          </button>
          
          <button
            onClick={toggleFavorite}
            className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#FAF8F5] hover:bg-[#E5DDD5] transition-colors"
          >
            <FaHeart className={`text-sm md:text-lg ${isFavorite ? 'text-red-500' : 'text-[#6B5D4F]'}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 md:px-4 py-3 md:py-6">
        {/* Images Gallery - Mobile Optimized */}
        <div className="mb-3 md:mb-6">
          {property.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {/* First image - larger on desktop */}
              <div className="col-span-2 md:col-span-2 md:row-span-2">
                <div className="relative w-full aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
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
                  <div className="relative w-full aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
          {/* Left: Property Info */}
          <div className="lg:col-span-2 space-y-3 md:space-y-6">
            {/* Title - Mobile Optimized */}
            <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4">
              <h1 className="text-lg md:text-3xl font-bold text-[#2C2416] mb-1.5 md:mb-2">{property.title}</h1>
              <div className="flex items-center text-[#6B5D4F] text-xs md:text-base">
                <FaMapMarkerAlt className="mr-1.5 md:mr-2 text-xs md:text-base" />
                <span>{property.city}, {property.district}</span>
              </div>
              <p className="text-[10px] md:text-sm text-[#8B7355] mt-1">ID: {property.id}</p>
            </div>

            {/* Features - Mobile Grid */}
            <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="grid grid-cols-2 gap-2.5 md:flex md:items-center md:gap-6 text-[#2C2416]">
                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-base">
                  <FaBed className="text-[#8B7355] text-xs md:text-base" />
                  <span>{property.bedrooms} otaq</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-base">
                  <FaBath className="text-[#8B7355] text-xs md:text-base" />
                  <span>{property.bathrooms} vanna</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-base">
                  <FaRulerCombined className="text-[#8B7355] text-xs md:text-base" />
                  <span>{property.area}m²</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-base">
                  <FaUsers className="text-[#8B7355] text-xs md:text-base" />
                  <span>{property.maxGuests} qonaq</span>
                </div>
              </div>
            </div>

            {/* Description - Mobile Optimized */}
            <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-[#2C2416] mb-2 md:mb-4">Haqqında</h2>
              <p className="text-[#6B5D4F] whitespace-pre-line text-xs md:text-base leading-relaxed">{property.longDescription}</p>
            </div>

            {/* Amenities - Mobile Optimized */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6">
                <h2 className="text-base md:text-xl font-bold text-[#2C2416] mb-2 md:mb-4">İmkanlar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-1.5 md:gap-2 text-[#6B5D4F] text-xs md:text-base">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#8B7355] flex-shrink-0"></div>
                      <span className="leading-tight">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card - Mobile Optimized */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3.5 md:p-6 lg:sticky lg:top-24">
              <div className="text-center mb-3 md:mb-6">
                <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">
                  {property.weekendPriceMultiplier && property.weekendPriceMultiplier !== 1.0 ? (
                    <>{property.basePricePerNight}/{Math.round(property.basePricePerNight * property.weekendPriceMultiplier)}₼</>
                  ) : (
                    <>{property.basePricePerNight}₼</>
                  )}
                </p>
                <p className="text-xs md:text-sm text-[#6B5D4F]">gecəlik (həftəiçi/həftəsonu)</p>
              </div>

              <div className="space-y-2.5 md:space-y-4">
                {/* Check-in - Mobile Optimized */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    <FaCalendar className="inline mr-1 md:mr-2 text-[10px] md:text-xs" />
                    Giriş tarixi
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-xs md:text-base"
                  />
                </div>

                {/* Check-out - Mobile Optimized */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    <FaCalendar className="inline mr-1 md:mr-2 text-[10px] md:text-xs" />
                    Çıxış tarixi
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-xs md:text-base"
                  />
                </div>

                {/* Guests - Mobile Optimized */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    <FaUsers className="inline mr-1 md:mr-2 text-[10px] md:text-xs" />
                    Qonaq sayı
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-xs md:text-base"
                  >
                    {[...Array(property.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} nəfər
                      </option>
                    ))}
                  </select>
                </div>

                {/* Summary - Mobile Optimized */}
                {nights > 0 && (
                  <div className="bg-[#FAF8F5] rounded-lg p-3 md:p-4 space-y-1.5 md:space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-[#6B5D4F]">Gecə sayı:</span>
                      <span className="font-semibold text-[#2C2416]">{nights}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-[#6B5D4F]">Qonaq:</span>
                      <span className="font-semibold text-[#2C2416]">{guests} nəfər</span>
                    </div>
                    <div className="border-t border-[#E5DDD5] pt-1.5 md:pt-2 flex justify-between">
                      <span className="font-semibold text-[#2C2416] text-xs md:text-base">Cəmi:</span>
                      <span className="text-lg md:text-xl font-bold text-[#8B7355]">{totalPrice}₼</span>
                    </div>
                  </div>
                )}

                {/* WhatsApp Button - Mobile Optimized */}
                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#20BA5A] text-white py-3 md:py-4 rounded-lg font-semibold flex items-center justify-center gap-1.5 md:gap-2 hover:shadow-lg transition-all text-xs md:text-base"
                >
                  <FaWhatsapp className="text-base md:text-xl" />
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
