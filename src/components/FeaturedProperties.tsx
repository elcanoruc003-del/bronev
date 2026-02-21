'use client'

import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard'
import Link from 'next/link'

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real properties from API
    fetch('/api/properties?limit=4')
      .then(res => res.json())
      .then(data => {
        setProperties(data.properties || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading properties:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-brand-gold/10 rounded-full px-6 py-2 mb-6">
              <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
              <span className="text-brand-gold font-semibold text-sm tracking-wide">YÜKLƏNIR</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-96"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-brand-gold/10 rounded-full px-6 py-2 mb-6">
              <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
              <span className="text-brand-gold font-semibold text-sm tracking-wide">PREMIUM SEÇİM</span>
            </div>
            <h2 className="text-display-md font-display font-bold text-brand-navy mb-4">
              Seçilmiş Premium Evlər
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
              Hələ ki ev əlavə edilməyib. Admin paneldən ev əlavə edin.
            </p>
            <Link href="/admin" className="btn-premium">
              Admin Panelə Get
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/10 rounded-full px-6 py-2 mb-6">
            <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
            <span className="text-brand-gold font-semibold text-sm tracking-wide">PREMIUM SEÇİM</span>
          </div>
          <h2 className="text-display-md font-display font-bold text-brand-navy mb-4">
            Seçilmiş Premium Evlər
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Ən yaxşı və populyar kirayə evlərimiz
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/evler" className="btn-outline">
            Bütün Evlərə Bax
          </Link>
        </div>
      </div>
    </section>
  )
}
