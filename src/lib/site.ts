// NEXT_PUBLIC_SITE_URL can override the deployed origin for custom preview environments,
// defaulting to the production GitHub Pages domain.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hackuet.github.io').replace(/\/$/, '')
