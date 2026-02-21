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
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-lg transition ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`text-lg ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
