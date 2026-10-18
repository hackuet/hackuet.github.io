import { Page } from '@/components/Page'
import { TeamGrid } from '@/components/TeamGrid'
import { club } from '@/data/club'
import { getExecutiveBoard } from '@/lib/sanity-team'
import { orgId, pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Executive Board',
  description: `The Executive Board of ${club.name}: the President, Vice President, General Secretary and the students who run the club this year.`,
  path: '/executive-board',
})

// Note: We will later support keeping and archiving previous executive panels (e.g. 2025, 2024 alumni panels).
// Currently only the active 2026 panel is loaded and displayed.
export default async function ExecutiveBoardPage() {
  const members = await getExecutiveBoard('2026')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    member: members.map((m) => ({
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
      jsonLd={jsonLd}
    >
      <TeamGrid members={members} />
    </Page>
  )
}
