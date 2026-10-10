'use client'

import { useEffect, useRef } from 'react'

// A faint circuit board with signals travelling along its traces. Vias near the pointer light up
// as it moves, and a click sends a square wavefront outward.
// 'page' is the fixed background behind every route; 'hero' fills its parent in light-on-navy.
// Capped at ~30fps, paused when the tab is hidden, drawn once and left static under reduced motion.

const CELL = 48
const TRAIL_MS = 650
const BURST_MS = 750
const INTERACTIVE = 'a, button, input, select, textarea, label, summary, .member'

const TONES = {
  page: { trace: '22, 114, 196', traceAlpha: 0.045, pulse: '22, 114, 196', probe: '56, 184, 204', via: '#ffffff' },
  hero: { trace: '154, 216, 232', traceAlpha: 0.08, pulse: '154, 216, 232', probe: '255, 255, 255', via: '#0f1b3d' },
}

type Point = { x: number; y: number }
type Trace = { points: Point[]; lengths: number[]; total: number; offset: number; speed: number }
type Burst = { x: number; y: number; born: number }

function buildTraces(width: number, height: number): Trace[] {
  const cols = Math.ceil(width / CELL)
  const rows = Math.ceil(height / CELL)
  const count = Math.min(34, Math.max(10, Math.round((cols * rows) / 22)))
  const traces: Trace[] = []

  for (let i = 0; i < count; i++) {
    let x = Math.floor(Math.random() * cols) * CELL
    let y = Math.floor(Math.random() * rows) * CELL
    let horizontal = Math.random() < 0.5
    const points: Point[] = [{ x, y }]
    const segments = 3 + Math.floor(Math.random() * 3)
    for (let s = 0; s < segments; s++) {
      const step = (2 + Math.floor(Math.random() * 5)) * CELL * (Math.random() < 0.5 ? -1 : 1)
      if (horizontal) x = Math.min(width + CELL, Math.max(-CELL, x + step))
      else y = Math.min(height + CELL, Math.max(-CELL, y + step))
      points.push({ x, y })
      horizontal = !horizontal
    }
    const lengths = points.slice(1).map((p, k) => Math.abs(p.x - points[k].x) + Math.abs(p.y - points[k].y))
    const total = lengths.reduce((a, b) => a + b, 0)
    if (total > 0) {
      traces.push({ points, lengths, total, offset: Math.random() * total, speed: 40 + Math.random() * 50 })
    }
  }
  return traces
}

