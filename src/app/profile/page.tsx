'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCalendar, FaHome, FaPhone, FaUser, FaHeart } from 'react-icons/fa';
import { getUserBookings } from '@/app/actions/bookings';
import { getUserFavorites } from '@/app/actions/favorites';
import { setUserPhone } from '@/app/actions/favorites';
import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites'>('bookings');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('user_phone');
    if (savedPhone) {
      setPhone(savedPhone);
      setIsLoggedIn(true);
      loadUserData(savedPhone);
    }
  }, []);

  async function loadUserData(userPhone: string) {
    setLoading(true);
    try {
      const [bookingsResult, favoritesResult] = await Promise.all([
        getUserBookings(userPhone),
        getUserFavorites(),
      ]);

      if (bookingsResult.success) {
        setBookings(bookingsResult.bookings);
      }

      if (favoritesResult.success) {
        setFavorites(favoritesResult.favorites);
      }
    } catch (error) {
      console.error('Load user data error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      alert('Düzgün telefon nömrəsi daxil edin');
      return;
    }

    localStorage.setItem('user_phone', phone);
    await setUserPhone(phone);
    setIsLoggedIn(true);
    loadUserData(phone);
  }

  function handleLogout() {
    localStorage.removeItem('user_phone');
    setIsLoggedIn(false);
    setPhone('');
    setBookings([]);
    setFavorites([]);
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <MobileHeader />
        
        <div className="pt-20 px-4 pb-24">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-3xl text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#2C2416] mb-2">Profil</h1>
                <p className="text-sm text-[#6B5D4F]">Rezervasiyalarınızı görmək üçün daxil olun</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2C2416] mb-2">
                    <FaPhone className="inline mr-2" />
                    Telefon nömrəsi
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0501234567"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold hover:shadow-lg transition-all"
                >
                  Daxil ol
                </button>
              </form>
            </div>
          </div>
        </div>

        <MobileFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <MobileHeader />
      
      <div className="pt-20 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* User Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-full flex items-center justify-center">
                  <FaUser className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#2C2416]">Qonaq</h2>
                  <p className="text-sm text-[#6B5D4F]">{phone}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Çıxış
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white'
                  : 'bg-white text-[#6B5D4F]'
              }`}
            >
              <FaCalendar className="inline mr-2" />
              Rezervasiyalar ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white'
                  : 'bg-white text-[#6B5D4F]'
              }`}
            >
              <FaHeart className="inline mr-2" />
              Sevimlilər ({favorites.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
            </div>
          ) : (
            <>
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                      <FaCalendar className="text-5xl text-[#C19A6B] mx-auto mb-4" />
                      <p className="text-[#6B5D4F]">Hələ rezervasiyanız yoxdur</p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-start space-x-4">
                          {booking.properties.property_images[0] && (
                            <Image
                              src={booking.properties.property_images[0].url}
                              alt={booking.properties.title}
                              width={100}
                              height={80}
                              className="w-24 h-20 object-cover rounded-xl"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-[#2C2416] mb-1">
                              {booking.properties.title}
                            </h3>
                            <p className="text-sm text-[#6B5D4F] mb-2">
                              {booking.properties.city}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-[#8B7355]">
                              <span>
                                Giriş: {new Date(booking.checkIn).toLocaleDateString('az-AZ')}
                              </span>
                              <span>
                                Çıxış: {new Date(booking.checkOut).toLocaleDateString('az-AZ')}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-sm font-semibold text-[#2C2416]">
                                {booking.totalNights} gecə • {booking.guestCount} nəfər
                              </span>
                              <span className="text-lg font-bold text-[#8B7355]">
                                {booking.totalPrice}₼
                              </span>
                            </div>
                            <div className="mt-2">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {booking.status === 'CONFIRMED' ? 'Təsdiqlənib' :
                                 booking.status === 'PENDING' ? 'Gözləyir' :
                                 booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="grid grid-cols-2 gap-4">
                  {favorites.length === 0 ? (
                    <div className="col-span-2 bg-white rounded-2xl shadow-sm p-12 text-center">
                      <FaHeart className="text-5xl text-[#C19A6B] mx-auto mb-4" />
                      <p className="text-[#6B5D4F]">Hələ sevimli eviniz yoxdur</p>
                    </div>
                  ) : (
                    favorites.map((fav) => (
                      <a
                        key={fav.id}
                        href={`/properties/${fav.properties.id}`}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {fav.properties.property_images[0] && (
                          <Image
                            src={fav.properties.property_images[0].url}
                            alt={fav.properties.title}
                            width={200}
                            height={150}
                            className="w-full h-40 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-[#2C2416] text-sm mb-1">
                            {fav.properties.title}
                          </h3>
                          <p className="text-xs text-[#6B5D4F] mb-2">
                            {fav.properties.city}
                          </p>
                          <p className="text-sm font-bold text-[#8B7355]">
                            {fav.properties.basePricePerNight}₼/gecə
                          </p>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <MobileFooter />
    </div>
  );
}
