'use client'

import { useState, useEffect } from 'react'
import { FaHome, FaPlus, FaSignOutAlt, FaChartLine } from 'react-icons/fa'

interface Property {
  id: number
  title: string
  pricePerDay: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  available: boolean
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  // Load properties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bronev_properties')
    if (saved) {
      setProperties(JSON.parse(saved))
    }
  }, [])

  // Save properties to localStorage
  const saveProperties = (newProperties: Property[]) => {
    setProperties(newProperties)
    localStorage.setItem('bronev_properties', JSON.stringify(newProperties))
  }

  const handleAddProperty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newProperty: Property = {
      id: Date.now(),
      title: formData.get('title') as string,
      pricePerDay: Number(formData.get('pricePerDay')),
      location: formData.get('location') as string,
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms')),
      area: Number(formData.get('area')),
      type: formData.get('type') as string,
      available: true,
    }

    saveProperties([...properties, newProperty])
    setShowAddForm(false)
    e.currentTarget.reset()
    alert('Ev uğurla əlavə edildi!')
  }

  const handleDelete = (id: number) => {
    if (confirm('Bu evi silmək istədiyinizdən əminsiniz?')) {
      saveProperties(properties.filter(p => p.id !== id))
    }
  }

  const handleToggleAvailability = (id: number) => {
    saveProperties(properties.map(p => 
      p.id === id ? { ...p, available: !p.available } : p
    ))
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
            <p className="text-neutral-600">BronEv İdarəetmə Sistemi</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">İstifadəçi Adı</label>
              <input 
                type="text" 
                placeholder="admin" 
                className="input-premium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Parol</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-premium"
                required
              />
            </div>
            <button type="submit" className="btn-premium w-full">
              Daxil Ol
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-brand-gold to-brand-gold-dark p-3 rounded-xl shadow-gold">
                <FaHome className="text-2xl text-brand-navy" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-navy">BronEv Admin</h1>
                <p className="text-sm text-neutral-600">İdarəetmə Paneli</p>
              </div>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center space-x-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl hover:bg-red-100 transition-all duration-300 font-semibold"
            >
              <FaSignOutAlt />
              <span>Çıxış</span>
            </button>
          </div>
        </div>
      </header>

      <div className="section-container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-semibold mb-1">Cəmi Evlər</p>
                <p className="text-4xl font-bold text-brand-navy">{properties.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white">
                <FaHome className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-semibold mb-1">Mövcud</p>
                <p className="text-4xl font-bold text-brand-navy">{properties.filter(p => p.available).length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white">
                <FaChartLine className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-semibold mb-1">Bron Olunub</p>
                <p className="text-4xl font-bold text-brand-navy">{properties.filter(p => !p.available).length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white">
                <FaChartLine className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Property Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-premium"
          >
            <FaPlus className="mr-2" />
            Yeni Ev Əlavə Et
          </button>
        </div>

        {/* Add Property Form */}
        {showAddForm && (
          <div className="card-premium p-8 mb-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Yeni Ev Əlavə Et</h3>
            <form onSubmit={handleAddProperty} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Başlıq</label>
                  <input name="title" type="text" placeholder="Məs: Lüks Villa Qəbələdə" className="input-premium" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Günlük Qiymət (₼)</label>
                  <input name="pricePerDay" type="number" placeholder="150" className="input-premium" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Yer</label>
                  <input name="location" type="text" placeholder="Qəbələ, Şəki, Bakı" className="input-premium" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Tip</label>
                  <select name="type" className="input-premium" required>
                    <option value="Villa">Villa</option>
                    <option value="Mənzil">Mənzil</option>
                    <option value="Ev">Ev</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Sahə (m²)</label>
                  <input name="area" type="number" placeholder="250" className="input-premium" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Otaq Sayı</label>
                  <input name="bedrooms" type="number" placeholder="4" className="input-premium" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Vanna Sayı</label>
                  <input name="bathrooms" type="number" placeholder="2" className="input-premium" required />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button type="submit" className="btn-premium">
                  Yadda Saxla
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-outline"
                >
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Properties Table */}
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Başlıq</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Qiymət</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Yer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Tip</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-700">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      Hələ ki ev əlavə edilməyib. Yuxarıdakı düyməni basaraq ev əlavə edin.
                    </td>
                  </tr>
                ) : (
                  properties.map((property) => (
                    <tr key={property.id} className="hover:bg-neutral-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-brand-navy">{property.title}</p>
                        <p className="text-sm text-neutral-500">{property.area}m² • {property.bedrooms} otaq</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-brand-navy">{property.pricePerDay} ₼/gün</p>
                      </td>
                      <td className="px-6 py-4 text-neutral-700">{property.location}</td>
                      <td className="px-6 py-4">
                        <span className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-lg text-sm font-semibold">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleAvailability(property.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                            property.available 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {property.available ? 'Mövcud' : 'Bron Olunub'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-semibold"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
