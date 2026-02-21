import { Metadata } from 'next'

const siteConfig = {
  name: 'BronEv',
  description: 'Azərbaycanın hər yerində günlük kirayə evlər. Premium xidmət və etibarlı əməkdaşlıq.',
  url: 'https://bron-ev.com',
  ogImage: 'https://bron-ev.com/og-image.jpg',
  keywords: [
    'günlük kirayə',
    'kirayə ev',
    'villa kirayə',
    'mənzil kirayə',
    'Bakı kirayə',
    'Qəbələ villa',
    'Şəki ev',
    'daşınmaz əmlak',
    'bron ev',
    'bronev',
  ],
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  noIndex = false,
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  noIndex?: boolean
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description || siteConfig.description
  const metaImage = image || siteConfig.ogImage
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url
  const allKeywords = [...siteConfig.keywords, ...keywords]

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords.join(', '),
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'az_AZ',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    alternates: {
      canonical: metaUrl,
    },
  }
}

export function generatePropertySchema(property: {
  title: string
  description: string
  basePricePerNight: number
  city: string
  district: string
  images: { url: string }[]
  rating?: number
  reviewCount?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    image: property.images.map(img => img.url),
    offers: {
      '@type': 'Offer',
      price: property.basePricePerNight,
      priceCurrency: 'AZN',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    aggregateRating: property.rating ? {
      '@type': 'AggregateRating',
      ratingValue: property.rating,
      reviewCount: property.reviewCount || 0,
    } : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.district,
      addressRegion: property.city,
      addressCountry: 'AZ',
    },
  }
}
