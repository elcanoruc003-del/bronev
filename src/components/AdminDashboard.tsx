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
import type { DashboardMetrics } from '@/types/property';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'bookings' | 'settings'>('dashboard');
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [properties, setProperties] = useState<any[]>([]);

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
        const metricsResult = await getDashboardMetrics();
        if (metricsResult.success && metricsResult.data) {
          setMetrics(metricsResult.data);
        }
      } else if (activeTab === 'properties') {
        const propertiesResult = await getAdminProperties();
        if (propertiesResult.success && propertiesResult.data) {
          setProperties(propertiesResult.data);
        }
      } else if (activeTab === 'bookings') {
        const bookingsResult = await getAdminBookings();
        if (bookingsResult.success && bookingsResult.data) {
          // Handle bookings data
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-brand-gold" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-brand-gold to-brand-gold-dark w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-gold">
              <FaHome className="text-5xl text-brand-navy" />
            </div>
            <h1 className="text-4xl font-bold text-brand-navy mb-2">Admin Panel</h1>
            <p className="text-neutral-600">BronEv Enterprise İdarəetmə</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Email</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@bronev.com" 
                className="input-premium"
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Parol</label>
              <input 
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••" 
                className="input-premium"
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-premium w-full flex items-center justify-center"
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

            <div className="text-center text-sm text-neutral-500 mt-4">
              Demo: admin@bronev.com / admin123
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 z-50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-br from-brand-gold to-brand-gold-dark p-3 rounded-xl">
              <FaHome className="text-2xl text-brand-navy" />
            </div>
            <div>
              <h2 className="font-bold text-brand-navy">BronEv</h2>
              <p className="text-xs text-neutral-500">Enterprise</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'dashboard'
                  ? 'bg-brand-gold text-brand-navy font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <FaChartLine />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'properties'
                  ? 'bg-brand-gold text-brand-navy font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <FaHome />
              <span>Evlər</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'bookings'
                  ? 'bg-brand-gold text-brand-navy font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <FaCalendarAlt />
              <span>Bronlar</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-brand-gold text-brand-navy font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <FaCog />
              <span>Parametrlər</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-brand-navy text-sm">{currentUser?.name}</p>
              <p className="text-xs text-neutral-500">{currentUser?.email}</p>
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
            <h1 className="text-3xl font-bold text-brand-navy mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-premium p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-semibold mb-1">Cəmi Evlər</p>
                    <p className="text-3xl font-bold text-brand-navy">{metrics.totalProperties}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaHome />
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-semibold mb-1">Aktiv</p>
                    <p className="text-3xl font-bold text-brand-navy">{metrics.activeProperties}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaCheckCircle />
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-semibold mb-1">Bronlar</p>
                    <p className="text-3xl font-bold text-brand-navy">{metrics.totalBookings}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaCalendarAlt />
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-semibold mb-1">Gözləyən</p>
                    <p className="text-3xl font-bold text-brand-navy">{metrics.pendingBookings}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white text-2xl">
                    <FaSpinner />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="card-premium p-6">
                <p className="text-neutral-600 text-sm font-semibold mb-1">Ümumi Gəlir</p>
                <p className="text-4xl font-bold text-brand-navy">{metrics.totalRevenue.toLocaleString()} ₼</p>
              </div>
              <div className="card-premium p-6">
                <p className="text-neutral-600 text-sm font-semibold mb-1">Aylıq Gəlir</p>
                <p className="text-4xl font-bold text-brand-navy">{metrics.monthlyRevenue.toLocaleString()} ₼</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-brand-navy">Evlər</h1>
              <button className="btn-premium">+ Yeni Ev</button>
            </div>

            <div className="card-premium overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Ev</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Qiymət</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Baxış</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-brand-navy">{property.title}</p>
                        <p className="text-sm text-neutral-500">{property.city}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">{property.basePricePerNight} ₼</td>
                      <td className="px-6 py-4">
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(property.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
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
                            className={`p-2 rounded ${property.featured ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100'}`}
                          >
                            <FaStar />
                          </button>
                          <button className="p-2 bg-blue-50 text-blue-600 rounded">
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="p-2 bg-red-50 text-red-600 rounded"
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
            <h1 className="text-3xl font-bold text-brand-navy mb-8">Bronlar</h1>
            <div className="card-premium p-6">
              <p className="text-neutral-600">Bronlar yüklənir...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold text-brand-navy mb-8">Parametrlər</h1>
            <div className="card-premium p-6">
              <p className="text-neutral-600">Parametrlər bölməsi hazırlanır...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
