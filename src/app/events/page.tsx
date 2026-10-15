import type { Metadata } from 'next'
import { EventsView } from '@/components/EventsView'
import { Page } from '@/components/Page'
import { getEvents, getSiteSettings } from '@/lib/content'
import { orgId, pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Events',
    description: `Upcoming and past events from ${club.name}: workshops, sessions and project showcases at KUET.`,
    path: '/events',
    club,
  })
}

export default async function EventsPage() {
  const [club, events] = await Promise.all([getSiteSettings(), getEvents()])

  // Build-time split for initial HTML and Event JSON-LD structured data.
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': upcoming.map((e) => ({
      '@type': 'EducationEvent',
      name: e.title,
      description: e.body,
      startDate: e.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      isAccessibleForFree: true,
      location: {
        '@type': 'Place',
        name: e.place,
        address: { '@type': 'PostalAddress', addressLocality: 'Khulna', postalCode: '9203', addressCountry: 'BD' },
      },
      organizer: { '@id': orgId },
    })),
  }

  return (
    <Page
      path="/events"
      title="What is on, and what was."
      lede="Every event is free for KUET students. Members get first claim on hardware."
      jsonLd={upcoming.length ? jsonLd : undefined}
    >
      <EventsView initialUpcoming={upcoming} initialPast={past} allEvents={events} meets={club.meets} />
    </Page>
  )
}
