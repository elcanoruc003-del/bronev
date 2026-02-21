'use client';

import Link from 'next/link';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="px-4 py-3">
        {/* Logo & Social Icons */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">BronEv</h1>
          </Link>
          
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition"
            >
              <FaWhatsapp className="text-lg" />
            </a>
            <a
              href="https://instagram.com/bronev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white hover:opacity-90 transition"
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              href="https://tiktok.com/@bronev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition"
            >
              <SiTiktok className="text-base" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
