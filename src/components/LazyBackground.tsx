'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const CircuitBackground = dynamic(() => import('./CircuitBackground').then((m) => m.CircuitBackground), {
  ssr: false,
})

/** The animated circuit is decoration, so its code loads only once the browser is idle. */
export function LazyBackground({ variant = 'page' }: { variant?: 'page' | 'hero' }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(() => setReady(true), 300)
    return () => clearTimeout(id)
  }, [])

  return ready ? <CircuitBackground variant={variant} /> : null
}
