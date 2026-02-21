import Link from 'next/link'
import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy text-white py-16 border-t border-brand-navy-light">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-xl flex items-center justify-center shadow-gold">
                <svg className="w-7 h-7 text-brand-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div>
                <span className="text-2xl font-display font-bold">BronEv</span>
                <p className="text-xs text-brand-gold font-semibold tracking-wide">PREMIUM ESTATES</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Azərbaycanın hər yerində günlük kirayə evlər. Premium xidmət və etibarlı əməkdaşlıq.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg text-brand-gold">Keçidlər</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-gold transition-colors">
                  Ana səhifə
                </Link>
              </li>
              <li>
                <Link href="/evler" className="hover:text-brand-gold transition-colors">
                  Evlər
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-brand-gold transition-colors">
                  Əlaqə
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-gold transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-bold mb-6 text-lg text-brand-gold">Şəhərlər</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li>
                <Link href="/evler?city=Bakı" className="hover:text-brand-gold transition-colors">
                  Bakı
                </Link>
              </li>
              <li>
                <Link href="/evler?city=Qəbələ" className="hover:text-brand-gold transition-colors">
                  Qəbələ
                </Link>
              </li>
              <li>
                <Link href="/evler?city=Şəki" className="hover:text-brand-gold transition-colors">
                  Şəki
                </Link>
              </li>
              <li>
                <Link href="/evler?city=Quba" className="hover:text-brand-gold transition-colors">
                  Quba
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-lg text-brand-gold">Əlaqə</h4>
            <ul className="space-y-4 text-white/70 text-sm">
              <li className="flex items-center space-x-3">
                <FaPhone className="text-brand-gold flex-shrink-0" />
                <span>{process.env.NEXT_PUBLIC_PHONE_NUMBER || '077 767 00 31'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaWhatsapp className="text-brand-gold flex-shrink-0" />
                <span>WhatsApp</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-brand-gold flex-shrink-0" />
                <span>info@bron-ev.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-brand-gold flex-shrink-0" />
                <span>Bakı, Azərbaycan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-premium mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>&copy; {currentYear} BronEv. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">
              Məxfilik
            </Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">
              Şərtlər
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
