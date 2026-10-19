# HACK KUET Design System & Visual Architecture

> **Official Design Specification & Visual Identity Guide for the Hardware Acceleration Club of KUET (HACK).**  
> *Crafted by [@ettisafxrup](https://github.com/ettisafxrup).*

---

## 1. Design Philosophy: Silicon & Hardware Minimalist

Unlike conventional software engineering websites that adopt generic SaaS templates or saturated neon cyberpunk tropes, HACK’s visual identity is grounded directly in **Electrical & Computer Engineering (ECE)** and **VLSI (Very Large Scale Integration)** design principles.

The aesthetic models the physical artifacts of hardware engineering:
- **Printed Circuit Boards (PCBs):** Orthogonal Manhattan routing, solder vias, copper traces, and bus lines.
- **Laboratory Instrumentation:** Oscilloscope logic probes, digital clock pulses ($CLK$), signal test leads, and capacitive touch feedback.
- **Integrated Circuit (IC) Packages:** Silicon dies, pad rings, lead frames, and surface-mount package pins.
- **Tactile Industrial Precision:** Hairline 1px borders, tight mathematical radiuses (`4px`–`10px`), monospace technical notations, and high-contrast typography.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHYSICAL EMBLEM                                 │
│  Robot Arm (Blue)  •  Base Triangle (Indigo)  •  Gear Ring (Cyan)      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       DIGITAL DESIGN SYSTEM                            │
│  Manhattan PCB Grid  •  Logic Probe Cursor  •  Silicon Die Art (VLSI)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Color System & Design Tokens

All colors in the design system are mathematically sampled from the physical HACK insignia (`public/hack_logo.jpg`) and defined as CSS custom properties in [`src/styles/tokens.css`](file:///src/styles/tokens.css).

### Brand Palette

| Token | Hex Value | Role in Hardware Identity |
| :--- | :--- | :--- |
| `--blue-600` | `#1672c4` | **Primary Brand Accent**: The robot-arm blue from the emblem. Used for active states, key CTAs, and primary signals. |
| `--blue-700` | `#0f5a9e` | **Interactive Hover**: Deepened primary blue for hover and focus states. |
| `--indigo-600` | `#34509f` | **Emblem Indigo**: The triangular delta base of the logo. |
| `--navy-900` | `#0f1b3d` | **Deep Ink Navy**: Emblem indigo taken down to dark room depth. Used for high-contrast dark sections, hero backgrounds, and card backdrops. |
| `--cyan-500` | `#38b8cc` | **Gear Cyan**: The gear teeth in the logo. Reserved for high-frequency electrical pulses, logic probe rings, and active signal highlights. |
| `--cyan-700` | `#157f92` | **Deep Cyan**: Accessible contrast cyan used for typography and badges on light backgrounds. |
| `--sky-300` | `#9ad8e8` | **Pale Sky**: Low-voltage signal traces, secondary die metallization layers. |
| `--sky-100` | `#e3f4f8` | **Signal Frost**: Subtle badge and card hover highlights. |

### Surface & Typography Tokens

| Token | Value | Application |
| :--- | :--- | :--- |
| `--ink` | `var(--navy-900)` (`#0f1b3d`) | Primary high-contrast body and heading text. |
| `--ink-2` | `#3f4c73` | Secondary text, captions, and muted labels. |
| `--ink-3` | `#647093` | Metadata, timestamps, and tertiary notations. |
| `--bg` | `#ffffff` | Primary clean surface. |
| `--bg-soft` | `#f5f9fc` | Secondary section background and container fill. |
| `--bg-tint` | `#eaf3f9` | Accent tinted background for callouts and active filters. |
| `--line` | `#dde7f0` | 1px hairline boundary line between components. |
| `--line-strong`| `#bccbdd` | Emphasized structural borders. |

### Spatial & Geometry Tokens

```css
/* Corner Radiuses: Deliberately geometric; pill shapes are reserved exclusively for tags */
--r-xs: 4px;
--r-sm: 6px;
--r-md: 10px;
--r-lg: 14px;
--r-pill: 999px;

/* Spacing Scale (4px Base Grid) */
--s-1: 4px;   --s-2: 8px;   --s-3: 12px;  --s-4: 16px;
--s-5: 24px;  --s-6: 32px;  --s-7: 48px;  --s-8: 64px;
--s-9: 96px;  --s-10: 128px;
```

---

## 3. Typography System

The typography pairs an expressive, mechanical display grotesque with a hyper-readable grotesque for body copy, anchored by a monospace font for technical specifications.

1. **Display Headings (`--font-display`):** `Bricolage Grotesque`
   - Expressive geometric proportions with retro-futuristic mechanical ink traps that evoke electronic manuals and schematics.
2. **Body Copy (`--font-body`):** `Instrument Sans`
   - Highly legible grotesque with clean horizontal terminals and neutral cadence, maintaining legibility on high-density information displays.
3. **Technical Specs & Code (`--font-mono`):** `JetBrains Mono`
   - Monospace font designed for code reading, register addresses, hash values, student batch codes (`2k21`, `2k22`), and pin labels.

---

## 4. The Interactive Canvas: PCB Trace Router (`CircuitBackground.tsx`)

The animated circuit background is rendered via a custom HTML5 `<canvas>` component ([`src/components/CircuitBackground.tsx`](file:///src/components/CircuitBackground.tsx)), operating in two variants: `'page'` (fixed viewport background) and `'hero'` (localized high-contrast banner).

```
          [Cell: 48px]
     ┌─────────┬─────────┐
     │  Via ●──┼─────────┤ ──> Signal Packet (moving dot)
     │         │         │
     ├─────────┼──● Via  │
     │         │    │    │
     │  Trace  └───-┘    │ ──> Capacitive Tether to Cursor
     └───────────────────┘
```

### Trace Generation Algorithm
Traces are procedurally generated across a grid of orthogonal cells:
- **Grid Cell Size:** `CELL = 48px`.
- **Trace Count:** Calculated dynamically: $\text{count} = \min\left(34, \max\left(10, \text{round}\left(\frac{\text{cols} \times \text{rows}}{22}\right)\right)\right)$.
- **Manhattan Routing:** Traces alternate between horizontal and vertical segments at exact $90^\circ$ angles with 3 to 5 bends per trace.
- **Through-Hole Vias:** At the start and end of each trace, a copper via pad is drawn: a filled rectangle (`7x7px`) bordered by a `6x6px` outline ring.

### Signal Propagation
- Digital packets travel along the copper paths with randomized velocities:
  $$\text{speed} = 40 + \text{random}() \times 50 \text{ px/sec}$$
- When a packet reaches the end of its trace, it enters a `240px` cooldown phase before cycling again, mimicking bursty packet bus traffic.

### Capacitive Probing & Cursor Snapping
- **Proximity Sensor:** As the mouse moves, the system checks Euclidean distance to all trace vias and corners:
  $$d = \sqrt{(p_x - x_{\text{cursor}})^2 + (p_y - y_{\text{cursor}})^2}$$
- **Tethering (< 150px):** If $d < 150\text{px}$, a signal wire dynamically tethers from the via to the cursor:
  $$\alpha = 1 - \frac{d}{150}$$
  The via pad illuminates in cyan (`rgba(56, 184, 204, 0.75 * \alpha)`) and draws an oscilloscope lead to the cursor.
- **Trace Snapping Trail:** Cursor trail points snap to a fine `14px` grid:
  $$\text{snapped}_x = \text{round}\left(\frac{x}{14}\right) \times 14, \quad \text{snapped}_y = \text{round}\left(\frac{y}{14}\right) \times 14$$
  The trail renders with a horizontal-first right-angle route, making mouse movement look like real-time PCB trace layout routing.

---

## 5. Micro-interactions: Logic Probe & Pin Discharges

### A. The Logic Analyzer Probe (`.probe`)
Instead of a generic mouse pointer, fine-pointer desktop browsers render an interactive logic probe ([`src/styles/base.css`](file:///src/styles/base.css#L400)):

- **Easing Follower:** Follows the mouse cursor with a smooth linear interpolation easing factor of `0.4`:
  $$x_{t} = x_{t-1} + (x_{\text{target}} - x_{t-1}) \times 0.4$$
- **Clock Line Pulse (`probe-pulse`):** The four bracketed crosshairs pulse periodically over **1.4 seconds** (`infinite`), simulating a hardware clock signal ($CLK$).
- **Shift Register Orbit (`probe-orbit`):** A single bit dot (`5x5px`, `--blue-600`) runs laps around the probe perimeter over **1.6 seconds**.
- **Active Inspection State:** When hovering over interactive elements (`a, button, input, .member`):
  - Brackets expand from `15px` to `24px` inset.
  - Brackets rotate by $45^\circ$.
  - Orbit velocity accelerates from `1.6s` to `0.9s` (indicating high-frequency bus activity).
- **Probing Contact (`is-down`):** On mouse button press, brackets contract inward to `9px`, indicating physical probe tip contact.

```
      Normal State                  Hover (Inspecting)              Contact (Click)
    ┌───        ───┐                 \            /                    ┌─    ─┐
                                      ───      ───
    │    ● (CLK)   │                      (45°)                        │  ●   │
                                      ───      ───
    └───        ───┘                 /            \                    └─    ─┘
     [15px / 1.4s]                    [24px / 0.9s]                      [9px]
```

### B. The Click Burst / Pin Discharge (`.spark`)
When the user clicks, an Integrated Circuit (IC) package discharge fires both on the canvas and in the DOM:

1. **Wavefront Shockwaves:** Two concentric square wavefront rings (`spark__ring` and `spark__ring--late`) expand outward up to `1.9x` scale with quadratic cubic-bezier easing.
2. **Silicon Core Flash:** The central die core (`spark__core`) flashes cyan, scales down, and rotates $90^\circ$.
3. **8 IC Lead Frame Pins:** Eight miniature pins (`spark__pin`) burst outward along the 4 cardinal axes ($0^\circ, 90^\circ, 180^\circ, 270^\circ$) with $\pm 7\text{px}$ offsets:
   $$\text{Pin Angles} = \{0^\circ, 0^\circ, 90^\circ, 90^\circ, 180^\circ, 180^\circ, 270^\circ, 270^\circ\}$$
4. **Canvas Shockwave:** Two square wavefronts propagate along the PCB canvas grid lines, firing light pulses down the $X$ and $Y$ axes.

---

## 6. Procedural Silicon Die Art (`DieArt.tsx`)

For members without portrait photos, hero graphics, and membership registration passes, [`src/components/DieArt.tsx`](file:///src/components/DieArt.tsx) generates **deterministic SVG microarchitectural silicon die floorplans**.

```
┌─────────────────────────────────────────────────────────────┐
│ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ │ <── I/O Pad Ring
│ █ ┌─────────────────────────────────────────────────────┐ █ │
│ █ │ [Core ALU Tile]       │       [L2 Cache Array]      │ █ │
│ █ │                       │                             │ █ │
│ █ ├───────────────────────┼─────────────────────────────┤ █ │
│ █ │ [Register File]       │       [Interconnect Bus]    │ █ │
│ █ └─────────────────────────────────────────────────────┘ █ │
│ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ │
└─────────────────────────────────────────────────────────────┘
```

### Deterministic PRNG: Mulberry32
To ensure consistent rendering across server builds and client hydrations without layout shifts, `DieArt` uses the **Mulberry32** pseudo-random number generator algorithm:

```typescript
function mulberry32(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

### Algorithmic Name Hashing
For executive board members (e.g. `Tasmir Hossain Zihad`, `Bandhon Kumar Sutrodhar`, `Arnob Dam`), seeds and color hues are derived deterministically from the string hash of their full name:

1. **Seed Generation (`getNameSeed`):** Computes a 32-bit polynomial rolling hash of the member name.
2. **Hue Derivation (`getHueFromName`):** Modulo maps the name hash across brand hues (`'navy' | 'blue' | 'cyan' | 'sky'`).
3. **Monogram Initials:** Extracts two capital initials (e.g., `"TZ"`, `"BS"`, `"AD"`) overlaid onto the center of the silicon die with high-contrast text.

### SVG Microarchitecture Layers
Each die renders authentic VLSI floorplan elements:
- **Substrate & Package Base:** Dark tinted die boundary with micro-bevels.
- **I/O Bond Pad Ring:** Regularly spaced square bonding pads around the die perimeter for package wire bonding.
- **Execution Cores:** 3 to 6 major functional blocks representing ALUs, vector pipelines, and instruction caches.
- **Cache Sub-arrays:** Dense parallel striping representing SRAM bitcell arrays.
- **Power & Clock Grid:** Hairline orthogonal distribution buses cutting across the chip surface.

---

## 7. Performance & Accessibility Guarantees

1. **Zero Layout Shift (CLS = 0):**
   - The typewriter effect (`Typewriter`) pre-reserves untyped characters with `visibility: hidden`, preventing header reflow during animation.
   - All images and canvas elements enforce strict CSS `aspect-ratio` tokens.
2. **Reduced Motion Mode (`prefers-reduced-motion`):**
   - When the user enables reduced motion in their OS:
     - `CircuitBackground` renders a single static snapshot of the PCB traces and stops the `requestAnimationFrame` loop.
     - The logic probe follower (`.probe`) is completely removed from the DOM.
     - Click sparks (`.spark`) and typewriter transitions are immediately bypassed.
3. **Double Buffering & CPU Throttling:**
   - The circuit board lines and vias are pre-rendered onto an off-screen canvas buffer (`board`) once on resize, avoiding costly path recalculations on every frame.
   - Animation loop is capped at $\sim$30fps (`now - last < 32ms`) and automatically pauses when the browser tab loses visibility (`document.hidden`).

---

## 8. Summary of File Architecture

```text
src/
├── styles/
│   ├── tokens.css           # Global design tokens (colors, spacing, radiuses, shadows)
│   ├── base.css             # Logic probe (.probe), sparks (.spark), typography, resets
│   ├── components.css       # Navigation, buttons, cards, dev-banner, footer
│   └── pages.css            # Route layouts (executive board, registration, hero)
└── components/
    ├── CircuitBackground.tsx # HTML5 canvas PCB trace & signal simulation
    ├── DieArt.tsx            # Procedural Mulberry32 silicon die SVG generator
    ├── motion.tsx            # Typewriter & IntersectionObserver scroll reveals
    └── MemberPass.tsx        # High-res SVG/Canvas physical membership pass
```
