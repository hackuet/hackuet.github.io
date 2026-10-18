import { client, imageUrl } from './sanity'
import { mergeNavigation } from './sections'
import type {
  Achievement, ClubEvent, Member, NavItem, Photo, Project, RegistrationOptions, SanityImage, Section, SiteSettings, Slide, Story,
} from './types'

export const STUDIO_URL = 'https://hack-kuet.sanity.studio'

function required(what: string): never {
  throw new Error(
    `Sanity: ${what} is missing. Open the Studio (${STUDIO_URL}) and create or restore it before building.`,
  )
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await client.fetch<SiteSettings | null>(`*[_id == "siteSettings"][0]{
    short, name, university, tagline, description, founded, email, room, address, mapUrl, meets, intake, intakeCloses, keywords
  }`)
  if (!doc) required('the "Site settings" document')
  return { ...doc, keywords: doc.keywords ?? [] }
}

type SlideDoc = Omit<Slide, 'id' | 'image'> & { _id: string; image?: SanityImage }

export async function getSlides(): Promise<Slide[]> {
  const docs = (await client.fetch<SlideDoc[]>(`*[_type == "heroSlide"] | order(orderRank asc) {
    _id, label, eyebrow, title, body, figure, seed, hue, image
  }`)) as SlideDoc[]
  return docs.map(({ _id, image, ...rest }: SlideDoc) => ({ ...rest, id: _id, image: imageUrl(image, 1920) }))
}

type StoryDoc = {
  historyTitle: string
  historyLede: string
  milestones?: Story['history']['milestones']
  missionStatement: string
  missionItems?: Story['mission']['items']
  visionStatement: string
  visionItems?: Story['vision']['items']
}

export async function getStory(): Promise<Story> {
  const doc = await client.fetch<StoryDoc | null>(`*[_id == "homeStory"][0]{
    historyTitle, historyLede, milestones[]{ year, title, body },
    missionStatement, missionItems[]{ title, body },
    visionStatement, visionItems[]{ title, body }
  }`)
  if (!doc) required('the "Home story" document')
  return {
    history: { title: doc.historyTitle, lede: doc.historyLede, milestones: doc.milestones ?? [] },
    mission: { statement: doc.missionStatement, items: doc.missionItems ?? [] },
    vision: { statement: doc.visionStatement, items: doc.visionItems ?? [] },
  }
}

type MemberDoc = Omit<Member, 'id' | 'image'> & { _id: string; image?: SanityImage }

// Note: We will later support keeping and archiving previous executive panels (e.g. 2025, 2024 alumni panels).
// Currently only the active 2026 panel is loaded and displayed.
export async function getTeam(panel = '2026'): Promise<Member[]> {
  const docs = (await client.fetch<MemberDoc[]>(`*[_type == "teamMember" && (!defined(panel) || panel == "${panel}")] | order(orderRank asc, _createdAt asc) {
    _id, name, title, department, designation, batch, seed, hue, image
  }`)) as MemberDoc[]
  return docs.map(({ _id, image, ...rest }: MemberDoc) => ({ ...rest, id: _id, image: imageUrl(image, 800) }))
}

export async function getEvents(): Promise<ClubEvent[]> {
  type EventDoc = Omit<ClubEvent, 'id'> & { _id: string }
  const docs = (await client.fetch<EventDoc[]>(`*[_type == "event"] {
    _id, date, when, title, place, body
  }`)) as EventDoc[]
  return docs.map(({ _id, ...rest }: EventDoc) => ({ ...rest, id: _id }))
}

type PhotoDoc = Omit<Photo, 'id' | 'image'> & { _id: string; image?: SanityImage }

export async function getGallery(): Promise<Photo[]> {
  const docs = (await client.fetch<PhotoDoc[]>(`*[_type == "galleryPhoto"] | order(orderRank asc) {
    _id, title, date, category, seed, hue, image
  }`)) as PhotoDoc[]
  return docs.map(({ _id, image, ...rest }: PhotoDoc) => ({ ...rest, id: _id, image: imageUrl(image, 1600) }))
}

type ProjectDoc = {
  _id: string
  title: string
  body: string
  seed: number
  hue: Project['hue']
  images?: SanityImage[]
  links?: { label: string; url: string }[]
}

export async function getProjects(): Promise<Project[]> {
  const docs = (await client.fetch<ProjectDoc[]>(`*[_type == "project"] | order(orderRank asc) {
    _id, title, body, seed, hue, images[]{ asset }, links[]{ label, url }
  }`)) as ProjectDoc[]
  return docs.map((doc: ProjectDoc) => ({
    id: doc._id,
    title: doc.title,
    body: doc.body,
    seed: doc.seed,
    hue: doc.hue,
    images: (doc.images ?? []).map((image: SanityImage) => imageUrl(image, 1600)).filter((url): url is string => Boolean(url)),
    links: doc.links ?? [],
  }))
}

export async function getAchievements(): Promise<Achievement[]> {
  type AchDoc = Omit<Achievement, 'id'> & { _id: string }
  const docs = (await client.fetch<AchDoc[]>(`*[_type == "achievement"] | order(orderRank asc) {
    _id, year, title, event, result
  }`)) as AchDoc[]
  return docs.map(({ _id, ...rest }: AchDoc) => ({ ...rest, id: _id }))
}

export async function getRegistrationOptions(): Promise<RegistrationOptions> {
  const doc = await client.fetch<RegistrationOptions | null>(`*[_id == "registrationOptions"][0]{
    departments, batches, tracks[]{ id, title, note }
  }`)
  if (!doc) required('the "Registration options" document')
  return { departments: doc.departments ?? [], batches: doc.batches ?? [], tracks: doc.tracks ?? [] }
}

/** Navigation tolerates a missing document: code-level default labels apply. */
export async function getNavigation(): Promise<Section[]> {
  const items = await client.fetch<NavItem[] | null>(`*[_id == "navigation"][0].items[]{ key, label, blurb }`)
  return mergeNavigation(items ?? [])
}
