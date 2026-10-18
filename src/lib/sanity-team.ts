import type { Member } from '@/lib/types'
import { getTeam } from './content'

/**
 * Sanity Executive Board Data Loader
 *
 * Fetches the 2026 Executive Panel from Sanity Content Lake.
 *
 * NOTE ON HISTORICAL PANELS:
 * We will later support keeping and archiving previous executive panels (e.g. 2025, 2024 alumni panels).
 * Currently only the active 2026 panel is loaded and displayed.
 *
 * PRIVACY GUARANTEE:
 * Private personal information (student rolls, personal phones, emails) is never loaded or exposed.
 */
export async function getExecutiveBoard(panel = '2026'): Promise<Member[]> {
  return getTeam(panel)
}

