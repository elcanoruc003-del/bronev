'use client';

import { useState, useEffect } from 'react';
import MobileHeader from '@/components/MobileHeader';
import SearchFilters from '@/components/SearchFilters';
import MobilePropertyList from '@/components/MobilePropertyList';
import MobileFooter from '@/components/MobileFooter';

export default function Page() {
  const [filters, setFilters] = useState({});
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Yoxla ki, istifadəçi əvvəllər modalı bağlayıb ya yox
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F5F1ED] to-[#F0EBE6]">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto animate-slideUp overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    Bron-Evə xoş gəlmisiniz!
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-300"
                  aria-label="Bağla"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6">
              <div className="space-y-4">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Ev qiymətləri <span className="font-semibold text-blue-600">qonaq sayından</span> və <span className="font-semibold text-blue-600">gün sayından</span> asılı olaraq dəyişir.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Sayta yerləşdirilən qiymətlər <span className="font-semibold">standart</span> olaraq nəzərdə tutulub. Bayram günləri, tətil günləri, şənbə günləri, tək günlər və s. qiymətlər tamamilə fərqlidir.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      Dəqiq qiymət öyrənmək üçün:
                    </p>
                    <p className="text-sm text-gray-700">
                      Rezerv düyməsinə klik edib bizə mesaj göndərərək və ya nömrəmizlə əlaqə saxlayaraq ətraflı məlumat əldə edə bilərsiniz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCloseModal}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
              >
                Başa düşdüm, evlərə bax
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <MobileHeader />
      
      {/* Hero & Filters Section with Background Image */}
      <div className="relative pt-16 pb-2.5 px-2.5 md:px-3 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop')`,
            }}
          />
          {/* Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/95 via-[#FAF8F5]/90 to-[#FAF8F5]/95"></div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#8B7355] blur-3xl"></div>
          <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-[#C19A6B] blur-3xl"></div>
          <div className="absolute bottom-10 left-1/2 w-36 h-36 rounded-full bg-[#8B7355] blur-3xl"></div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B7355' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Hero Content - Ultra Compact for Mobile */}
        <div className="relative z-10 max-w-7xl mx-auto text-center mb-2 md:mb-3">
          <h1 
            className="text-base md:text-2xl font-bold text-[#2C2416] mb-0"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            <span className="bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent">
              Günlük Kirayə Evlər
            </span>
          </h1>
          <p className="text-[9px] md:text-xs text-[#6B5D4F] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Premium villa və mənzillər
          </p>
        </div>

        {/* Search Filters - Optimal Width */}
        <div className="relative z-10 max-w-md md:max-w-2xl mx-auto">
          <SearchFilters onSearch={handleSearch} />
        </div>
      </div>

      {/* Properties List */}
      <MobilePropertyList filters={filters} />
      
      {/* Footer */}
      <MobileFooter />
    </main>
  );
}
