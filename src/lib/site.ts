// Set NEXT_PUBLIC_SITE_URL to the deployed origin so canonical URLs, the sitemap
// and social previews point at the real domain.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
