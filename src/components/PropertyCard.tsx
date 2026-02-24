import Image from 'next/image'
import Link from 'next/link'
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaEye, FaStar } from 'react-icons/fa'

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
      <div className="relative h-72 overflow-hidden bg-neutral-100">
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

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-4 badge-premium animate-fade-in">
            <FaStar className="mr-1.5" />
            VIP
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
          <FaHeart className="text-brand-gold text-sm" />
        </button>

        {/* Property Type Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold text-brand-navy shadow-lg">
          {property.type}
        </div>

        {/* Views Counter */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-semibold text-brand-navy shadow-lg">
          <FaEye className="text-brand-gold" />
          <span>{property.views}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link href={`/ev/${property.slug}`}>
          <h3 className="text-xl font-bold text-brand-navy mb-3 line-clamp-1 group-hover:text-brand-gold transition-colors">
            {property.title}
          </h3>
        </Link>
        
        {/* Location */}
        <div className="flex items-center text-neutral-600 mb-4">
          <FaMapMarkerAlt className="text-brand-gold mr-2 flex-shrink-0" />
          <span className="text-sm font-medium line-clamp-1">{property.district}, {property.city}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-neutral-600 mb-6 pb-6 border-b border-neutral-100">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
              <FaRulerCombined className="text-brand-gold" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy">{property.area}m²</div>
              <div className="text-xs text-neutral-500">Sahə</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
              <FaBed className="text-brand-gold" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy">{property.bedrooms}</div>
              <div className="text-xs text-neutral-500">Otaq</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
              <FaBath className="text-brand-gold" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy">{property.bathrooms}</div>
              <div className="text-xs text-neutral-500">Vanna</div>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-brand-navy mb-1">
              {property.weekendPriceMultiplier && property.weekendPriceMultiplier !== 1.0 ? (
                <>
                  {property.pricePerDay}/{Math.round(property.pricePerDay * property.weekendPriceMultiplier)} <span className="text-brand-gold">₼</span>
                </>
              ) : (
                <>
                  {property.pricePerDay} <span className="text-brand-gold">₼</span>
                </>
              )}
            </div>
            <div className="text-sm text-neutral-500 font-medium">günlük</div>
          </div>
          <Link href={`/ev/${property.slug}`} className="btn-secondary text-sm px-6 py-3">
            Ətraflı
          </Link>
        </div>
      </div>
    </div>
  )
}
