'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

export default function MobileHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-500 ease-out
        ${scrolled 
          ? 'glass-effect shadow-premium py-3' 
          : 'bg-transparent py-4'
        }
      `}
    >
      <div className="px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo - Premium Typography */}
          <Link href="/" className="flex items-center group">
            <h1 
              className={`
                font-display font-semibold tracking-tight
                bg-gradient-to-r from-[#8B7355] via-[#A08770] to-[#C19A6B] 
                bg-clip-text text-transparent
                transition-all duration-500
                ${scrolled ? 'text-2xl' : 'text-3xl'}
                group-hover:scale-105 group-active:scale-95
              `}
              style={{
                textShadow: '0 2px 10px rgba(139, 115, 85, 0.1)'
              }}
            >
              A-Frame
            </h1>
            <span className="ml-2 text-xs font-medium text-[#8B7E74] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              İsmayıllı
            </span>
          </Link>
          
          {/* Social Icons - Glass Buttons */}
          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative w-11 h-11 rounded-full 
                bg-gradient-to-br from-[#25D366] to-[#128C7E]
                flex items-center justify-center text-white 
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-110 active:scale-95
                tap-scale
                before:absolute before:inset-0 before:rounded-full
                before:bg-white before:opacity-0 hover:before:opacity-20
                before:transition-opacity before:duration-300
              "
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-xl relative z-10" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/a_frame_ismayilli/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative w-11 h-11 rounded-full 
                bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]
                flex items-center justify-center text-white 
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-110 active:scale-95
                tap-scale
                before:absolute before:inset-0 before:rounded-full
                before:bg-white before:opacity-0 hover:before:opacity-20
                before:transition-opacity before:duration-300
              "
              aria-label="Instagram"
            >
              <FaInstagram className="text-xl relative z-10" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@a_frame_ismayilli"
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative w-11 h-11 rounded-full 
                bg-gradient-to-br from-[#000000] to-[#2C2C2C]
                flex items-center justify-center text-white 
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-110 active:scale-95
                tap-scale
                before:absolute before:inset-0 before:rounded-full
                before:bg-white before:opacity-0 hover:before:opacity-20
                before:transition-opacity before:duration-300
              "
              aria-label="TikTok"
            >
              <SiTiktok className="text-lg relative z-10" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom border with gradient */}
      <div 
        className={`
          absolute bottom-0 left-0 right-0 h-px
          bg-gradient-to-r from-transparent via-[#C19A6B]/30 to-transparent
          transition-opacity duration-500
          ${scrolled ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </header>
  );
}
