'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Types a heading out character by character. The untyped remainder stays in the layout
    (invisible), so nothing shifts while it types, and the full text is the accessible name. */
export function Typewriter({
  text,
  as: Tag = 'h1',
  id,
  className = '',
  active = true,
  speed = 26,
}: {
  text: string
  as?: 'h1' | 'h2'
  id?: string
  className?: string
  active?: boolean
  speed?: number
}) {
  // null = not started: the server and the first client render show nothing typed yet.
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!active) {
      setCount(null)
      return
    }
    if (prefersReducedMotion()) {
      setCount(text.length)
      return
    }
    let typed = 0
    setCount(0)
    const timer = window.setInterval(() => {
      typed += 1
      setCount(typed)
      if (typed >= text.length) window.clearInterval(timer)
    }, speed)
    return () => window.clearInterval(timer)
  }, [text, active, speed])

  const typed = count ?? text.length
  const done = typed >= text.length

  return (
    <Tag id={id} className={`tw${count !== null ? ' is-ready' : ''} ${className}`} aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, typed)}
        <span className={`tw__caret${done ? ' is-done' : ''}`} />
        <span className="tw__rest">{text.slice(typed)}</span>
      </span>
    </Tag>
  )
}

/** Fades content up the first time it scrolls into view. */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode
  as?: 'div' | 'li'
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal${seen ? ' is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
