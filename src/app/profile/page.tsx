'use client';

import { useState, useEffect } from 'react';
import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';
import { FaUser, FaHeart, FaCalendarAlt, FaSpinner, FaSignOutAlt } from 'react-icons/fa';
import { getCurrentUser, logoutUser } from '@/app/actions/auth';
import { getUserFavorites } from '@/app/actions/favorites';
import { getUserBookings } from '@/app/actions/bookings';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites'>('bookings');

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        router.push('/');
        return;
      }

      setUser(currentUser);

      // Load favorites
      const favResult = await getUserFavorites();
      if (favResult.success) {
        setFavorites(favResult.favorites);
      }

      // Load bookings
      const bookingsResult = await getUserBookings();
      if (bookingsResult.success) {
        setBookings(bookingsResult.bookings);
      }
    } catch (error) {
      console.error('Load user data error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    if (confirm('Çıxış etmək istədiyinizdən əminsiniz?')) {
      await logoutUser();
      router.push('/');
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <MobileHeader />
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-4xl text-[#8B7355]" />
        </div>
        <MobileFooter />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <MobileHeader />
      
      <div className="px-4 py-8 pb-24 pt-20">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B7355] to-[#C19A6B] flex items-center justify-center">
              <FaUser className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#2C2416]">{user.name}</h1>
              <p className="text-sm text-[#6B5D4F]">{user.email}</p>
              {user.phone && (
                <p className="text-sm text-[#6B5D4F]">{user.phone}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl hover:bg-red-100 transition font-semibold"
          >
            <FaSignOutAlt />
            <span>Çıxış</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white'
                : 'bg-white text-[#6B5D4F]'
            }`}
          >
            <FaCalendarAlt />
            <span>Bronlar ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white'
                : 'bg-white text-[#6B5D4F]'
            }`}
          >
            <FaHeart />
            <span>Sevimlilər ({favorites.length})</span>
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <FaCalendarAlt className="text-6xl text-[#C19A6B] mx-auto mb-4" />
                <p className="text-xl text-[#6B5D4F] mb-2">Hələ bron yoxdur</p>
                <p className="text-sm text-[#6B5D4F]">Ev rezerv etdikdə burada görünəcək</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex gap-4">
                      {booking.properties?.property_images?.[0] && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={booking.properties.property_images[0].url}
                            alt={booking.properties.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2C2416] mb-1">
                          {booking.properties?.title}
                        </h3>
                        <p className="text-sm text-[#6B5D4F] mb-2">
                          {new Date(booking.checkIn).toLocaleDateString('az-AZ')} - {new Date(booking.checkOut).toLocaleDateString('az-AZ')}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#8B7355]">
                            {booking.totalPrice?.toLocaleString()} ₼
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <FaHeart className="text-6xl text-[#C19A6B] mx-auto mb-4" />
                <p className="text-xl text-[#6B5D4F] mb-2">Hələ sevimli ev yoxdur</p>
                <p className="text-sm text-[#6B5D4F]">Bəyəndiyiniz evləri ürək ikonuna toxunaraq əlavə edin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((favorite: any) => (
                  <a
                    key={favorite.id}
                    href={`/properties/${favorite.properties.id}`}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-48">
                      <Image
                        src={favorite.properties.property_images[0]?.url || '/placeholder.jpg'}
                        alt={favorite.properties.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#2C2416] mb-2">
                        {favorite.properties.title}
                      </h3>
                      <p className="text-sm text-[#6B5D4F] mb-2">
                        {favorite.properties.city}
                      </p>
                      <p className="text-lg font-bold text-[#8B7355]">
                        {favorite.properties.basePricePerNight} ₼/gecə
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <MobileFooter />
    </main>
  );
}
