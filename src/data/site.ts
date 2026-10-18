/**
 * The site's single source of truth. Every value here comes from Sanity
 * (project ky8bcwum, dataset production) — there is no local content file.
 *
 * Shapes deliberately mirror the retired `src/data/club.ts`, so the page and
 * component code reads the same way it always did.
 */
import { defineQuery } from 'next-sanity'
import type { Hue } from '@/components/DieArt'
import { imageUrl, sanity } from '@/lib/sanity'

/* ------------------------------------------------------------------ types */

export type Club = {
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

export type Milestone = { year: string; title: string; body: string }

export type Story = {
  historyTitle: string
  historyLede: string
  milestones: Milestone[]
  missionStatement: string
  missionItems: { title: string; body: string }[]
  visionStatement: string
  visionItems: { title: string; body: string }[]
}

export type Achievement = { id: string; year: string; title: string; event: string; result: string }

export type Photo = { id: string; title: string; date: string; seed: number; hue: Hue; image?: string }

export type Track = { id: string; title: string; note: string }
export type TrackId = string

export type Member = {
  id: string
  name: string
  title: string
  department?: string
  designation?: string
  roll?: string
  batch?: string
  seed: number
  hue: Hue
  image?: string
}

export type ClubEvent = {
  id: string
  date: string
  when: string
  title: string
  place: string
  body: string
}

export type Project = {
  id: string
  title: string
  body: string
  seed: number
  hue: Hue
  image?: string
  links: { label: string; url: string }[]
}

export type NavItem = { key: string; label: string; addr?: string; blurb?: string; href: string }

/* ---------------------------------------------------------------- queries */

/**
 * Keep these as plain string literals — TypeGen reads the AST to map a query to
 * its result type, and template interpolation defeats that.
 */
const CLUB_Q = defineQuery(
  `*[_type == "siteSettings"][0]{short,name,university,tagline,description,founded,email,room,address,mapUrl,meets,intake,intakeCloses,keywords}`,
)

const NAV_Q = defineQuery(
  `*[_type == "navigation"][0]{items[]{key,label,addr,blurb}}`,
)

const SLIDES_Q = defineQuery(
  `*[_type == "heroSlide"] | order(orderRank asc){_id,label,eyebrow,title,body,figure,seed,hue,image}`,
)

const STORY_Q = defineQuery(
  `*[_type == "homeStory"][0]{historyTitle,historyLede,milestones[]{year,title,body},missionStatement,missionItems[]{title,body},visionStatement,visionItems[]{title,body}}`,
)

const ACHIEVEMENTS_Q = defineQuery(
  `*[_type == "achievement"] | order(orderRank asc){_id,year,title,event,result}`,
)

const GALLERY_Q = defineQuery(
  `*[_type == "galleryPhoto"] | order(orderRank asc){_id,title,date,seed,hue,image}`,
)

const OPTIONS_Q = defineQuery(
  `*[_type == "registrationOptions"][0]{departments,batches,tracks[]{id,title,note}}`,
)

const TEAM_Q = defineQuery(
  `*[_type == "teamMember"] | order(orderRank asc){_id,name,title,department,designation,roll,batch,seed,hue,image}`,
)

const EVENTS_Q = defineQuery(`*[_type == "event"] | order(date desc){_id,date,when,title,place,body}`)

const PROJECTS_Q = defineQuery(
  `*[_type == "project"] | order(orderRank asc){_id,title,body,seed,hue,"image": images[0],links[]{label,url}}`,
)

/* --------------------------------------------------------------- fetchers */

/** Nav keys map to routes; `about` and `contact` are homepage anchors. */
const hrefFor = (key: string) =>
  key === 'about' ? '/#history' : key === 'contact' ? '/#contact' : `/${key}`

export async function getClub(): Promise<Club> {
  const c = await sanity.fetch(CLUB_Q)
  return {
    short: c?.short ?? 'HACK',
    name: c?.name ?? '',
    university: c?.university ?? '',
    tagline: c?.tagline ?? '',
    description: c?.description ?? '',
    founded: c?.founded ?? undefined,
    email: c?.email ?? '',
    room: c?.room ?? '',
    address: c?.address ?? '',
    mapUrl: c?.mapUrl ?? '',
    meets: c?.meets ?? '',
    intake: c?.intake ?? '',
    intakeCloses: c?.intakeCloses ?? '',
    keywords: c?.keywords ?? [],
  }
}

export async function getNav(): Promise<NavItem[]> {
  const nav = await sanity.fetch(NAV_Q)
  return (nav?.items ?? []).map((i: { key: string; label: string; addr?: string; blurb?: string }) => ({
    ...i,
    href: hrefFor(i.key),
  }))
}

/** Section routes only — drives breadcrumbs and the prev/next pager. */
export async function getRoutes(): Promise<NavItem[]> {
  const nav = await getNav()
  return nav.filter((i) => i.key !== 'about' && i.key !== 'contact')
}

export async function getSlides(): Promise<Slide[]> {
  const rows = await sanity.fetch(SLIDES_Q)
  return (rows ?? []).map((s: Record<string, unknown>) => ({
    id: s._id as string,
    label: (s.label ?? '') as string,
    eyebrow: (s.eyebrow ?? '') as string,
    title: (s.title ?? '') as string,
    body: (s.body ?? '') as string,
    figure: (s.figure ?? '') as string,
    seed: (s.seed ?? 1) as number,
    hue: ((s.hue ?? 'navy') as Hue),
    image: imageUrl(s.image, 1000),
  }))
}

export async function getStory(): Promise<Story> {
  const s = await sanity.fetch(STORY_Q)
  return {
    historyTitle: s?.historyTitle ?? '',
    historyLede: s?.historyLede ?? '',
    milestones: s?.milestones ?? [],
    missionStatement: s?.missionStatement ?? '',
    missionItems: s?.missionItems ?? [],
    visionStatement: s?.visionStatement ?? '',
    visionItems: s?.visionItems ?? [],
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  const rows = await sanity.fetch(ACHIEVEMENTS_Q)
  return (rows ?? []).map((a: Record<string, string>) => ({
    id: a._id,
    year: a.year ?? '',
    title: a.title ?? '',
    event: a.event ?? '',
    result: a.result ?? '',
  }))
}

export async function getGallery(): Promise<Photo[]> {
  const rows = await sanity.fetch(GALLERY_Q)
  return (rows ?? []).map((p: Record<string, unknown>) => ({
    id: p._id as string,
    title: (p.title ?? '') as string,
    date: (p.date ?? '') as string,
    seed: (p.seed ?? 1) as number,
    hue: (p.hue ?? 'navy') as Hue,
    image: imageUrl(p.image, 900),
  }))
}

export async function getRegistrationOptions(): Promise<{
  departments: string[]
  batches: string[]
  tracks: Track[]
}> {
  const o = await sanity.fetch(OPTIONS_Q)
  return {
    departments: o?.departments ?? [],
    batches: o?.batches ?? [],
    tracks: (o?.tracks ?? []).map((t: Track) => t),
  }
}

export async function getTeam(): Promise<Member[]> {
  const rows = await sanity.fetch(TEAM_Q)
  return (rows ?? []).map((m: Record<string, unknown>) => ({
    id: m._id as string,
    name: (m.name ?? '') as string,
    title: (m.title ?? '') as string,
    department: m.department as string | undefined,
    designation: m.designation as string | undefined,
    roll: m.roll as string | undefined,
    batch: m.batch as string | undefined,
    seed: (m.seed ?? 1) as number,
    hue: (m.hue ?? 'navy') as Hue,
    image: imageUrl(m.image, 640),
  }))
}

export async function getEvents(): Promise<ClubEvent[]> {
  const rows = await sanity.fetch(EVENTS_Q)
  return (rows ?? []).map((e: Record<string, string>) => ({
    id: e._id,
    date: e.date ?? '',
    when: e.when ?? e.date ?? '',
    title: e.title ?? '',
    place: e.place ?? '',
    body: e.body ?? '',
  }))
}

export async function getProjects(): Promise<Project[]> {
  const rows = await sanity.fetch(PROJECTS_Q)
  return (rows ?? []).map((p: Record<string, unknown>) => ({
    id: p._id as string,
    title: (p.title ?? '') as string,
    body: (p.body ?? '') as string,
    seed: (p.seed ?? 1) as number,
    hue: (p.hue ?? 'navy') as Hue,
    image: imageUrl(p.image, 900),
    links: (p.links ?? []) as { label: string; url: string }[],
  }))
}