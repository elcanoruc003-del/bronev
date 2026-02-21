import Link from 'next/link'
import { FaPhone, FaWhatsapp } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-100 shadow-sm">
      {/* Top Bar */}
      <div className="bg-brand-navy text-white py-2">
        <div className="section-container">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER || '0777670031'}`}
                className="flex items-center space-x-2 hover:text-brand-gold transition-colors group"
              >
                <FaPhone className="text-xs group-hover:scale-110 transition-transform" />
                <span className="font-medium">{process.env.NEXT_PUBLIC_PHONE_NUMBER || '077 767 00 31'}</span>
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '994777670031'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-brand-gold transition-colors group"
              >
                <FaWhatsapp className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>
            <div className="hidden md:block">
              <span className="text-brand-gold font-semibold">Premium Günlük Kirayə</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="section-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full group-hover:bg-brand-gold/30 transition-all"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-xl flex items-center justify-center shadow-gold">
                <svg className="w-7 h-7 text-brand-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-brand-navy">
                BronEv
              </h1>
              <p className="text-xs text-brand-gold font-semibold tracking-wide">PREMIUM ESTATES</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-neutral-700 hover:text-brand-navy font-medium transition-colors relative group"
            >
              Ana səhifə
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/evler"
              className="text-neutral-700 hover:text-brand-navy font-medium transition-colors relative group"
            >
              Evlər
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#contact"
              className="text-neutral-700 hover:text-brand-navy font-medium transition-colors relative group"
            >
              Əlaqə
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="#contact" className="btn-premium">
              Rezerv Et
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-brand-navy hover:text-brand-gold transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
