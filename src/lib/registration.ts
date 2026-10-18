/**
 * Client-side validation for the registration form. The allowed departments,
 * batches and tracks are fetched from Sanity and passed in, so the rules always
 * match what the Studio currently publishes.
 */
export type TrackOption = { id: string; title: string; note?: string }

export type RegistrationOptions = {
  departments: string[]
  batches: string[]
  tracks: TrackOption[]
}

export type Registration = {
  name: string
  roll: string
  department: string
  batch: string
  email: string
  phone: string
  track: string
  note: string
}

export type IssuedPass = Registration & { id: string; issuedAt: string }

export type Errors = Partial<Record<keyof Registration, string>>

export const emptyRegistration: Registration = {
  name: '',
  roll: '',
  department: '',
  batch: '',
  email: '',
  phone: '',
  track: '',
  note: '',
}

const KEY = 'hack:pass:v1'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const BD_PHONE = /^(\+?880|0)1[3-9]\d{8}$/

export function validateField(
  field: keyof Registration,
  v: Registration,
  options: RegistrationOptions,
): string | undefined {
  switch (field) {
    case 'name':
      if (v.name.trim().length < 3) return 'Enter your full name.'
      return
    case 'roll': {
      if (!/^\d{7}$/.test(v.roll)) return 'KUET roll numbers are 7 digits, for example 2307045.'
      const yy = v.batch.slice(2)
      if (yy && !v.roll.startsWith(yy)) return `Batch ${v.batch} rolls start with ${yy}. Check the roll or the batch.`
      return
    }
    case 'department':
      if (!options.departments.includes(v.department)) return 'Choose your department.'
      return
    case 'batch':
      if (!options.batches.includes(v.batch)) return 'Choose your batch.'
      return
    case 'email':
      if (!EMAIL.test(v.email.trim())) return 'Enter an email address we can reach you on.'
      return
    case 'phone':
      if (v.phone && !BD_PHONE.test(v.phone.replace(/[\s-]/g, '')))
        return 'Enter a Bangladeshi mobile number, or leave this blank.'
      return
    case 'track':
      if (!options.tracks.some((t) => t.id === v.track)) return 'Pick the track you want to start with.'
      return
    case 'note':
      if (v.note.length > 300) return 'Keep this under 300 characters.'
      return
  }
}

export function validate(v: Registration, options: RegistrationOptions): Errors {
  const errors: Errors = {}
  for (const field of Object.keys(v) as (keyof Registration)[]) {
    const message = validateField(field, v, options)
    if (message) errors[field] = message
  }
  return errors
}

export function passId(roll: string): string {
  return /^\d{7}$/.test(roll) ? `HACK-${roll.slice(0, 2)}-${roll.slice(2)}` : 'HACK-00-00000'
}

export function isIssuedPass(obj: unknown, options: RegistrationOptions): obj is IssuedPass {
  if (!obj || typeof obj !== 'object') return false
  const p = obj as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    p.name.trim().length >= 3 &&
    typeof p.roll === 'string' &&
    /^\d{7}$/.test(p.roll) &&
    typeof p.department === 'string' &&
    options.departments.includes(p.department) &&
    typeof p.batch === 'string' &&
    options.batches.includes(p.batch) &&
    typeof p.email === 'string' &&
    EMAIL.test(p.email.trim()) &&
    typeof p.phone === 'string' &&
    typeof p.track === 'string' &&
    options.tracks.some((t) => t.id === p.track) &&
    typeof p.note === 'string' &&
    typeof p.issuedAt === 'string'
  )
}

export function loadPass(options: RegistrationOptions): IssuedPass | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (isIssuedPass(parsed, options)) {
      return parsed
    }
    // Invalid shape in localStorage: clean up to avoid corrupted state
    localStorage.removeItem(KEY)
    return null
  } catch {
    return null
  }
}

// There is no backend: the pass is kept in this browser. The delay stands in for the
// network so the loading state is exercised; swap the body for a real request later.
export async function submitRegistration(v: Registration): Promise<IssuedPass> {
  await new Promise((resolve) => setTimeout(resolve, 900))
  const pass: IssuedPass = {
    ...v,
    name: v.name.trim(),
    email: v.email.trim(),
    id: passId(v.roll),
    issuedAt: new Date().toISOString(),
  }
  localStorage.setItem(KEY, JSON.stringify(pass))
  return pass
}

export function clearPass() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Storage unavailable: nothing was saved, so there is nothing to clear.
  }
}