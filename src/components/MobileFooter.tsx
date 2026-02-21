'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaHeart, FaUser, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function MobileFooter() {
  const pathname = usePathname();
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowWhatsApp(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { icon: FaHome, label: 'Ana səhifə', href: '/' },
    { icon: FaHeart, label: 'Sevimlilər', href: '/favorites' },
    { icon: FaPhone, label: 'Əlaqə', href: '/contact' },
    { icon: FaUser, label: 'Profil', href: '/profile' },
  ];

  return (
    <>
      {/* Sticky WhatsApp Button - Appears on scroll */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          fixed bottom-24 right-4 z-40
          w-14 h-14 rounded-full
          bg-gradient-to-br from-[#25D366] to-[#20BA5A]
          flex items-center justify-center
          text-white text-2xl
          shadow-premium-lg hover:shadow-xl
          transition-all duration-500
          hover:scale-110 active:scale-95
          pulse-soft
          ${showWhatsApp ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
        `}
        aria-label="WhatsApp ilə əlaqə"
      >
        <FaWhatsapp />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-20" />
      </a>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-[#E5DDD5]/30 safe-area-bottom">
        <nav className="flex items-center justify-around px-2 py-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-1.5
                  px-4 py-2 rounded-2xl
                  transition-all duration-300
                  tap-scale
                  ${isActive
                    ? 'text-[#8B7355] scale-105'
                    : 'text-[#8B7E74] hover:text-[#8B7355] active:scale-95'
                  }
                `}
              >
                <div className="relative">
                  <Icon className={`
                    text-xl transition-all duration-300
                    ${isActive ? 'scale-110' : ''}
                  `} />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B7355]" />
                      <div className="absolute inset-0 rounded-full bg-[#8B7355]/10 blur-md" />
                    </>
                  )}
                </div>
                
                <span className={`
                  text-[10px] font-medium transition-all duration-300
                  ${isActive ? 'font-semibold' : ''}
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom safe area gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C19A6B]/20 to-transparent" />
      </footer>
    </>
  );
}
