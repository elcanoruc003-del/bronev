'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaHome,
  FaChartLine,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaStar,
  FaCheckCircle,
  FaSpinner,
} from 'react-icons/fa';
import {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getDashboardMetrics,
  getAdminProperties,
  deleteProperty,
  updatePropertyStatus,
  togglePropertyFeatured,
  getAdminBookings,
} from '../app/actions/admin';
import type { DashboardMetrics } from '@/types/index';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'bookings' | 'settings'>('dashboard');
  
  const [metrics, setMetrics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, activeTab]);

  async function checkAuth() {
    try {
      const user = await getCurrentAdmin();
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const result = await loginAdmin(loginEmail, loginPassword);
      
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsLoggedIn(true);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(result.error || 'Giriş uğursuz oldu');
      }
    } catch (error) {
      setLoginError('Xəta baş verdi');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await logoutAdmin();
    setIsLoggedIn(false);
    setCurrentUser(null);
    router.refresh();
  }

  async function loadDashboardData() {
    try {
      if (activeTab === 'dashboard') {
        const { getComprehensiveDashboardStats } = await import('@/app/actions/admin');
        const statsResult = await getComprehensiveDashboardStats();
        if (statsResult.success && statsResult.data) {
          setMetrics(statsResult.data);
        }
      } else if (activeTab === 'properties') {
        const propertiesResult = await getAdminProperties();
        if (propertiesResult.success && propertiesResult.data) {
          setProperties(propertiesResult.data);
        }
      } else if (activeTab === 'bookings') {
        const bookingsResult = await getAdminBookings();
        if (bookingsResult.success && bookingsResult.data) {
          setBookings(bookingsResult.data);
        }
      } else if (activeTab === 'settings') {
        const { getAdminUsers } = await import('@/app/actions/admin');
        const usersResult = await getAdminUsers();
        if (usersResult.success && usersResult.data) {
          setUsers(usersResult.data);
        }
      }
    } catch (error) {
      console.error('Load data error:', error);
    }
  }

  async function handleDeleteProperty(id: string) {
    if (!confirm('Bu evi silmək istədiyinizdən əminsiniz?')) return;

    const result = await deleteProperty(id);
    if (result.success) {
      setProperties(properties.filter(p => p.id !== id));
      alert('Ev uğurla silindi');
    } else {
      alert(result.error);
    }
  }

  async function handleToggleFeatured(id: string) {
    const result = await togglePropertyFeatured(id);
    if (result.success) {
      setProperties(properties.map(p => 
        p.id === id ? { ...p, featured: !p.featured } : p
      ));
    }
  }

  async function handleStatusChange(id: string, status: string) {
    const result = await updatePropertyStatus(id, status as any);
    if (result.success) {
      setProperties(properties.map(p => 
        p.id === id ? { ...p, status } : p
      ));
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#8B7355]" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2416] via-[#3D3226] to-[#2C2416] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#C19A6B] w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaHome className="text-5xl text-[#2C2416]" />
            </div>
            <h1 className="text-4xl font-bold text-[#2C2416] mb-2">Admin Panel</h1>
            <p className="text-[#6B5D4F]">A-Frame İdarəetmə</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">Email</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@bronev.com" 
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] bg-white focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 transition-all duration-300 outline-none"
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#2C2416] mb-2">Parol</label>
              <input 
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-[#E5DDD5] bg-white focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 transition-all duration-300 outline-none"
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full px-6 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Giriş edilir...
                </>
              ) : (
                'Daxil Ol'
              )}
            </button>

            <div className="text-center text-sm text-[#6B5D4F] mt-4">
              Demo: admin@bronev.com / admin123
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E5DDD5] z-50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#C19A6B] p-3 rounded-xl">
              <FaHome className="text-2xl text-[#2C2416]" />
            </div>
            <div>
              <h2 className="font-bold text-[#2C2416]">A-Frame</h2>
              <p className="text-xs text-[#6B5D4F]">Admin</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaChartLine />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'properties'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaHome />
              <span>Evlər</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaCalendarAlt />
              <span>Bronlar</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaCog />
              <span>İstifadəçilər</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#E5DDD5]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-[#2C2416] text-sm">{currentUser?.name}</p>
              <p className="text-xs text-[#6B5D4F]">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition text-sm font-semibold"
          >
            <FaSignOutAlt />
            <span>Çıxış</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        {activeTab === 'dashboard' && metrics && (
          <div>
            <h1 className="text-3xl font-bold text-[#2C2416] mb-8">Dashboard</h1>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-sm font-semibold mb-1">Cəmi Evlər</p>
                    <p className="text-3xl font-bold text-[#2C2416]">{metrics.overview.totalProperties}</p>
                    <p className="text-xs text-green-600 mt-1">✓ {metrics.overview.publishedProperties} aktiv</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaHome />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-sm font-semibold mb-1">Cəmi Bronlar</p>
                    <p className="text-3xl font-bold text-[#2C2416]">{metrics.overview.totalBookings}</p>
                    <p className="text-xs text-amber-600 mt-1">⏳ {metrics.overview.pendingBookings} gözləyir</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaCalendarAlt />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-sm font-semibold mb-1">Təsdiqlənmiş</p>
                    <p className="text-3xl font-bold text-[#2C2416]">{metrics.overview.confirmedBookings}</p>
                    <p className="text-xs text-red-600 mt-1">✗ {metrics.overview.cancelledBookings} ləğv</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaCheckCircle />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-sm font-semibold mb-1">İstifadəçilər</p>
                    <p className="text-3xl font-bold text-[#2C2416]">{metrics.overview.totalUsers}</p>
                    <p className="text-xs text-blue-600 mt-1">👁 {metrics.overview.totalViews} baxış</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaChartLine />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-2xl shadow-lg p-6 text-white">
                <p className="text-white/80 text-sm font-semibold mb-1">Ümumi Gəlir</p>
                <p className="text-4xl font-bold">{metrics.revenue.total.toLocaleString()} ₼</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-[#6B5D4F] text-sm font-semibold mb-1">Aylıq Gəlir</p>
                <p className="text-3xl font-bold text-[#2C2416]">{metrics.revenue.monthly.toLocaleString()} ₼</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-[#6B5D4F] text-sm font-semibold mb-1">Həftəlik Gəlir</p>
                <p className="text-3xl font-bold text-[#2C2416]">{metrics.revenue.weekly.toLocaleString()} ₼</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-[#6B5D4F] text-sm font-semibold mb-1">Orta Bron</p>
                <p className="text-3xl font-bold text-[#2C2416]">{Math.round(metrics.revenue.average).toLocaleString()} ₼</p>
              </div>
            </div>

            {/* Top Properties & City Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-[#2C2416] mb-4">Ən Populyar Evlər</h3>
                <div className="space-y-3">
                  {metrics.topProperties.map((prop: any, index: number) => (
                    <div key={prop.id} className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B7355] to-[#C19A6B] flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2C2416] text-sm">{prop.title}</p>
                          <p className="text-xs text-[#6B5D4F]">{prop.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#2C2416]">{prop.bookingCount} bron</p>
                        <p className="text-xs text-[#6B5D4F]">{prop.revenue.toLocaleString()} ₼</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-[#2C2416] mb-4">Şəhər Statistikaları</h3>
                <div className="space-y-3">
                  {Object.entries(metrics.cityStats).map(([city, stats]: [string, any]) => (
                    <div key={city} className="p-3 bg-[#FAF8F5] rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-[#2C2416]">{city}</p>
                        <p className="text-sm font-bold text-[#8B7355]">{stats.count} ev</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#6B5D4F]">
                        <span>{stats.bookings} bron</span>
                        <span className="font-semibold">{stats.revenue.toLocaleString()} ₼</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#2C2416] mb-4">Son Bronlar</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-[#2C2416]">Ev</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-[#2C2416]">İstifadəçi</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-[#2C2416]">Tarix</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-[#2C2416]">Qiymət</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-[#2C2416]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DDD5]">
                    {metrics.recentBookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-[#FAF8F5]">
                        <td className="px-4 py-3 text-sm">{booking.propertyTitle}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="font-semibold">{booking.userName}</p>
                            <p className="text-xs text-[#6B5D4F]">{booking.userPhone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {new Date(booking.checkIn).toLocaleDateString('az-AZ')} - {new Date(booking.checkOut).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">{booking.totalPrice.toLocaleString()} ₼</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#2C2416]">Evlər</h1>
              <button 
                onClick={() => router.push('/admin/properties/new')}
                className="px-6 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95"
              >
                + Yeni Ev
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#FAF8F5] border-b border-[#E5DDD5]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Ev</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Qiymət</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Baxış</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DDD5]">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-[#FAF8F5]">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#2C2416]">{property.title}</p>
                        <p className="text-sm text-[#6B5D4F]">{property.city}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">{property.basePricePerNight} ₼</td>
                      <td className="px-6 py-4">
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(property.id, e.target.value)}
                          className="text-sm border border-[#E5DDD5] rounded px-2 py-1"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">{property.views}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleFeatured(property.id)}
                            className={`p-2 rounded ${property.featured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100'}`}
                            title={property.featured ? 'VIP-dən çıxart' : 'VIP et'}
                          >
                            <FaStar />
                          </button>
                          <button 
                            onClick={() => router.push(`/admin/properties/edit/${property.id}`)}
                            className="p-2 bg-blue-50 text-blue-600 rounded"
                            title="Redaktə et"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="p-2 bg-red-50 text-red-600 rounded"
                            title="Sil"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h1 className="text-3xl font-bold text-[#2C2416] mb-8">Bronlar</h1>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <FaCalendarAlt className="text-6xl text-[#C19A6B] mx-auto mb-4" />
                <p className="text-xl text-[#6B5D4F]">Hələ bron yoxdur</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5DDD5]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Ev</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">İstifadəçi</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Tarixlər</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Qonaq</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Qiymət</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DDD5]">
                    {bookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-[#FAF8F5]">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#2C2416]">{booking.properties?.title}</p>
                          <p className="text-sm text-[#6B5D4F]">{booking.properties?.city}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#2C2416]">{booking.users?.name}</p>
                          <p className="text-sm text-[#6B5D4F]">{booking.users?.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <p>{new Date(booking.checkIn).toLocaleDateString('az-AZ')}</p>
                          <p className="text-[#6B5D4F]">{new Date(booking.checkOut).toLocaleDateString('az-AZ')}</p>
                        </td>
                        <td className="px-6 py-4">{booking.guests} nəfər</td>
                        <td className="px-6 py-4 font-bold">{booking.totalPrice?.toLocaleString()} ₼</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold text-[#2C2416] mb-8">İstifadəçilər</h1>
            {users.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <FaChartLine className="text-6xl text-[#C19A6B] mx-auto mb-4" />
                <p className="text-xl text-[#6B5D4F]">Hələ istifadəçi yoxdur</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5DDD5]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Ad</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Telefon</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Rol</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Bronlar</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Sevimlilər</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#2C2416]">Qeydiyyat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DDD5]">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-[#FAF8F5]">
                        <td className="px-6 py-4 font-semibold text-[#2C2416]">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-[#6B5D4F]">{user.email}</td>
                        <td className="px-6 py-4 text-sm">{user.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold">{user._count.bookings}</td>
                        <td className="px-6 py-4 text-center font-bold">{user._count.favorites}</td>
                        <td className="px-6 py-4 text-sm text-[#6B5D4F]">
                          {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
