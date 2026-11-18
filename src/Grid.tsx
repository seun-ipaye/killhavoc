import { useEffect, useRef, useState } from 'react'
import { columns, type Tile } from './tiles'

const NAV = 96 // px, keep in sync with --nav in index.css
const STACK_BELOW = 900 // px, below this width the grid stacks vertically

type Mode = 'pinned' | 'scroll' | 'stack'

function TileView({ tile }: { tile: Tile }) {
  const style = {
    background: tile.color,
    flexGrow: tile.flex,
    '--ar': tile.ar,
  } as React.CSSProperties
  const className = `tile${tile.light ? ' tile-light' : ''}`
  const body = (
    <>
      {tile.kind !== 'static' && <span className="tile-arrow">↗</span>}
    </>
  )
  if (tile.kind === 'link')
    return <a className={className} style={style} href={tile.href}>{body}</a>
  if (tile.kind === 'button')
    return <button className={className} style={style} type="button">{body}</button>
  return <div className={className} style={style}>{body}</div>
}

export default function Grid() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('scroll')

  // Decide which layout fits the current window.
  useEffect(() => {
    const decide = () => {
      const strip = stripRef.current
      if (!strip) return
      if (window.innerWidth < STACK_BELOW) return setMode('stack')
      // pinned only when the whole grid fits under the nav
      setMode(strip.offsetHeight + NAV <= window.innerHeight ? 'pinned' : 'scroll')
    }
    decide()
    window.addEventListener('resize', decide)
    return () => window.removeEventListener('resize', decide)
  }, [])

  // Pinned: turn vertical scrolling into sideways movement.
  useEffect(() => {
    const wrap = wrapRef.current
    const scroller = scrollerRef.current
    const strip = stripRef.current
    if (!wrap || !scroller || !strip) return

    strip.style.transform = ''
    wrap.style.height = ''
    scroller.scrollLeft = 0
    if (mode !== 'pinned') return

    let travel = 0
    const measure = () => {
      travel = Math.max(0, strip.scrollWidth - window.innerWidth)
      wrap.style.height = `${strip.offsetHeight + travel}px`
    }
    let raf = 0
    const update = () => {
      raf = 0
      const top = wrap.getBoundingClientRect().top
      const p = travel === 0 ? 0 : Math.min(1, Math.max(0, (NAV - top) / travel))
      strip.style.transform = `translate3d(${-p * travel}px,0,0)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => { measure(); update() }

    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [mode])

  return (
    <div className="grid-wrap" ref={wrapRef}>
      <div className="grid-scroller" data-mode={mode} ref={scrollerRef}>
        <div className="grid-strip" ref={stripRef}>
          {columns.map((col, i) => (
            <div className={`col col-${col.size}`} key={i}>
              {col.tiles.map((t, j) => (
                <TileView tile={t} key={j} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
