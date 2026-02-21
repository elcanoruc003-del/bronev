import { FaShieldAlt, FaCheckCircle, FaAward, FaClock } from 'react-icons/fa'

export default function TrustBadges() {
  const badges = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Təhlükəsiz Ödəniş',
      description: '100% qorunan əməliyyatlar',
    },
    {
      icon: <FaCheckCircle className="text-3xl" />,
      title: 'Yoxlanılmış Evlər',
      description: 'Hər ev şəxsən yoxlanılır',
    },
    {
      icon: <FaAward className="text-3xl" />,
      title: 'Premium Xidmət',
      description: '5 ulduzlu müştəri dəstəyi',
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: '24/7 Dəstək',
      description: 'Hər zaman əlçatandır',
    },
  ]

  return (
    <section className="py-16 bg-neutral-50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-display-sm font-display font-bold text-brand-navy mb-4">
            Niyə BronEv?
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Premium xidmət və etibarlılıq bizim prioritetimizdir
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="card-premium p-8 text-center group hover-lift"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-2xl flex items-center justify-center text-white shadow-gold group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">
                {badge.title}
              </h3>
              <p className="text-neutral-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