function pointAt(trace: Trace, distance: number): Point {
  let d = distance
  for (let i = 0; i < trace.lengths.length; i++) {
    const len = trace.lengths[i]
    if (d <= len && len > 0) {
      const a = trace.points[i]
      const b = trace.points[i + 1]
      const t = d / len
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
    d -= len
  }
  return trace.points[trace.points.length - 1]
}

export function CircuitBackground({ variant = 'page' }: { variant?: 'page' | 'hero' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const tone = TONES[variant]
    const fixed = variant === 'page'
    const host = canvas.parentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const board = document.createElement('canvas')
    const pointer = { x: -999, y: -999 }
    let traces: Trace[] = []
    let bursts: Burst[] = []
    let trail: Burst[] = []
    // The probe: a bracketed square that eases after the cursor and opens up over anything clickable.
    const probe = fixed && !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches
      ? document.body.appendChild(Object.assign(document.createElement('div'), { className: 'probe' }))
      : null
    const probeAt = { x: 0, y: 0, tx: 0, ty: 0, seen: false }
    let width = 0
    let height = 0
    let frame = 0
    let last = 0

    const draw = (now: number, dt: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(board, 0, 0, width, height)

      for (const trace of traces) {
        trace.offset = (trace.offset + trace.speed * dt) % (trace.total + 240)
        if (trace.offset > trace.total) continue // a pause between signals
        const head = pointAt(trace, trace.offset)
        const tail = pointAt(trace, Math.max(0, trace.offset - 22))
        ctx.strokeStyle = `rgba(${tone.pulse}, 0.2)`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(tail.x + 0.5, tail.y + 0.5)
        ctx.lineTo(head.x + 0.5, head.y + 0.5)
        ctx.stroke()
        ctx.fillStyle = `rgba(${tone.pulse}, 0.36)`
        ctx.fillRect(head.x - 1.5, head.y - 1.5, 4, 4)
      }

      // Pointer as a probe: vias and corners within reach light up.
      for (const trace of traces) {
        for (const p of trace.points) {
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y)
          if (d > 150) continue
          const a = 1 - d / 150
          ctx.fillStyle = `rgba(${tone.probe}, ${0.75 * a})`
          ctx.fillRect(p.x - 3, p.y - 3, 7, 7)
          ctx.strokeStyle = `rgba(${tone.probe}, ${0.28 * a})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x + 0.5, p.y + 0.5)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }
      }

      // Pointer trail: the path just travelled, routed like a trace (horizontal, then vertical).
      trail = trail.filter((p) => now - p.born < TRAIL_MS)
      ctx.lineWidth = 1.5
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1]
        const b = trail[i]
        ctx.strokeStyle = `rgba(${tone.probe}, ${0.55 * (1 - (now - b.born) / TRAIL_MS)})`
        ctx.beginPath()
        ctx.moveTo(a.x + 0.5, a.y + 0.5)
        ctx.lineTo(b.x + 0.5, a.y + 0.5)
        ctx.lineTo(b.x + 0.5, b.y + 0.5)
        ctx.stroke()
      }

      // Click: two square wavefronts, and a signal fired down each grid axis.
      bursts = bursts.filter((burst) => now - burst.born < BURST_MS)
      for (const burst of bursts) {
        const t = (now - burst.born) / BURST_MS
        const ease = 1 - (1 - t) ** 3
        ctx.lineWidth = 1.5
        for (const [delay, reach] of [
          [0, 120],
          [0.18, 70],
        ]) {
          const k = Math.max(0, (t - delay) / (1 - delay))
          if (!k) continue
          const r = 10 + (1 - (1 - k) ** 3) * reach
          ctx.strokeStyle = `rgba(${tone.pulse}, ${0.55 * (1 - k)})`
          ctx.strokeRect(burst.x - r, burst.y - r, r * 2, r * 2)
        }
        const d = 20 + ease * 260
        ctx.strokeStyle = `rgba(${tone.probe}, ${0.8 * (1 - t)})`
        ctx.fillStyle = `rgba(${tone.probe}, ${0.9 * (1 - t)})`
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const hx = burst.x + dx * d
          const hy = burst.y + dy * d
          ctx.beginPath()
          ctx.moveTo(hx - dx * 26, hy - dy * 26)
          ctx.lineTo(hx, hy)
          ctx.stroke()
          ctx.fillRect(hx - 2.5, hy - 2.5, 5, 5)
        }
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = fixed ? window.innerWidth : (host?.clientWidth ?? 0)
      height = fixed ? window.innerHeight : (host?.clientHeight ?? 0)
      if (!width || !height) return
      for (const c of [canvas, board]) {
        c.width = Math.round(width * dpr)
        c.height = Math.round(height * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      traces = buildTraces(width, height)

      // The board itself never changes, so it is drawn once and blitted each frame.
      const b = board.getContext('2d')
      if (!b) return
      b.setTransform(dpr, 0, 0, dpr, 0, 0)
      b.clearRect(0, 0, width, height)
      b.strokeStyle = `rgba(${tone.trace}, ${tone.traceAlpha})`
      b.lineWidth = 1
      for (const trace of traces) {
        b.beginPath()
        trace.points.forEach((p, i) => (i ? b.lineTo(p.x + 0.5, p.y + 0.5) : b.moveTo(p.x + 0.5, p.y + 0.5)))
        b.stroke()
        for (const p of [trace.points[0], trace.points[trace.points.length - 1]]) {
          b.fillStyle = tone.via
          b.fillRect(p.x - 3, p.y - 3, 7, 7)
          b.strokeRect(p.x - 2.5, p.y - 2.5, 6, 6)
        }
      }
      draw(performance.now(), 0)
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (probe && probeAt.seen) {
        // Tracked every frame (not throttled) with only a touch of easing, so it travels with the cursor.
        probeAt.x += (probeAt.tx - probeAt.x) * 0.4
        probeAt.y += (probeAt.ty - probeAt.y) * 0.4
        probe.style.transform = `translate3d(${probeAt.x}px, ${probeAt.y}px, 0)`
      }
      if (now - last < 32) return
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      draw(now, dt)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (!reduced && !document.hidden) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const local = (e: PointerEvent): Point => {
      if (fixed) return { x: e.clientX, y: e.clientY }
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const p = local(e)
      pointer.x = p.x
      pointer.y = p.y

      // Trail points snap to a fine grid so the path reads as routed, not scribbled.
      const snapped = { x: Math.round(p.x / 14) * 14, y: Math.round(p.y / 14) * 14 }
      const lastPoint = trail[trail.length - 1]
      if (!lastPoint || lastPoint.x !== snapped.x || lastPoint.y !== snapped.y) {
        trail.push({ ...snapped, born: performance.now() })
        if (trail.length > 48) trail.shift()
      }

      if (probe) {
        probeAt.tx = e.clientX
        probeAt.ty = e.clientY
        if (!probeAt.seen) {
          probeAt.seen = true
          probeAt.x = e.clientX
          probeAt.y = e.clientY
        }
        const target = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null
        probe.classList.add('is-on')
        probe.classList.toggle('is-active', !!target)
      }
    }
    const onLeave = () => {
      pointer.x = pointer.y = -999
      trail = []
      probe?.classList.remove('is-on')
    }
    const onUp = () => probe?.classList.remove('is-down')
    const onDown = (e: PointerEvent) => {
      bursts.push({ ...local(e), born: performance.now() })
      if (!fixed) return
      probe?.classList.add('is-down')
      // The canvas sits behind the content, so every click also gets a burst on top of it:
      // a chip outline snapping outward, a second ring, a core flash and eight pins flying off.
      const spark = document.createElement('span')
      spark.className = 'spark'
      spark.style.left = `${e.clientX}px`
      spark.style.top = `${e.clientY}px`
      spark.innerHTML = '<i class="spark__ring"></i><i class="spark__ring spark__ring--late"></i><i class="spark__core"></i>'
      for (let i = 0; i < 8; i++) {
        const pin = document.createElement('i')
        pin.className = 'spark__pin'
        pin.style.setProperty('--angle', `${Math.floor(i / 2) * 90}deg`)
        pin.style.setProperty('--shift', i % 2 ? '7px' : '-7px')
        spark.appendChild(pin)
      }
      window.setTimeout(() => spark.remove(), 700)
      document.body.appendChild(spark)
    }

    resize()
    start()
    const observer = !fixed && host && 'ResizeObserver' in window ? new ResizeObserver(resize) : null
    if (observer && host) observer.observe(host)
    else window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', start)
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
      window.addEventListener('pointerup', onUp, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    return () => {
      cancelAnimationFrame(frame)
      probe?.remove()
      window.removeEventListener('pointerup', onUp)
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', start)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [variant])

  return <canvas ref={canvasRef} className={`circuit circuit--${variant}`} aria-hidden="true" />
}
