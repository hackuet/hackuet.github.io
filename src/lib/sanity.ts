import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from './types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity configuration: set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET. ' +
      'Locally: copy .env.example to .env.local. In CI: repository Settings → Secrets and variables → ' +
      'Actions → Variables. See README.md.',
  )
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-01',
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(client)

/** CDN URL for a Sanity image, format-optimised; undefined when no image is set. */
export function imageUrl(image: SanityImage | undefined, width: number): string | undefined {
  if (!image?.asset?._ref) return undefined
  return builder.image(image).width(width).auto('format').quality(80).url()
}
