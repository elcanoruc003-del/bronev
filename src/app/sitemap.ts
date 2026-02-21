import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bron-ev.com'

  // Database olmadan da işləyir
  let propertyUrls: MetadataRoute.Sitemap = []
  
  try {
    // Database varsa, dynamic sitemap
    const { prisma } = await import('@/lib/prisma')
    const properties = await prisma.property.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    })

    propertyUrls = properties.map((property) => ({
      url: `${baseUrl}/ev/${property.slug}`,
      lastModified: property.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch (error) {
    // Database yoxdursa, static sitemap
    console.log('Database not configured, using static sitemap')
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/evler`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...propertyUrls,
  ]
}
