import type { ReactNode } from 'react'
import { DieArt, type Hue } from './DieArt'

/** The chip "H" from the club logo, traced as a vector. Used where the full logo is too wide.
    Colours can be overridden through --mark, --mark-core and --mark-ink (see .brand--light). */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M17 2v8M23 2v8M29 2v8M35 2v8M41 2v8M47 2v8M17 54v8M23 54v8M29 54v8M35 54v8M41 54v8M47 54v8M2 17h8M2 23h8M2 29h8M2 35h8M2 41h8M2 47h8M54 17h8M54 23h8M54 29h8M54 35h8M54 41h8M54 47h8"
        stroke="var(--mark, #3a4fa3)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="9" y="9" width="46" height="46" rx="4" fill="var(--mark, #3a4fa3)" />
      <rect
        x="14.5"
        y="14.5"
        width="35"
        height="35"
        fill="var(--mark-core, #1672c4)"
        stroke="var(--mark-ink, #cfeff6)"
        strokeWidth="1.4"
      />
      <path d="M25 21v22M39 21v22M25 32h14" fill="none" stroke="var(--mark-ink, #cfeff6)" strokeWidth="4" />
    </svg>
  )
}

/** A real photo when one exists, generated artwork until then. */
export function Media({
  image,
  alt,
  seed,
  hue,
  className = '',
}: {
  image?: string
  alt: string
  seed: number
  hue: Hue
  className?: string
}) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`media ${className}`} src={image} alt={alt} loading="lazy" decoding="async" />
  }
  return <DieArt className={`media ${className}`} seed={seed} hue={hue} />
}

/** Section label written as a register address, the site's recurring motif. */
export function SectionHead({
  id,
  addr,
  label,
  title,
  children,
}: {
  id: string
  addr: string
  label: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="section-head">
      <p className="addr">
        <span>{addr}</span>
        {label}
      </p>
      <h2 id={id}>{title}</h2>
      {children}
    </header>
  )
}

export function Notice({
  tone,
  title,
  children,
}: {
  tone: 'success' | 'error'
  title: string
  children?: ReactNode
}) {
  return (
    <div className={`notice notice--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <p className="notice__title">{title}</p>
      {children && <div className="notice__body">{children}</div>}
    </div>
  )
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      <p className="empty__body">{body}</p>
      {action}
    </div>
  )
}
