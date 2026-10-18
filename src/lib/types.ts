// Pure content types shared by server fetchers, client components, and the
// registration logic. Nothing here may import Sanity — client bundles depend on it.
import type { Hue } from '@/components/DieArt'

export type { Hue }

export type SiteSettings = {
  short: string
  name: string
  university: string
  tagline: string
  description: string
  founded?: number
  email: string
  room: string
  address: string
  mapUrl: string
  meets: string
  intake: string
  intakeCloses: string
  keywords: string[]
}

export type Slide = {
  id: string
  label: string
  eyebrow: string
  title: string
  body: string
  figure: string
  seed: number
  hue: Hue
  image?: string
}

export type StoryItem = { title: string; body: string }
export type Milestone = { year: string; title: string; body: string }

export type Story = {
  history: { title: string; lede: string; milestones: Milestone[] }
  mission: { statement: string; items: StoryItem[] }
  vision: { statement: string; items: StoryItem[] }
}

export type Member = {
  id: string
  name: string
  title: string
  department?: string
  designation?: string
  batch?: string
  seed?: number
  hue?: Hue
  /** Sanity CDN URL; artwork is shown until one is set. */
  image?: string
  initials?: string
}

export type ClubEvent = { id: string; date: string; when: string; title: string; place: string; body: string }

export type Project = {
  id: string
  title: string
  body: string
  seed: number
  hue: Hue
  images: string[]
  links: { label: string; url: string }[]
}

export type Achievement = { id: string; year: string; title: string; event: string; result: string }

export type Photo = {
  id: string
  title: string
  date: string
  category?: string
  seed: number
  hue: Hue
  image?: string
}

export type Track = { id: string; title: string; note: string }
export type RegistrationOptions = { departments: string[]; batches: string[]; tracks: Track[] }

export type NavItem = { key: string; label: string; blurb?: string }
export type Section = { key: string; href: string; addr: string; label: string; blurb?: string }

export type SanityImage = { _type: 'image'; asset: { _ref: string } }
