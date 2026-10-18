import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

/** Published-only reads. The site is statically exported, so everything is fetched at build. */
export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-16',
  useCdn: true,
  perspective: 'published',
})

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Sanity CDN URL for an image value.
 *
 * Pass `height` only when a fixed crop is genuinely wanted: Sanity centre-crops
 * when no hotspot is set, which slices the head off portrait photographs. Source
 * portraits here run from 1.02 to 2.19 (h/w), so for people we request width only
 * and let CSS `object-fit` handle placement.
 */
export function imageUrl(source: unknown, width: number, height?: number): string | undefined {
  if (!source) return undefined
  let b = builder.image(source as never).width(width).auto('format')
  if (height) b = b.height(height).fit('crop')
  else b = b.fit('max')
  return b.url()
}