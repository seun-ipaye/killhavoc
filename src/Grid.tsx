import { useEffect, useRef, useState } from 'react'
import { columns, isRow, mobileSections, type Tile } from './tiles'

const NAV = 96 // px, keep in sync with --nav in index.css
const STACK_BELOW = 900 // px, below this width the grid stacks vertically

type Mode = 'pinned' | 'scroll' | 'stack'

function TileView({ tile, ar }: { tile: Tile; ar?: number }) {
  const style = {
    background: tile.color,
    flexGrow: ar === undefined ? tile.flex : 1,
    '--ar': ar ?? tile.ar,
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
      travel = Math.max(0, strip.offsetWidth - document.documentElement.clientWidth)
      wrap.style.height = `${strip.offsetHeight + travel}px`
    }
    const update = () => {
      // always use the live size, so a stale measurement can never leave blank space
      const live = Math.max(0, strip.offsetWidth - document.documentElement.clientWidth)
      if (live !== travel) measure()
      const top = wrap.getBoundingClientRect().top
      const p = travel === 0 ? 0 : Math.min(1, Math.max(0, (NAV - top) / travel))
      strip.style.transform = `translate3d(${-p * travel}px,0,0)`
    }
    const onScroll = () => update()
    const onResize = () => { measure(); update() }

    measure()
    update()
    // the strip's size depends on the window height (svh), so re-measure whenever it changes
    const ro = new ResizeObserver(onResize)
    ro.observe(strip)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [mode])

  return (
    <div className="grid-wrap" ref={wrapRef}>
      <div className="grid-scroller" data-mode={mode} ref={scrollerRef}>
        <div className="grid-strip" ref={stripRef}>
          {columns.map((col, i) => (
            <div className={`col col-${col.size}`} key={i}>
              {col.items.map((item, j) =>
                isRow(item) ? (
                  <div className="row" style={{ flexGrow: item.flex }} key={j}>
                    {item.row.map((t, k) => (
                      <TileView tile={t} ar={item.ar} key={k} />
                    ))}
                  </div>
                ) : (
                  <TileView tile={item} key={j} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="m-grid">
        {mobileSections.map((s, i) =>
          s.kind === 'cols' ? (
            <div className="m-block" style={{ aspectRatio: s.ar }} key={i}>
              <div className="m-col">
                {s.left.map((t, j) => <TileView tile={t} key={j} />)}
              </div>
              <div className="m-col">
                {s.right.map((t, j) => <TileView tile={t} key={j} />)}
              </div>
            </div>
          ) : (
            <div className="m-full" style={{ '--ar': s.ar } as React.CSSProperties} key={i}>
              <TileView tile={s.tile} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}
