import { useEffect, useSyncExternalStore } from 'react'

interface HeroFont {
  family: string
  weight: number
  text: string
  /** multiplier on the base size, so wide and condensed faces look equally big */
  scale: number
  spacing?: string
}

const fonts: HeroFont[] = [
  // the original
  { family: 'var(--mono)', weight: 700, text: 'kill', scale: 1, spacing: '-0.04em' },
  { family: "'Anton', sans-serif", weight: 400, text: 'KILL', scale: 1.25 },
  { family: "'League Gothic', sans-serif", weight: 400, text: 'KILL', scale: 1.5 },
  { family: "'Big Shoulders Display', sans-serif", weight: 900, text: 'KILL', scale: 1.4 },
  { family: "'Archivo Black', sans-serif", weight: 400, text: 'KILL', scale: 1 },
  { family: "'Unbounded', sans-serif", weight: 800, text: 'KILL', scale: 0.8 },
  { family: "'Syne', sans-serif", weight: 800, text: 'KILL', scale: 1.1 },
  { family: "'JetBrains Mono', monospace", weight: 800, text: 'KILL', scale: 1 },
  { family: "'Bodoni Moda', serif", weight: 900, text: 'KILL', scale: 1.1 },
]

// one shared index so "kill" and "havoc" always show the same face
let index = 0
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => void listeners.delete(cb)
}
const next = () => {
  index = (index + 1) % fonts.length
  listeners.forEach((cb) => cb())
}

const INTRO_MS = 5500 // the intro overlay is gone by then
const STEP_MS = 2000
let timer = 0
// (re)start the shared 2s loop, so a click gets a full 2s before the next automatic change
const restart = () => {
  window.clearInterval(timer)
  timer = window.setInterval(next, STEP_MS)
}
const click = () => {
  next()
  restart()
}

export default function Hero({ word = 'kill' }: { word?: string }) {
  const i = useSyncExternalStore(subscribe, () => index)
  const label = (x: HeroFont) => (x.text === 'kill' ? word : word.toUpperCase())

  // download every font up front (during the intro) so a swap never waits on the network
  // (var(--mono) is not a loadable face, and one rejection must not skip waiting for the rest)
  useEffect(() => {
    fonts
      .filter((f) => !f.family.startsWith('var('))
      .forEach((f) => document.fonts.load(`${f.weight} 100px ${f.family}`, label(f)).catch(() => {}))

    // both words share one timer, started once the intro is over
    const start = window.setTimeout(() => {
      if (!timer) restart()
    }, INTRO_MS)
    return () => {
      window.clearTimeout(start)
      if (listeners.size === 0) {
        window.clearInterval(timer)
        timer = 0
      }
    }
  }, [])

  const f = fonts[i]
  return (
    <section className="hero" onClick={click}>
      <h1
        style={{
          fontFamily: f.family,
          fontWeight: f.weight,
          letterSpacing: f.spacing ?? '0',
          fontSize: `calc(clamp(40px, 9vw, 112px) * ${f.scale})`,
          // fixed box so the page doesn't reflow between faces
          height: 'calc(clamp(40px, 9vw, 112px) * 1.6)',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {label(f)}
      </h1>
    </section>
  )
}
