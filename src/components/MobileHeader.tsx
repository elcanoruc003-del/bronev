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
          ? 'glass-effect shadow-premium py-2' 
          : 'bg-transparent py-2.5'
        }
      `}
    >
      <div className="px-3 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo - Compact */}
          <Link href="/" className="flex items-center group">
            <h1 
              className={`
                font-display font-bold tracking-tight
                bg-gradient-to-r from-[#8B7355] via-[#A08770] to-[#C19A6B] 
                bg-clip-text text-transparent
                transition-all duration-500
                ${scrolled ? 'text-xl' : 'text-2xl'}
                group-hover:scale-105 group-active:scale-95
              `}
              style={{
                textShadow: '0 2px 10px rgba(139, 115, 85, 0.1)'
              }}
            >
              BronEv
            </h1>
          </Link>
          
          {/* Contact & Social Buttons - Compact */}
          <div className="flex items-center gap-1.5">
            {/* Phone Call - Smaller */}
            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
              className="
                relative w-8 h-8 rounded-full 
                bg-gradient-to-br from-[#4CAF50] to-[#388E3C]
                flex items-center justify-center text-white 
                shadow-md hover:shadow-lg
                transition-all duration-300
                hover:scale-110 active:scale-95
                tap-scale
              "
              aria-label="Zəng et"
            >
              <svg className="w-3.5 h-3.5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>

            {/* WhatsApp - Smaller */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative w-8 h-8 rounded-full 
                bg-gradient-to-br from-[#25D366] to-[#128C7E]
                flex items-center justify-center text-white 
                shadow-md hover:shadow-lg
                transition-all duration-300
                hover:scale-110 active:scale-95
                tap-scale
              "
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-base relative z-10" />
            </a>

            {/* Instagram - Smaller */}
            <a
              href="https://www.instagram.com/bronev.az/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative w-8 h-8 rounded-full 
                bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]
                flex items-center justify-center text-white 
                shadow-md hover:shadow-lg
                transition-all duration-300
                hover:scale-110 active:scale-95
                tap-scale
              "
              aria-label="Instagram"
            >
              <FaInstagram className="text-base relative z-10" />
            </a>

            {/* TikTok - Smaller */}
            <a
              href="https://www.tiktok.com/@bronev.az"
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative w-8 h-8 rounded-full 
                bg-gradient-to-br from-[#000000] to-[#2C2C2C]
                flex items-center justify-center text-white 
                shadow-md hover:shadow-lg
                transition-all duration-300
                hover:scale-110 active:scale-95
                tap-scale
              "
              aria-label="TikTok"
            >
              <SiTiktok className="text-sm relative z-10" />
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
