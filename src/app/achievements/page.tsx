import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { getAchievements, getClub, getRoutes } from '@/data/site'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata() {
  const club = await getClub()
  return pageMeta({
    title: 'Achievements',
    description: `Contest results and published work from ${club.name}: national digital design contests, FPGA and GPU projects by KUET students.`,
    path: '/achievements',
    short: club.short,
  })
}

export default async function AchievementsPage() {
  const [club, achievements, routes] = await Promise.all([getClub(), getAchievements(), getRoutes()])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${club.name} achievements`,
    itemListElement: achievements.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${a.title} (${a.result}, ${a.year})`,
      description: a.event,
    })),
  }

  return (
    <Page
      path="/achievements"
      title="Work that left the lab."
      lede="Results from contests and conferences our members have taken their hardware to."
      routes={routes}
      jsonLd={jsonLd}
    >
      <ul className="rows results page-body">
        {achievements.map((a, i) => (
          <Reveal as="li" key={a.id} delay={i * 60}>
            <span className="results__year">{a.year}</span>
            <div>
              <h2>{a.title}</h2>
              <p>{a.event}</p>
            </div>
            <span className="results__result">{a.result}</span>
          </Reveal>
        ))}
      </ul>
    </Page>
  )
}