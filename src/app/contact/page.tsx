'use client';

import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';
import { FaWhatsapp, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <MobileHeader />
      
      <div className="px-4 py-8 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2C2416] mb-2">Bizimlə Əlaqə</h1>
          <p className="text-[#6B5D4F]">Hər hansı sualınız varsa, bizimlə əlaqə saxlayın</p>
        </div>

        <div className="space-y-4">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                <FaWhatsapp className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2C2416]">WhatsApp</p>
                <p className="text-sm text-[#6B5D4F]">Dərhal cavab alın</p>
              </div>
            </div>
          </a>

          {/* Phone */}
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
            className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B7355] to-[#C19A6B] flex items-center justify-center">
                <FaPhone className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2C2416]">Telefon</p>
                <p className="text-sm text-[#6B5D4F]">{process.env.NEXT_PUBLIC_PHONE_NUMBER}</p>
              </div>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/a_frame_ismayilli/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
                <FaInstagram className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2C2416]">Instagram</p>
                <p className="text-sm text-[#6B5D4F]">@a_frame_ismayilli</p>
              </div>
            </div>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@a_frame_ismayilli"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <SiTiktok className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2C2416]">TikTok</p>
                <p className="text-sm text-[#6B5D4F]">@a_frame_ismayilli</p>
              </div>
            </div>
          </a>

          {/* Location */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B7355] to-[#C19A6B] flex items-center justify-center">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2C2416]">Ünvan</p>
                <p className="text-sm text-[#6B5D4F]">İsmayıllı, Azərbaycan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileFooter />
    </main>
  );
}
