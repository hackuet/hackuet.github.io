import { achievements, club, events, history, mission, routes, team, tracks, vision } from '@/data/club'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

// /llms.txt: a plain-Markdown summary of the site for language models and AI crawlers,
// generated from the same data file the pages use so it can never drift from them.
export function GET() {
  const body = `# ${club.name} (${club.short})

> ${club.description} Based at ${club.university}, Khulna, Bangladesh. Founded in ${club.founded}.

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

${tracks.map((t) => `- ${t.title}: ${t.note}`).join('\n')}

## Mission

${mission.statement}

${mission.commitments.map((c) => `- ${c.title}: ${c.body}`).join('\n')}

## Vision

${vision.statement}

## History

${history.milestones.map((m) => `- ${m.year}, ${m.title}: ${m.body}`).join('\n')}

## Achievements

${achievements.map((a) => `- ${a.year}: ${a.title}. ${a.result}, ${a.event}.`).join('\n')}

## Events

${events.map((e) => `- ${e.when}: ${e.title}, ${e.place}. ${e.body}`).join('\n')}

## Executive Board

${team.map((m) => `- ${m.title}: ${m.name} (${m.department}, batch ${m.batch})`).join('\n')}

## Pages

- [Home](${siteUrl}/): overview of the club
${routes.map((item) => `- [${item.label}](${siteUrl}${item.href}/): ${item.blurb}`).join('\n')}
- [Register](${siteUrl}/register/): join the club
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
