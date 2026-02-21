'use client';

import Link from 'next/link';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-[#E5DDD5]/50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B7355] to-[#C19A6B] bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
              A-Frame
            </h1>
          </Link>
          
          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-lg" />
            </a>
            <a
              href="https://www.instagram.com/a_frame_ismayilli/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              href="https://www.tiktok.com/@a_frame_ismayilli"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="TikTok"
            >
              <SiTiktok className="text-base" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
