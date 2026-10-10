// Generative "die shot": a chip floorplan drawn from a seed, in the logo's colours.
// It stands in wherever a photo will go, so every surface has finished artwork
// until the club supplies real pictures (see Media).

export type Hue = 'navy' | 'blue' | 'cyan' | 'sky'

const PALETTES: Record<Hue, { base: string; blocks: string[]; pad: string }> = {
  navy: { base: '#0f1b3d', blocks: ['#1672c4', '#34509f', '#38b8cc', '#9ad8e8'], pad: '#9ad8e8' },
  blue: { base: '#1672c4', blocks: ['#0f5a9e', '#9ad8e8', '#ffffff', '#34509f'], pad: '#dcebf8' },
  cyan: { base: '#157f92', blocks: ['#38b8cc', '#9ad8e8', '#0f1b3d', '#e3f4f8'], pad: '#e3f4f8' },
  sky: { base: '#e3f4f8', blocks: ['#1672c4', '#9ad8e8', '#34509f', '#38b8cc'], pad: '#34509f' },
}

const W = 400
const H = 300

type Block = { x: number; y: number; w: number; h: number; fill: string; opacity: number; texture: number }

function mulberry32(seed: number) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function floorplan(seed: number, hue: Hue) {
  const rand = mulberry32(seed * 7919 + 13)
  const { blocks: colours } = PALETTES[hue]
  const blocks: Block[] = []

  const split = (x: number, y: number, w: number, h: number, depth: number) => {
    const tooSmall = w < 72 || h < 58
    if (depth >= 5 || tooSmall || (depth > 1 && rand() < 0.16)) {
      blocks.push({
        x: x + 2,
        y: y + 2,
        w: w - 4,
        h: h - 4,
        fill: colours[Math.floor(rand() * colours.length)],
        opacity: 0.55 + rand() * 0.45,
        texture: Math.floor(rand() * 4),
      })
      return
    }
    const vertical = w / h > 1.15 ? true : h / w > 1.15 ? false : rand() < 0.5
    const ratio = 0.32 + rand() * 0.36
    if (vertical) {
      const w1 = Math.round(w * ratio)
      split(x, y, w1, h, depth + 1)
      split(x + w1, y, w - w1, h, depth + 1)
    } else {
      const h1 = Math.round(h * ratio)
      split(x, y, w, h1, depth + 1)
      split(x, y + h1, w, h - h1, depth + 1)
    }
  }
  split(28, 28, W - 56, H - 56, 0)

  const pads: { x: number; y: number }[] = []
  for (let x = 34; x <= W - 40; x += 16) {
    if (rand() > 0.12) pads.push({ x, y: 10 })
    if (rand() > 0.12) pads.push({ x, y: H - 17 })
  }
  for (let y = 34; y <= H - 40; y += 16) {
    if (rand() > 0.12) pads.push({ x: 10, y })
    if (rand() > 0.12) pads.push({ x: W - 17, y })
  }
  return { blocks, pads }
}

type Props = { seed: number; hue?: Hue; className?: string }

export function DieArt({ seed, hue = 'navy', className }: Props) {
  const { base, pad } = PALETTES[hue]
  const { blocks, pads } = floorplan(seed, hue)
  const id = `die-${hue}-${seed}`

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`${id}-1`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1.3" fill={base} opacity="0.34" />
        </pattern>
        <pattern id={`${id}-2`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="1.3" height="4" fill={base} opacity="0.34" />
        </pattern>
        <pattern id={`${id}-3`} width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill={base} opacity="0.4" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={base} />
      {pads.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width="7" height="7" fill={pad} opacity="0.55" />
      ))}
      {blocks.map((b) => (
        <g key={`${b.x}-${b.y}`}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5" fill={b.fill} opacity={b.opacity} />
          {b.texture > 0 && (
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5" fill={`url(#${id}-${b.texture})`} />
          )}
        </g>
      ))}
    </svg>
  )
}
