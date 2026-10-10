import type { NextConfig } from 'next'

// Frontend-only: the whole site exports to static HTML in /out.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
