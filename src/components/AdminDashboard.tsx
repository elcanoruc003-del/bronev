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
  FaPlus,
  FaTimes,
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const [metrics, setMetrics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    userId: '',
    propertyId: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    totalPrice: 0,
    status: 'CONFIRMED' as const,
  });
  const [bookingError, setBookingError] = useState('');

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

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingError('');

    try {
      const { createAdminBooking } = await import('@/app/actions/admin');
      const result = await createAdminBooking(bookingForm);

      if (result.success) {
        setShowBookingModal(false);
        setBookingForm({
          userId: '',
          propertyId: '',
          checkIn: '',
          checkOut: '',
          guests: 2,
          totalPrice: 0,
          status: 'CONFIRMED',
        });
        // Refresh bookings
        loadDashboardData();
        alert('Bron uğurla yaradıldı');
      } else {
        setBookingError(result.error || 'Xəta baş verdi');
      }
    } catch (error: any) {
      setBookingError(error.message || 'Xəta baş verdi');
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
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center"
      >
        <div className="space-y-1">
          <div className="w-5 h-0.5 bg-[#8B7355]"></div>
          <div className="w-5 h-0.5 bg-[#8B7355]"></div>
          <div className="w-5 h-0.5 bg-[#8B7355]"></div>
        </div>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E5DDD5] z-50 transition-transform duration-300
        ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setShowMobileMenu(false)}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#6B5D4F] hover:bg-[#FAF8F5] rounded-lg"
        >
          <FaTimes />
        </button>
        <div className="p-4 md:p-6">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#C19A6B] p-2 md:p-3 rounded-lg md:rounded-xl">
              <FaHome className="text-xl md:text-2xl text-[#2C2416]" />
            </div>
            <div>
              <h2 className="font-bold text-[#2C2416] text-sm md:text-base">A-Frame</h2>
              <p className="text-xs text-[#6B5D4F]">Admin</p>
            </div>
          </div>

          <nav className="space-y-1 md:space-y-2">
            <button
              onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}
              className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition text-sm md:text-base ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaChartLine className="text-base md:text-lg" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('properties'); setShowMobileMenu(false); }}
              className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition text-sm md:text-base ${
                activeTab === 'properties'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaHome className="text-base md:text-lg" />
              <span>Evlər</span>
            </button>

            <button
              onClick={() => { setActiveTab('bookings'); setShowMobileMenu(false); }}
              className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition text-sm md:text-base ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaCalendarAlt className="text-base md:text-lg" />
              <span>Bronlar</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setShowMobileMenu(false); }}
              className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition text-sm md:text-base ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white font-semibold'
                  : 'text-[#6B5D4F] hover:bg-[#FAF8F5]'
              }`}
            >
              <FaCog className="text-base md:text-lg" />
              <span>İstifadəçilər</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 border-t border-[#E5DDD5]">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#2C2416] text-xs md:text-sm truncate">{currentUser?.name}</p>
              <p className="text-xs text-[#6B5D4F] truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-3 md:px-4 py-2 rounded-lg md:rounded-xl hover:bg-red-100 transition text-xs md:text-sm font-semibold"
          >
            <FaSignOutAlt />
            <span>Çıxış</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <main className="lg:ml-64 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
        {activeTab === 'dashboard' && metrics && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-6 md:mb-8">Dashboard</h1>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-xs md:text-sm font-semibold mb-1">Cəmi Evlər</p>
                    <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">{metrics.overview.totalProperties}</p>
                    <p className="text-xs text-green-600 mt-1">✓ {metrics.overview.publishedProperties} aktiv</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg md:text-2xl">
                    <FaHome />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-xs md:text-sm font-semibold mb-1">Cəmi Bronlar</p>
                    <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">{metrics.overview.totalBookings}</p>
                    <p className="text-xs text-amber-600 mt-1">⏳ {metrics.overview.pendingBookings} gözləyir</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg md:text-2xl">
                    <FaCalendarAlt />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-xs md:text-sm font-semibold mb-1">Təsdiqlənmiş</p>
                    <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">{metrics.overview.confirmedBookings}</p>
                    <p className="text-xs text-red-600 mt-1">✗ {metrics.overview.cancelledBookings} ləğv</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg md:text-2xl">
                    <FaCheckCircle />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border-l-4 border-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B5D4F] text-xs md:text-sm font-semibold mb-1">İstifadəçilər</p>
                    <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">{metrics.overview.totalUsers}</p>
                    <p className="text-xs text-blue-600 mt-1">👁 {metrics.overview.totalViews} baxış</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg md:text-2xl">
                    <FaChartLine />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              <div className="bg-gradient-to-br from-[#8B7355] to-[#C19A6B] rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 text-white">
                <p className="text-white/80 text-xs md:text-sm font-semibold mb-1">Ümumi Gəlir</p>
                <p className="text-2xl md:text-4xl font-bold">{metrics.revenue.total.toLocaleString()} ₼</p>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
                <p className="text-[#6B5D4F] text-xs md:text-sm font-semibold mb-1">Aylıq Gəlir</p>
                <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">{metrics.revenue.monthly.toLocaleString()} ₼</p>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
                <p className="text-[#6B5D4F] text-xs md:text-sm font-semibold mb-1">Həftəlik Gəlir</p>
                <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">{metrics.revenue.weekly.toLocaleString()} ₼</p>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
                <p className="text-[#6B5D4F] text-xs md:text-sm font-semibold mb-1">Orta Bron</p>
                <p className="text-2xl md:text-3xl font-bold text-[#2C2416]">{Math.round(metrics.revenue.average).toLocaleString()} ₼</p>
              </div>
            </div>

            {/* Top Properties & City Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-[#2C2416] mb-4">Ən Populyar Evlər</h3>
                <div className="space-y-2 md:space-y-3">
                  {metrics.topProperties.map((prop: any, index: number) => (
                    <div key={prop.id} className="flex items-center justify-between p-2.5 md:p-3 bg-[#FAF8F5] rounded-lg md:rounded-xl">
                      <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-[#8B7355] to-[#C19A6B] flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#2C2416] text-xs md:text-sm truncate">{prop.title}</p>
                          <p className="text-xs text-[#6B5D4F]">{prop.city}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-[#2C2416] text-xs md:text-sm">{prop.bookingCount} bron</p>
                        <p className="text-xs text-[#6B5D4F]">{prop.revenue.toLocaleString()} ₼</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-[#2C2416] mb-4">Şəhər Statistikaları</h3>
                <div className="space-y-2 md:space-y-3">
                  {Object.entries(metrics.cityStats).map(([city, stats]: [string, any]) => (
                    <div key={city} className="p-2.5 md:p-3 bg-[#FAF8F5] rounded-lg md:rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-[#2C2416] text-sm md:text-base">{city}</p>
                        <p className="text-xs md:text-sm font-bold text-[#8B7355]">{stats.count} ev</p>
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
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-[#2C2416] mb-4">Son Bronlar</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full">
                    <thead className="bg-[#FAF8F5]">
                      <tr>
                        <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-[#2C2416]">Ev</th>
                        <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-[#2C2416] hidden sm:table-cell">İstifadəçi</th>
                        <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-[#2C2416] hidden lg:table-cell">Tarix</th>
                        <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-[#2C2416]">Qiymət</th>
                        <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-[#2C2416]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DDD5]">
                      {metrics.recentBookings.map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-[#FAF8F5]">
                          <td className="px-3 md:px-4 py-2 md:py-3">
                            <p className="text-xs md:text-sm font-semibold text-[#2C2416]">{booking.propertyTitle}</p>
                          </td>
                          <td className="px-3 md:px-4 py-2 md:py-3 hidden sm:table-cell">
                            <div>
                              <p className="font-semibold text-xs md:text-sm">{booking.userName}</p>
                              <p className="text-xs text-[#6B5D4F] hidden md:block">{booking.userPhone}</p>
                            </div>
                          </td>
                          <td className="px-3 md:px-4 py-2 md:py-3 text-xs hidden lg:table-cell">
                            {new Date(booking.checkIn).toLocaleDateString('az-AZ')} - {new Date(booking.checkOut).toLocaleDateString('az-AZ')}
                          </td>
                          <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-bold">{booking.totalPrice.toLocaleString()} ₼</td>
                          <td className="px-3 md:px-4 py-2 md:py-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
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
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C2416]">Evlər</h1>
              <button 
                onClick={() => router.push('/admin/properties/new')}
                className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white shadow-lg hover:shadow-xl active:scale-95 text-sm md:text-base"
              >
                + Yeni Ev
              </button>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5DDD5]">
                    <tr>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Ev</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden md:table-cell">Qiymət</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden lg:table-cell">Baxış</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DDD5]">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-[#FAF8F5]">
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <p className="font-semibold text-[#2C2416] text-xs md:text-sm">{property.title}</p>
                          <p className="text-xs text-[#6B5D4F]">{property.city}</p>
                          <p className="text-xs font-bold text-[#8B7355] md:hidden mt-1">{property.basePricePerNight} ₼</p>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-sm hidden md:table-cell">{property.basePricePerNight} ₼</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <select
                            value={property.status}
                            onChange={(e) => handleStatusChange(property.id, e.target.value)}
                            className="text-[10px] md:text-sm border border-[#E5DDD5] rounded px-1.5 md:px-2 py-1 w-full md:w-auto"
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell text-xs md:text-sm">{property.views}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                            <button
                              onClick={() => handleToggleFeatured(property.id)}
                              className={`p-1.5 md:p-2 rounded text-xs md:text-sm ${property.featured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100'}`}
                              title={property.featured ? 'VIP-dən çıxart' : 'VIP et'}
                            >
                              <FaStar />
                            </button>
                            <button 
                              onClick={() => router.push(`/admin/properties/edit/${property.id}`)}
                              className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded text-xs md:text-sm"
                              title="Redaktə et"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="p-1.5 md:p-2 bg-red-50 text-red-600 rounded text-xs md:text-sm"
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
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C2416]">Bronlar</h1>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full md:rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <FaPlus />
                Yeni Bron
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-8 md:p-12 text-center">
                <FaCalendarAlt className="text-5xl md:text-6xl text-[#C19A6B] mx-auto mb-4" />
                <p className="text-lg md:text-xl text-[#6B5D4F]">Hələ bron yoxdur</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#FAF8F5] border-b border-[#E5DDD5]">
                      <tr>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Ev</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden sm:table-cell">İstifadəçi</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden lg:table-cell">Tarixlər</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden md:table-cell">Qonaq</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Qiymət</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DDD5]">
                      {bookings.map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-[#FAF8F5]">
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <p className="font-semibold text-[#2C2416] text-xs md:text-base">{booking.properties?.title}</p>
                            <p className="text-xs md:text-sm text-[#6B5D4F]">{booking.properties?.city}</p>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                            <p className="font-semibold text-[#2C2416] text-xs md:text-base">{booking.users?.name}</p>
                            <p className="text-xs md:text-sm text-[#6B5D4F]">{booking.users?.phone}</p>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm hidden lg:table-cell">
                            <p>{new Date(booking.checkIn).toLocaleDateString('az-AZ')}</p>
                            <p className="text-[#6B5D4F]">{new Date(booking.checkOut).toLocaleDateString('az-AZ')}</p>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-base hidden md:table-cell">{booking.guests} nəfər</td>
                          <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-base">{booking.totalPrice?.toLocaleString()} ₼</td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
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
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-6 md:mb-8">İstifadəçilər</h1>
            {users.length === 0 ? (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-8 md:p-12 text-center">
                <FaChartLine className="text-5xl md:text-6xl text-[#C19A6B] mx-auto mb-4" />
                <p className="text-lg md:text-xl text-[#6B5D4F]">Hələ istifadəçi yoxdur</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#FAF8F5] border-b border-[#E5DDD5]">
                      <tr>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Ad</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden lg:table-cell">Email</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden sm:table-cell">Telefon</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416]">Rol</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden md:table-cell">Bronlar</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden md:table-cell">Sevimlilər</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-[#2C2416] hidden lg:table-cell">Qeydiyyat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DDD5]">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-[#FAF8F5]">
                          <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-[#2C2416] text-xs md:text-base">{user.name}</td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B5D4F] hidden lg:table-cell">{user.email}</td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm hidden sm:table-cell">{user.phone}</td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                              user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-center font-bold text-xs md:text-base hidden md:table-cell">{user._count.bookings}</td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-center font-bold text-xs md:text-base hidden md:table-cell">{user._count.favorites}</td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B5D4F] hidden lg:table-cell">
                            {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#2C2416]">Yeni Bron</h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingError('');
                  }}
                  className="text-[#6B5D4F] hover:text-[#2C2416] p-2"
                >
                  <FaTimes className="text-lg md:text-xl" />
                </button>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl text-red-700 text-sm">
                  {bookingError}
                </div>
              )}

              <form onSubmit={handleCreateBooking} className="space-y-3 md:space-y-4">
                {/* User Selection */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    İstifadəçi *
                  </label>
                  <select
                    value={bookingForm.userId}
                    onChange={(e) => setBookingForm({ ...bookingForm, userId: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm md:text-base"
                    required
                  >
                    <option value="">İstifadəçi seçin</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.phone || user.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Selection */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    Ev *
                  </label>
                  <select
                    value={bookingForm.propertyId}
                    onChange={(e) => setBookingForm({ ...bookingForm, propertyId: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm md:text-base"
                    required
                  >
                    <option value="">Ev seçin</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    Giriş tarixi *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkIn}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm md:text-base"
                    required
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    Çıxış tarixi *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkOut}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                    min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm md:text-base"
                    required
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    Qonaq sayı *
                  </label>
                  <input
                    type="number"
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm({ ...bookingForm, guests: parseInt(e.target.value) })}
                    min={1}
                    max={20}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm md:text-base"
                    required
                  />
                </div>

                {/* Total Price */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    Ümumi qiymət (₼) *
                  </label>
                  <input
                    type="number"
                    value={bookingForm.totalPrice}
                    onChange={(e) => setBookingForm({ ...bookingForm, totalPrice: parseFloat(e.target.value) })}
                    min={0}
                    step={0.01}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm md:text-base"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#2C2416] mb-1.5 md:mb-2">
                    Status *
                  </label>
                  <select
                    value={bookingForm.status}
                    onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value as any })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[#E5DDD5] focus:border-[#8B7355] outline-none text-sm md:text-base"
                    required
                  >
                    <option value="PENDING">Gözləyir</option>
                    <option value="CONFIRMED">Təsdiqləndi</option>
                    <option value="CANCELLED">Ləğv edildi</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 md:gap-3 pt-2 md:pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingError('');
                    }}
                    className="flex-1 px-4 md:px-6 py-2.5 md:py-3 border border-[#E5DDD5] text-[#6B5D4F] rounded-lg md:rounded-xl hover:bg-[#FAF8F5] transition-colors text-sm md:text-base"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white rounded-lg md:rounded-xl font-semibold hover:shadow-lg transition-all text-sm md:text-base"
                  >
                    Bron yarat
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
