import { batches, departments, tracks, type TrackId } from '@/data/club'

export type Registration = {
  name: string
  roll: string
  department: string
  batch: string
  email: string
  phone: string
  track: TrackId | ''
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

export function validateField(field: keyof Registration, v: Registration): string | undefined {
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
      if (!departments.includes(v.department)) return 'Choose your department.'
      return
    case 'batch':
      if (!batches.includes(v.batch)) return 'Choose your batch.'
      return
    case 'email':
      if (!EMAIL.test(v.email.trim())) return 'Enter an email address we can reach you on.'
      return
    case 'phone':
      if (v.phone && !BD_PHONE.test(v.phone.replace(/[\s-]/g, '')))
        return 'Enter a Bangladeshi mobile number, or leave this blank.'
      return
    case 'track':
      if (!tracks.some((t) => t.id === v.track)) return 'Pick the track you want to start with.'
      return
    case 'note':
      if (v.note.length > 300) return 'Keep this under 300 characters.'
      return
  }
}

export function validate(v: Registration): Errors {
  const errors: Errors = {}
  for (const field of Object.keys(v) as (keyof Registration)[]) {
    const message = validateField(field, v)
    if (message) errors[field] = message
  }
  return errors
}

export function passId(roll: string): string {
  return /^\d{7}$/.test(roll) ? `HACK-${roll.slice(0, 2)}-${roll.slice(2)}` : 'HACK-00-00000'
}

export function loadPass(): IssuedPass | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as IssuedPass) : null
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
