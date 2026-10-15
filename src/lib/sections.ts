import type { NavItem, Section } from './types'

// Route hrefs and address labels are design constants: a navigation label edited
// in the Studio can never point at a page that does not exist. The Projects
// route is added to this list in Task 8, together with its page.
export const REGISTER_ADDR = '0x0B'

const ROUTE_DEFS: Section[] = [
  { key: 'about', href: '/#history', addr: '0x01', label: 'About', blurb: 'How the club started and why it exists.' },
  { key: 'projects', href: '/projects', addr: '0x05', label: 'Projects', blurb: 'Member-built hardware, robots and IoT systems.' },
  { key: 'achievements', href: '/achievements', addr: '0x06', label: 'Achievements', blurb: 'Contest results and published work.' },
  { key: 'events', href: '/events', addr: '0x07', label: 'Events', blurb: 'Workshops, sessions and what is coming next.' },
  { key: 'gallery', href: '/gallery', addr: '0x08', label: 'Gallery', blurb: 'Sessions, builds and contest days.' },
  { key: 'executive-board', href: '/executive-board', addr: '0x09', label: 'Executive Board', blurb: 'The students running the club this year.' },
  { key: 'contact', href: '/#contact', addr: '0x0A', label: 'Contact', blurb: 'Where to find us, and how to write.' },
]

/** Labels and blurbs come from Sanity; addresses and hrefs stay in code. Unknown
    Studio items are ignored; missing ones fall back to the defaults above. */
export function mergeNavigation(items: NavItem[]): Section[] {
  const byKey = new Map(items.map((item) => [item.key, item]))
  return ROUTE_DEFS.map((def) => {
    const item = byKey.get(def.key)
    return { ...def, label: item?.label ?? def.label, blurb: item?.blurb ?? def.blurb }
  })
}

/** The named section routes (about and contact are anchors on the home page). */
export function routeSections(): Section[] {
  return ROUTE_DEFS.filter((section) => section.href.startsWith('/'))
}
