import {
  getAchievements,
  getClub,
  getEvents,
  getProjects,
  getRegistrationOptions,
  getRoutes,
  getStory,
  getTeam,
} from '@/data/site'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

// /llms.txt: a plain-Markdown summary of the site for language models and AI crawlers,
// generated from the same Sanity documents the pages render, so it can never drift from them.
export async function GET() {
  const [club, story, tracks, achievements, events, projects, team, routes] = await Promise.all([
    getClub(),
    getStory(),
    getRegistrationOptions(),
    getAchievements(),
    getEvents(),
    getProjects(),
    getTeam(),
    getRoutes(),
  ])

  const body = `# ${club.name} (${club.short})

> ${club.description} Based at ${club.university}, Khulna, Bangladesh.${club.founded ? ` Founded in ${club.founded}.` : ''}

## Key facts

- Full name: ${club.name}
- Short name: ${club.short}
- University: ${club.university} (KUET)
- Location: ${club.room}, ${club.address}
- Weekly sessions: ${club.meets}
- Current intake: ${club.intake}, closes ${club.intakeCloses}
- Contact: ${club.email}

## What members work on

${tracks.tracks.map((t) => `- ${t.title}: ${t.note}`).join('\n')}

## Mission

${story.missionStatement}

${story.missionItems.map((c) => `- ${c.title}: ${c.body}`).join('\n')}

## Vision

${story.visionStatement}

## History

${story.milestones.map((m) => `- ${m.year}, ${m.title}: ${m.body}`).join('\n')}

## Projects

${projects.map((p) => `- ${p.title}: ${p.body}`).join('\n')}

## Achievements

${achievements.map((a) => `- ${a.year}: ${a.title}. ${a.result}, ${a.event}.`).join('\n')}

## Events

${events.map((e) => `- ${e.when}: ${e.title}, ${e.place}. ${e.body}`).join('\n')}

## Executive Board

${team.map((m) => `- ${m.title}: ${m.name}${m.designation ? ` (${m.designation})` : ''}${m.batch ? ` (batch ${m.batch})` : ''}`).join('\n')}

## Pages

- [Home](${siteUrl}/): overview of the club
${routes.map((item) => `- [${item.label}](${siteUrl}${item.href}/): ${item.blurb ?? ''}`).join('\n')}
- [Register](${siteUrl}/register/): join the club
`

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}