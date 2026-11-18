import { useEffect, useState } from 'react'

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

const INTRO_MS = 8000 // the intro overlay is gone by then
const STEP_MS = 2000

export default function Hero() {
  const [i, setI] = useState(0)

  useEffect(() => {
    let timer = 0
    const start = window.setTimeout(() => {
      setI(1)
      timer = window.setInterval(() => setI((n) => (n + 1) % fonts.length), STEP_MS)
    }, INTRO_MS)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
  }, [])

  const f = fonts[i]
  return (
    <section className="hero">
      <h1
        style={{
          fontFamily: f.family,
          fontWeight: f.weight,
          letterSpacing: f.spacing ?? '0',
          fontSize: `calc(clamp(40px, 9vw, 112px) * ${f.scale})`,
        }}
      >
        {f.text}
      </h1>
    </section>
  )
}
