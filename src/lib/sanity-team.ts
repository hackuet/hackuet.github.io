import type { Member } from '@/data/club'
import { team as staticTeam } from '@/data/club'

/**
 * Sanity Executive Board Data Loader
 *
 * Fetches the 2026 Executive Panel from Sanity Content Lake via GROQ.
 *
 * NOTE ON HISTORICAL PANELS:
 * We will later support keeping and archiving previous executive panels (e.g. 2025, 2024 alumni panels).
 * Currently only the active 2026 panel is loaded and displayed.
 *
 * PRIVACY GUARANTEE:
 * Private personal information (student rolls, personal phones, emails) is never loaded or exposed.
 *
 * Resilient Architecture:
 * If Sanity is unreachable, credentials are unset, or network fails during build,
 * this function gracefully falls back to the static team array from `src/data/club.ts`.
 */
export async function getExecutiveBoard(panel = '2026'): Promise<Member[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'xcn3cj7z'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production'

  // Query matching active panel or documents where panel is tagged as 2026
  // TODO: Add selector / archive route for historical panels (e.g. 2025, 2024) in the future.
  const query = `*[_type == "teamMember" && (!defined(panel) || panel == "${panel}")] | order(orderRank asc, _createdAt asc) {
    "id": _id,
    name,
    title,
    department,
    designation,
    batch,
    seed,
    hue,
    "image": image.asset->url
  }`

  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.warn(`[Sanity] Query returned HTTP ${res.status}. Falling back to static data.`)
      return staticTeam
    }

    const data = await res.json()
    const members: Member[] = data?.result ?? []

    if (members.length === 0) {
      console.warn('[Sanity] No team members found in dataset. Falling back to static data.')
      return staticTeam
    }

    return members
  } catch (err) {
    console.warn('[Sanity] Fetch failed. Falling back to static data.', err)
    return staticTeam
  }
}
