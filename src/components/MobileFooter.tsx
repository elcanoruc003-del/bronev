'use client';

import Link from 'next/link';
import { FaHome, FaHeart, FaUser, FaPhone } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function MobileFooter() {
  const pathname = usePathname();

  const navItems = [
    { icon: FaHome, label: 'Ana səhifə', href: '/' },
    { icon: FaHeart, label: 'Sevimlilər', href: '/favorites' },
    { icon: FaPhone, label: 'Əlaqə', href: '/contact' },
    { icon: FaUser, label: 'Profil', href: '/profile' },
  ];

  return (
    <>
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
