import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa'

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <div className="mb-12">
            <h2 className="text-display-md font-display font-bold text-white mb-4">
              Bizimlə Əlaqə
            </h2>
            <p className="text-xl text-white/80">
              Premium evlərimizi rezerv etmək üçün bizimlə əlaqə saxlayın
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Phone */}
            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER || '0777670031'}`}
              className="glass-effect p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 group hover-lift"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-gold rounded-2xl flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                <FaPhone className="text-2xl text-brand-navy" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Zəng Edin</h3>
              <p className="text-brand-gold font-semibold text-lg">
                {process.env.NEXT_PUBLIC_PHONE_NUMBER || '077 767 00 31'}
              </p>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '994777670031'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-effect p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 group hover-lift"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FaWhatsapp className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
              <p className="text-brand-gold font-semibold text-lg">
                Mesaj Göndərin
              </p>
            </a>

            {/* Email */}
            <a
              href="mailto:info@bron-ev.com"
              className="glass-effect p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 group hover-lift"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-gold rounded-2xl flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                <FaEnvelope className="text-2xl text-brand-navy" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <p className="text-brand-gold font-semibold text-lg">
                info@bron-ev.com
              </p>
            </a>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-white/70 mb-6">
              24/7 müştəri dəstəyi. Hər zaman sizin xidmətinizdəyik.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '994777670031'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center space-x-2"
            >
              <FaWhatsapp className="text-xl" />
              <span>İndi Rezerv Et</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
