import Image from 'next/image'
import Link from 'next/link'
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaEye, FaStar, FaWhatsapp, FaPhone } from 'react-icons/fa'

interface PropertyCardProps {
  property: {
    id: string
    slug: string
    title: string
    pricePerDay: number
    weekendPriceMultiplier?: number
    city: string
    district: string
    type: string
    bedrooms: number
    bathrooms: number
    area: number
    views: number
    featured: boolean
    images: { url: string; alt?: string }[]
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const image = property.images[0]?.url || '/placeholder.jpg'
  
  return (
    <div className="card-premium group overflow-hidden">
      {/* Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden bg-neutral-100">
        <Link href={`/ev/${property.slug}`}>
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges */}
        <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 z-10 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {/* VIP Badge */}
            {property.featured && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[9px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                <FaStar className="text-[8px] md:text-[10px]" />
                <span>VIP</span>
              </div>
            )}
            
            {/* Price Badge */}
            <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[#2C1810] text-[10px] md:text-sm font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg shadow-md">
              {property.weekendPriceMultiplier && property.weekendPriceMultiplier !== 1.0 ? (
                <>
                  <span className="text-[#8B7355]">{property.pricePerDay}</span>
                  <span className="text-[8px] md:text-xs text-[#6B5D4F]">/</span>
                  <span className="text-[#8B7355]">{Math.round(property.pricePerDay * property.weekendPriceMultiplier)}₼</span>
                </>
              ) : (
                <>
                  <span className="text-[#8B7355]">{property.pricePerDay}₼</span>
                  <span className="text-[8px] md:text-xs text-[#6B5D4F]">/gecə</span>
                </>
              )}
            </div>
          </div>

          {/* Property Type Badge */}
          <div className="bg-white/95 backdrop-blur-sm px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-xs font-bold text-brand-navy shadow-md">
            {property.type}
          </div>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 md:top-4 right-3 md:right-4 w-7 h-7 md:w-8 md:h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
          <FaHeart className="text-brand-gold text-xs md:text-sm" />
        </button>

        {/* Views Counter */}
        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex items-center space-x-1 md:space-x-1.5 bg-white/95 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg text-[9px] md:text-xs font-semibold text-brand-navy shadow-lg">
          <FaEye className="text-brand-gold text-[10px] md:text-xs" />
          <span>{property.views}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Title */}
        <Link href={`/ev/${property.slug}`}>
          <h3 className="text-base md:text-xl font-bold text-brand-navy mb-2 md:mb-3 line-clamp-1 group-hover:text-brand-gold transition-colors">
            {property.title}
          </h3>
        </Link>
        
        {/* Location */}
        <div className="flex items-center text-neutral-600 mb-3 md:mb-4">
          <FaMapMarkerAlt className="text-brand-gold mr-2 flex-shrink-0 text-xs md:text-sm" />
          <span className="text-xs md:text-sm font-medium line-clamp-1">{property.district}, {property.city}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-neutral-600 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-neutral-100">
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
              <FaRulerCombined className="text-brand-gold text-xs md:text-sm" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-brand-navy">{property.area}m²</div>
              <div className="text-[9px] md:text-xs text-neutral-500">Sahə</div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
              <FaBed className="text-brand-gold text-xs md:text-sm" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-brand-navy">{property.bedrooms}</div>
              <div className="text-[9px] md:text-xs text-neutral-500">Otaq</div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
              <FaBath className="text-brand-gold text-xs md:text-sm" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-brand-navy">{property.bathrooms}</div>
              <div className="text-[9px] md:text-xs text-neutral-500">Vanna</div>
            </div>
          </div>
        </div>

        {/* Contact Buttons - Compact */}
        <div className="flex items-center gap-2 mb-4">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Salam! ${property.title} haqqında məlumat almaq istəyirəm.`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white text-[10px] md:text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <FaWhatsapp className="text-xs md:text-sm" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 rounded-lg bg-[#8B7355] hover:bg-[#6B5D4F] text-white text-[10px] md:text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <FaPhone className="text-[9px] md:text-xs" />
            <span>Zəng</span>
          </a>
        </div>

        {/* Details Button */}
        <Link href={`/ev/${property.slug}`} className="btn-secondary text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 w-full text-center block">
          Ətraflı Bax
        </Link>
      </div>
    </div>
  )
}
