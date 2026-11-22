import type { Metadata } from 'next'
import { Page } from '@/components/Page'
import { TeamGrid } from '@/components/TeamGrid'
import { EmptyState } from '@/components/ui'
import { getSiteSettings, getTeam } from '@/lib/content'
import { orgId, pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'People',
    description: `The people running ${club.name}: the students running the club this year.`,
    path: '/people',
    club,
  })
}

// Note: We will later support keeping and archiving previous executive panels (e.g. 2025, 2024 alumni panels).
// Currently only the active 2026 panel is loaded and displayed.
export default async function PeoplePage() {
  const [club, team] = await Promise.all([getSiteSettings(), getTeam()])

  const jsonLd = team.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': orgId,
        member: team.map((m) => ({
          '@type': 'Person',
          name: m.name,
          jobTitle: m.title,
          affiliation: { '@type': 'CollegeOrUniversity', name: club.university },
          ...(m.image ? { image: m.image } : {}),
        })),
      }
    : undefined

  return (
    <Page
      path="/people"
      title="The people running HACK."
      jsonLd={jsonLd}
    >
      {team.length ? (
        <TeamGrid members={team} />
      ) : (
        <EmptyState title="The board is being formed" body="Member profiles will appear here once the committee is confirmed." />
      )}
    </Page>
  )
}
