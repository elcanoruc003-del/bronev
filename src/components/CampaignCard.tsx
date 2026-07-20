'use client';

import { useState } from 'react';
import { FaFire, FaTicketAlt, FaCalendarAlt, FaUsers, FaClock } from 'react-icons/fa';
import CampaignParticipationModal from './CampaignParticipationModal';
import Image from 'next/image';

interface CampaignCardProps {
  campaign: any;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Məlum deyil';
    return new Date(date).toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const daysUntilDraw = campaign.drawDate
    ? Math.ceil((new Date(campaign.drawDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Image Container with Overlay */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
          {/* Campaign Image */}
          {campaign.featuredImage ? (
            <Image
              src={campaign.featuredImage}
              alt={campaign.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : campaign.properties?.property_images?.[0] ? (
            <Image
              src={campaign.properties.property_images[0].url}
              alt={campaign.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <>
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
              </div>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <span className="text-6xl">🏡</span>
                </div>
              </div>
            </>
          )}
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

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
              <span className="text-lg">{campaign.participationFee / 100} AZN</span>
            </div>
          </div>

          {/* Participants Count */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/40">
              <FaUsers className="text-xl" />
              <span className="font-semibold">{campaign._count?.participants || 0} iştirakçı</span>
            </div>
          </div>

          {/* Days Until Draw */}
          {daysUntilDraw !== null && daysUntilDraw > 0 && (
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-2 bg-blue-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/40">
                <FaClock className="text-lg" />
                <span className="font-semibold">{daysUntilDraw} gün</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-2xl font-bold text-[#2C2416] mb-3 leading-tight line-clamp-2">
            {campaign.title}
          </h3>

          {/* Description */}
          <p className="text-[#6B5D4F] text-sm leading-relaxed mb-6 line-clamp-3">
            {campaign.description}
          </p>

          {/* Features List */}
          <div className="space-y-2 mb-6">
            {campaign.drawDate && (
              <div className="flex items-center gap-2 text-sm text-[#6B5D4F]">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                <span>Çəkiliş: <span className="font-semibold text-[#2C2416]">{formatDate(campaign.drawDate)}</span></span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-[#6B5D4F]">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <span>Mükafat: <span className="font-semibold text-[#2C2416]">{campaign.prizeDescription}</span></span>
            </div>
            {campaign.maxParticipants && (
              <div className="flex items-center gap-2 text-sm text-[#6B5D4F]">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                <span>Limit: <span className="font-semibold text-[#2C2416]">{campaign.maxParticipants} nəfər</span></span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setShowModal(true)}
            className="group/btn block w-full"
          >
            <div className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
              <FaTicketAlt className="text-2xl group-hover/btn:animate-bounce" />
              <span className="text-lg">İştirak et</span>
              <span className="text-2xl">🚀</span>
            </div>
          </button>

          {/* Small Info Text */}
          <p className="text-xs text-center text-[#8B7355] mt-3">
            Qeydiyyatdan keçin və iştirak edin
          </p>
        </div>

        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/0 via-orange-400/0 to-red-400/0 group-hover:from-yellow-400/10 group-hover:via-orange-400/10 group-hover:to-red-400/10 transition-all duration-500 pointer-events-none"></div>
      </div>

      {/* Participation Modal */}
      {showModal && (
        <CampaignParticipationModal
          campaign={campaign}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
