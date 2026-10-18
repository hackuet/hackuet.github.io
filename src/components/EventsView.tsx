'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/motion'
import { EmptyState } from '@/components/ui'
import type { ClubEvent } from '@/data/site'

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

export function EventsView({
  meets,
  initialUpcoming,
  initialPast,
  allEvents,
}: {
  meets: string
  initialUpcoming: ClubEvent[]
  initialPast: ClubEvent[]
  allEvents: ClubEvent[]
}) {
  const [upcoming, setUpcoming] = useState<ClubEvent[]>(initialUpcoming)
  const [past, setPast] = useState<ClubEvent[]>(initialPast)

  useEffect(() => {
    // Re-evaluate on client mount so static export never renders stale event status
    const clientToday = new Date().toISOString().slice(0, 10)
    setUpcoming(allEvents.filter((e) => e.date >= clientToday).sort((a, b) => a.date.localeCompare(b.date)))
    setPast(allEvents.filter((e) => e.date < clientToday).sort((a, b) => b.date.localeCompare(a.date)))
  }, [allEvents])

  return (
    <>
      <section className="page-section" aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="page-section__title">
          Upcoming
        </h2>
        {upcoming.length ? (
          <EventList items={upcoming} />
        ) : (
          <EmptyState
            title="Nothing on the calendar yet"
            body={`Weekly sessions still run ${meets}. New events are announced to members first.`}
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
    </>
  )
}