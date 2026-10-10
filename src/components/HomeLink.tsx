'use client'

import type { MouseEvent, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Link to the home page. Already on it, the router has nowhere to go and would do nothing,
    so the click scrolls back to the top instead (and drops any #section from the URL). */
export function HomeLink({
  className,
  label,
  onNavigate,
  children,
}: {
  className?: string
  label: string
  onNavigate?: () => void
  children: ReactNode
}) {
  const pathname = usePathname()

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.()
    // Leave modified clicks alone so "open in new tab" still works.
    if (pathname !== '/' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    if (window.location.hash) window.history.replaceState(null, '', '/')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <Link href="/" className={className} aria-label={label} onClick={onClick}>
      {children}
    </Link>
  )
}
