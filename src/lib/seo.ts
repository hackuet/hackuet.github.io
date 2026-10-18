import type { Metadata } from 'next'
import type { Club } from '@/data/site'
import { siteUrl } from './site'

export const orgId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`

/** Per-route metadata: unique title and description, canonical URL, and matching social cards. */
export function pageMeta({
  title,
  description,
  path,
  short,
}: {
  title: string
  description: string
  path: string
  short: string
}): Metadata {
  const url = path === '/' ? '/' : `${path}/`
  const fullTitle = path === '/' ? title : `${title} | ${short}, KUET`
  return {
    title: path === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: short,
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

export function organizationLd(club: Club) {
  const knowsAbout = club.keywords.length
    ? club.keywords
    : [
        'FPGA',
        'Verilog',
        'Digital design',
        'GPU computing',
        'RISC-V',
        'Computer architecture',
        'Embedded systems',
      ]
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': orgId,
    name: club.name,
    alternateName: [club.short],
    url: `${siteUrl}/`,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png`, width: 383, height: 286 },
    image: `${siteUrl}/opengraph-image.jpg`,
    description: club.description,
    slogan: club.tagline,
    ...(club.founded ? { foundingDate: String(club.founded) } : {}),
    email: club.email,
    knowsAbout,
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
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'membership enquiries',
      email: club.email,
      availableLanguage: ['en', 'bn'],
    },
  }
}

export function websiteLd(club: Club) {
  return {
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
}

export function JsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}