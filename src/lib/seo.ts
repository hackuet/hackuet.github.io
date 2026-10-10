import type { Metadata } from 'next'
import { club } from '@/data/club'
import { siteUrl } from './site'

export const orgId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`

/** Per-route metadata: unique title and description, canonical URL, and matching social cards. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = path === '/' ? '/' : `${path}/`
  const fullTitle = path === '/' ? title : `${title} | ${club.short}, KUET`
  return {
    title: path === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: club.name,
      locale: 'en_BD',
      title: fullTitle,
      description,
      url,
    },
    twitter: { card: 'summary', title: fullTitle, description },
  }
}

export function breadcrumbLd(path: string, label: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: label, item: `${siteUrl}${path}/` },
    ],
  }
}

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'EducationalOrganization'],
  '@id': orgId,
  name: club.name,
  alternateName: [club.short, 'HACK KUET'],
  url: `${siteUrl}/`,
  logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png`, width: 383, height: 286 },
  image: `${siteUrl}/opengraph-image.jpg`,
  description: club.description,
  slogan: club.tagline,
  foundingDate: String(club.founded),
  email: club.email,
  knowsAbout: ['FPGA', 'Verilog', 'Digital design', 'GPU computing', 'RISC-V', 'Computer architecture', 'Embedded systems'],
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: club.university,
    alternateName: 'KUET',
    url: 'https://www.kuet.ac.bd/',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: club.room,
    addressLocality: 'Khulna',
    postalCode: '9203',
    addressCountry: 'BD',
  },
  contactPoint: { '@type': 'ContactPoint', contactType: 'membership enquiries', email: club.email, availableLanguage: ['en', 'bn'] },
}

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': websiteId,
  url: `${siteUrl}/`,
  name: club.name,
  alternateName: club.short,
  description: club.description,
  inLanguage: 'en',
  publisher: { '@id': orgId },
}

export function JsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}
