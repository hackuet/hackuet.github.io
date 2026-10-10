import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LazyBackground } from '@/components/LazyBackground'
import { club } from '@/data/club'
import { JsonLdScript, organizationLd, websiteLd } from '@/lib/seo'
import { siteUrl } from '@/lib/site'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/components.css'
import '@/styles/pages.css'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--ff-display', display: 'swap' })
const body = Instrument_Sans({ subsets: ['latin'], variable: '--ff-body', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--ff-mono', display: 'swap', preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${club.short}: ${club.name}`,
    template: `%s | ${club.short}, KUET`,
  },
  description: club.description,
  applicationName: club.short,
  authors: [{ name: club.name, url: siteUrl }],
  creator: club.name,
  publisher: club.name,
  category: 'education',
  keywords: [
    'HACK KUET',
    'Hardware Acceleration Club of KUET',
    'KUET clubs',
    'KUET hardware club',
    'FPGA club Bangladesh',
    'Verilog workshop KUET',
    'GPU computing',
    'RISC-V',
    'digital design',
    'Khulna University of Engineering and Technology',
  ],
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        {/* Marks the document as scripted before first paint, so entrance animations
            start hidden only when there is JavaScript to reveal them. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <LazyBackground />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(organizationLd)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(websiteLd)} />
      </body>
    </html>
  )
}
