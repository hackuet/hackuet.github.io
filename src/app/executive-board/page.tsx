import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { TeamGrid } from '@/components/TeamGrid'
import { getClub, getRoutes, getTeam } from '@/data/site'
import { orgId, pageMeta } from '@/lib/seo'

export async function generateMetadata() {
  const club = await getClub()
  return pageMeta({
    title: 'Executive Board',
    description: `The Executive Board of ${club.name}: the President, Vice President, General Secretary and the students who run the club this year.`,
    path: '/executive-board',
    short: club.short,
  })
}

export default async function ExecutiveBoardPage() {
  const [club, routes, team] = await Promise.all([getClub(), getRoutes(), getTeam()])

  const jsonLd = {
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

  return (
    <Page
      path="/executive-board"
      title="The people running HACK."
      lede="This year’s Executive Board. Hover or tap a portrait for name, title, department and batch."
      routes={routes}
      jsonLd={jsonLd}
    >
      <TeamGrid members={team} />
    </Page>
  )
}