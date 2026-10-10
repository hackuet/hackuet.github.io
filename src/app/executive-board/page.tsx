import { Page } from '@/components/Page'
import { TeamGrid } from '@/components/TeamGrid'
import { club, team } from '@/data/club'
import { orgId, pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Executive Board',
  description: `The Executive Board of ${club.name}: the President, Vice President, General Secretary and the students who run the club this year.`,
  path: '/executive-board',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': orgId,
  member: team.map((m) => ({
    '@type': 'Person',
    name: m.name,
    jobTitle: m.title,
    affiliation: { '@type': 'CollegeOrUniversity', name: club.university },
  })),
}

export default function ExecutiveBoardPage() {
  return (
    <Page
      path="/executive-board"
      title="The people running HACK."
      lede="This year’s Executive Board. Hover or tap a portrait for name, title, department and batch."
      jsonLd={jsonLd}
    >
      <TeamGrid members={team} />
    </Page>
  )
}
