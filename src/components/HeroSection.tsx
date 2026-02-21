'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaSearch, FaMapMarkerAlt, FaHome, FaCalendarAlt } from 'react-icons/fa'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-navy">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&q=90"
          alt="Luxury Property"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/60 to-brand-navy/90"></div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 via-transparent to-brand-gold/5 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 section-container py-32 md:py-40">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
            <span className="text-white/90 text-sm font-semibold tracking-wide">PREMIUM GÜNLÜK KİRAYƏ</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-display-lg md:text-display-xl font-display font-bold text-white mb-6 animate-slide-up">
            Azərbaycanın Ən Lüks
            <span className="block text-gradient-gold mt-2">Kirayə Evləri</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Premium villa və mənzillər. Etibarlı xidmət, unudulmaz təcrübə.
            <span className="block mt-2 text-brand-gold font-semibold">Bakı, Qəbələ, Şəki və daha çox...</span>
          </p>

          {/* Premium Search Box */}
          <div className="max-w-4xl mx-auto animate-scale-in">
            <div className="bg-white rounded-2xl shadow-premium-lg p-3">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Location Input */}
                <div className="flex-1 relative">
                  <FaMapMarkerAlt className="absolute left-5 top-1/2 transform -translate-y-1/2 text-brand-gold text-lg" />
                  <input
                    type="text"
                    placeholder="Şəhər və ya rayon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-transparent focus:border-brand-gold focus:outline-none transition-all text-brand-navy placeholder:text-neutral-400 font-medium"
                  />
                </div>

                {/* Property Type */}
                <div className="relative">
                  <FaHome className="absolute left-5 top-1/2 transform -translate-y-1/2 text-brand-gold text-lg" />
                  <select className="w-full md:w-48 pl-14 pr-4 py-4 rounded-xl border-2 border-transparent focus:border-brand-gold focus:outline-none transition-all text-brand-navy font-medium appearance-none cursor-pointer">
                    <option>Hamısı</option>
                    <option>Villa</option>
                    <option>Mənzil</option>
                    <option>Penthouse</option>
                  </select>
                </div>

                {/* Search Button */}
                <button className="btn-premium whitespace-nowrap">
                  <FaSearch className="mr-2" />
                  Axtar
                </button>
              </div>
            </div>

            {/* Quick Stats - Removed fake data */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-white">
              <div className="text-center">
                <div className="text-sm text-white/70 font-medium">Premium Xidmət</div>
              </div>
              <div className="w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-sm text-white/70 font-medium">Etibarlı Əməkdaşlıq</div>
              </div>
              <div className="w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-sm text-white/70 font-medium">24/7 Dəstək</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-brand-gold rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
