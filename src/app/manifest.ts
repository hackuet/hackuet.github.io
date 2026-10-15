import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/content'

export const dynamic = 'force-static'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const club = await getSiteSettings()
  return {
    name: club.name,
    short_name: club.short,
    description: club.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1672c4',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
