import type { MetadataRoute } from 'next'
import { routeSections } from '@/lib/sections'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/register/`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...routeSections().map((item) => ({
      url: `${siteUrl}${item.href}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
