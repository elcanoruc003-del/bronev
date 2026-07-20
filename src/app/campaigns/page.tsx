'use client';

import { useState, useEffect } from 'react';
import { FaGift, FaStar, FaFire, FaTicketAlt, FaSpinner, FaCalendarAlt } from 'react-icons/fa';
import { getActiveCampaigns } from '@/app/actions/campaigns';
import CampaignCard from '@/components/CampaignCard';
import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const result = await getActiveCampaigns();
      if (result.success && result.campaigns) {
        setCampaigns(result.campaigns);
      }
    } catch (error) {
      console.error('Load campaigns error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#FFF] to-[#F5F1ED]">
      <MobileHeader />

      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Sparkling Gift Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl shadow-2xl mb-6 animate-bounce">
            <FaGift className="text-4xl text-white" />
          </div>

          {/* Title with Gradient */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            Aktiv Kampaniyalar
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#6B5D4F] max-w-3xl mx-auto leading-relaxed">
            Eksklüziv fürsətlərdən yararlanın və <span className="font-bold text-[#8B7355]">möhtəşəm mükafatlar</span> qazanmaq şansı əldə edin
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
      <div className="relative max-w-7xl mx-auto px-4 pb-16 pt-24 md:pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-[#8B7355]" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20">
            <FaCalendarAlt className="text-6xl text-[#C19A6B] mx-auto mb-4" />
            <p className="text-xl text-[#6B5D4F]">Hal-hazırda aktiv kampaniya yoxdur</p>
            <p className="text-sm text-[#8B7355] mt-2">Tezliklə yeni kampaniyalar əlavə ediləcək</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}

            {/* Placeholder Cards for Coming Soon */}
            {campaigns.length < 3 && (
              <>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[500px] border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
                    <FaGift className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">Tezliklə</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Yeni möhtəşəm kampaniyalar hazırlanır. Gözləyin! 🎁
                  </p>
                </div>

                {campaigns.length < 2 && (
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[500px] border-2 border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
                      <FaStar className="text-4xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">Tezliklə</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Daha çox fürsətlər yolda. Saytı izləyin! ⭐
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Info Banner */}
      <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-12">
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
                <strong>1.</strong> Kampaniya kartına keçin → <strong>2.</strong> "İştirak et" düyməsinə basın → 
                <strong> 3.</strong> Qeydiyyatdan keçin (və ya giriş edin) → <strong>4.</strong> Məlumatları doldurun və çek yükləyin → 
                <strong> 5.</strong> Təsdiq gözləyin və qazanın! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>

      <MobileFooter />
    </div>
  );
}
