import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bron-ev.com';

  const staticRoutes: MetadataRoute.Sitemap = [
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
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const properties = await prisma.properties.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
      url: `${baseUrl}/properties/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...propertyRoutes];
  } catch {
    // If DB is unavailable during build, return static routes only
    return staticRoutes;
  }
}
