import { getAchievements, getEvents, getProjects, getRegistrationOptions, getSiteSettings, getStory, getTeam } from '@/lib/content'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

// /llms.txt: a plain-Markdown summary of the site for language models and AI crawlers,
// generated from the same Sanity documents the pages use so it can never drift from them.
export async function GET() {
  const [club, story, options, achievements, events, team, projects] = await Promise.all([
    getSiteSettings(),
    getStory(),
    getRegistrationOptions(),
    getAchievements(),
    getEvents(),
    getTeam(),
    getProjects(),
  ])

  const founded = club.founded ? ` Founded in ${club.founded}.` : ''
  const lines = (items: string[], empty: string) => (items.length ? items.join('\n') : empty)

  const body = `# ${club.name} (${club.short})

> ${club.description} Based at ${club.university}, Khulna, Bangladesh.${founded}

## Key facts

- Full name: ${club.name}
- Short name: ${club.short}
- University: ${club.university} (KUET)
- Location: ${club.room}, ${club.address}
- Weekly sessions: ${club.meets}
- Membership: free, open to students of every KUET department, no experience required
- Current intake: ${club.intake}, closes ${club.intakeCloses}
- Contact: ${club.email}

## What members work on

${lines(options.tracks.map((t) => `- ${t.title}: ${t.note}`), '- (to be announced)')}

## Mission

${story.mission.statement}

${lines(story.mission.items.map((c) => `- ${c.title}: ${c.body}`), '')}

## Vision

${story.vision.statement}

${lines(story.vision.items.map((g) => `- ${g.title}: ${g.body}`), '')}

## History

${lines(story.history.milestones.map((m) => `- ${m.year}, ${m.title}: ${m.body}`), '- (to be announced)')}

## Projects

${lines(projects.map((p) => `- ${p.title}: ${p.body}`), '- (to be announced)')}

## Achievements

${lines(achievements.map((a) => `- ${a.year}: ${a.title}. ${a.result}, ${a.event}.`), 'None published yet.')}

## Events

${lines(events.map((e) => `- ${e.when}: ${e.title}, ${e.place}. ${e.body}`), 'None announced yet.')}

${lines(
  team.map((m) => `- ${m.title}: ${m.name}${m.designation ? ` (${m.designation})` : ''}${m.batch ? ` (batch ${m.batch})` : ''}`),
  'To be announced.'
)}

## Pages

- [Home](${siteUrl}/): overview of the club
- [Projects](${siteUrl}/projects/): member-built hardware, robots and IoT systems
- [Achievements](${siteUrl}/achievements/): contest results and published work
- [Events](${siteUrl}/events/): workshops, sprints and what is coming next
- [Gallery](${siteUrl}/gallery/): sessions, builds and contest days
- [People](${siteUrl}/people/): the students running the club this year
- [Register](${siteUrl}/register/): join the club
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
