'use client';

import { FaGift, FaWhatsapp, FaFire, FaStar, FaTicketAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#FFF] to-[#F5F1ED]">
      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Sparkling Gift Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl shadow-2xl mb-6 animate-bounce">
            <FaGift className="text-4xl text-white" />
          </div>

          {/* Title with Gradient */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            Aktiv Kompaniyalar
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#6B5D4F] max-w-3xl mx-auto leading-relaxed">
            Eksklüziv fürsətlərdən yararlanın və <span className="font-bold text-[#8B7355]">möhtəşəm evləri</span> qazanmaq şansı əldə edin
          </p>

          {/* Decorative Stars */}
          <div className="flex justify-center gap-2 mt-4">
            <FaStar className="text-yellow-400 text-2xl animate-pulse" />
            <FaStar className="text-yellow-400 text-3xl animate-pulse" style={{ animationDelay: '0.2s' }} />
            <FaStar className="text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="relative max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Campaign Card 1 - "1 Manata Ev" */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            {/* Image Container with Overlay */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/placeholder.jpg"
                alt="Lüks Villa"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                {/* Active Badge */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <FaFire className="text-lg" />
                  <span className="font-bold text-sm">Aktiv</span>
                </div>

                {/* Price Badge */}
                <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-5 py-2.5 rounded-full shadow-2xl font-bold text-sm border-2 border-white/30">
                  <span className="text-lg">1 AZN</span>
                </div>
              </div>

              {/* Floating Ticket Icon */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/40">
                  <FaTicketAlt className="text-xl" />
                  <span className="font-semibold">İştirak haqqı</span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Title */}
              <h3 className="text-2xl font-bold text-[#2C2416] mb-3 leading-tight">
                1 Manata 1 Günlük Kirayə Ev Şansı!
              </h3>

              {/* Description */}
              <p className="text-[#6B5D4F] text-sm leading-relaxed mb-6">
                Şansınızı sınayın! Qeyd olunan tarix üçün seçilmiş evi sadəcə <span className="font-bold text-[#8B7355]">1 AZN-ə</span> qazanmaq şansı əldə edin. Ödənişi edərək çəkilişdə iştirak edin.
              </p>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#6B5D4F]">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                  <span>Çəkiliş tarixi: <span className="font-semibold text-[#2C2416]">15 İyul 2026</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B5D4F]">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                  <span>Mükafat: <span className="font-semibold text-[#2C2416]">1 günlük pulsuz qalma</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B5D4F]">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                  <span>Şərtlər: <span className="font-semibold text-[#2C2416]">Açıq</span></span>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="https://wa.me/994777670031?text=Salam,%20mən%20saytdakı%20%221%20Manata%20Ev%22%20kompaniyasında%20iştirak%20etmək%20istəyirəm"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn block w-full"
              >
                <button className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
                  <FaWhatsapp className="text-2xl group-hover/btn:animate-bounce" />
                  <span className="text-lg">İştirak et</span>
                  <span className="text-2xl">🚀</span>
                </button>
              </a>

              {/* Small Info Text */}
              <p className="text-xs text-center text-[#8B7355] mt-3">
                WhatsApp vasitəsilə bizimlə əlaqə saxlayın
              </p>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/0 via-orange-400/0 to-red-400/0 group-hover:from-yellow-400/10 group-hover:via-orange-400/10 group-hover:to-red-400/10 transition-all duration-500 pointer-events-none"></div>
          </div>

          {/* Placeholder Card 2 - Coming Soon */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[500px] border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
              <FaGift className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Tezliklə</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Yeni möhtəşəm kampaniyalar hazırlanır. Gözləyin! 🎁
            </p>
          </div>

          {/* Placeholder Card 3 - Coming Soon */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[500px] border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
              <FaStar className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Tezliklə</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Daha çox fürsətlər yolda. Saytı izləyin! ⭐
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-900 mb-2">Necə iştirak edim?</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>1.</strong> "İştirak et" düyməsinə klikləyin → <strong>2.</strong> WhatsApp-da bizə mesaj göndərin → 
                <strong> 3.</strong> 1 AZN ödəniş edin → <strong>4.</strong> Çəkiliş tarixini gözləyin və qazanın! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
