import Link from 'next/link'
import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { EmptyState } from '@/components/ui'
import { club, events, type ClubEvent } from '@/data/club'
import { orgId, pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Events',
  description: `Upcoming and past events from ${club.name}: Verilog workshops, the annual Hardware Sprint, GPU computing sessions and open design reviews at KUET.`,
  path: '/events',
})

// Split at build time; the site is rebuilt whenever the events list changes.
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

function EventList({ items }: { items: ClubEvent[] }) {
  return (
    <ul className="rows events">
      {items.map((e, i) => (
        <Reveal as="li" key={e.id} delay={i * 60}>
          <time dateTime={e.date}>{e.when}</time>
          <div>
            <h3>{e.title}</h3>
            <p>{e.body}</p>
            <p className="events__place">{e.place}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}

export default function EventsPage() {
  return (
    <Page
      path="/events"
      title="What is on, and what was."
      lede="Every event is free for KUET students. Members get first claim on boards."
      jsonLd={upcoming.length ? jsonLd : undefined}
    >
      <section className="page-section" aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="page-section__title">
          Upcoming
        </h2>
        {upcoming.length ? (
          <EventList items={upcoming} />
        ) : (
          <EmptyState
            title="Nothing on the calendar yet"
            body={`Weekly sessions still run ${club.meets}. New events are announced to members first.`}
            action={
              <Link href="/register" className="btn btn--primary btn--sm">
                Register to hear first
              </Link>
            }
          />
        )}
      </section>

      {past.length > 0 && (
        <section className="page-section" aria-labelledby="past-title">
          <h2 id="past-title" className="page-section__title">
            Past
          </h2>
          <EventList items={past} />
        </section>
      )}
    </Page>
  )
}
