import type { NextConfig } from 'next'

// Frontend-only: the whole site exports to static HTML in /out.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Dev-only: lets a phone on the LAN load dev assets and the HMR socket.
  // Ignored by `next build`, which statically exports to /out. Update the
  // address if the machine's LAN IP changes.
  allowedDevOrigins: ['192.168.0.114'],
}

export default nextConfig
