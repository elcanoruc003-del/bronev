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
    <footer className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-[#E5DDD5]/50 safe-area-bottom">
      <nav className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-1 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-[#8B7355] scale-105'
                  : 'text-[#6B5D4F] hover:text-[#8B7355]'
              }`}
            >
              <div className={`relative ${isActive ? 'animate-bounce' : ''}`}>
                <Icon className={`text-xl transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B7355]"></div>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${
                isActive ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
