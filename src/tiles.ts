export type TileKind = 'link' | 'button' | 'static'

export interface Tile {
  /** vertical share of the column on desktop (flex-grow) */
  flex: number
  /** aspect ratio (w / h) used when the grid stacks on small screens */
  ar: number
  color: string
  /** true when the colour is light and needs a dark badge/text */
  light?: boolean
  kind: TileKind
  href?: string
  /** design image, shown cover-fit */
  src?: string
  /** show the whole image (letterboxed) instead of cropping to fill */
  contain?: boolean
}

/** two or more small tiles sitting side by side inside a column */
export interface Row {
  row: Tile[]
  flex: number
  /** aspect ratio of each tile in the row on small screens */
  ar: number
}

export type Item = Tile | Row

export interface Column {
  /** n = narrow, m = medium, w = widest */
  size: 'n' | 'm' | 'w'
  items: Item[]
}

export const isRow = (i: Item): i is Row => 'row' in i

// 20 tiles. No tile is the full height of the strip; only two columns hold a
// side-by-side pair of small tiles.
/** mobile: a section is either two columns of tiles (flex = relative height) or one full-width tile */
export type MobileSection =
  | { kind: 'cols'; left: Tile[]; right: Tile[]; ar: number }
  | { kind: 'full'; tile: Tile; ar: number }

const t = (flex: number, color: string, light = false, kind: TileKind = 'static', src?: string): Tile => ({
  flex, ar: 1, color, light: light || undefined, kind, href: kind === 'link' ? '#' : undefined, src,
})

// design image tile (cover-fit on black)
const D = (name: string) => `/designs/${name}`
const img = (flex: number, ar: number, name: string): Tile =>
  ({ flex, ar, color: '#000', kind: 'static', src: D(name) })
// the lego image has a white background, so it can be shown whole without visible bars
const whole = (tile: Tile): Tile => ({ ...tile, color: '#fff', contain: true })
const mi = (flex: number, name: string) => t(flex, '#000', false, 'static', D(name))

export const mobileSections: MobileSection[] = [
  { kind: 'cols', ar: 1 / 1.5,
    left: [mi(1.2, 'society.png'), mi(0.8, 'cleopatra.png'), whole(mi(1, 'lego.jpg'))],
    right: [mi(0.8, 'dark-sonic.jpg'), mi(1.3, 'sons-of-caesar.png'), mi(0.9, 'balcony-window.gif')] },
  { kind: 'full', ar: 1, tile: mi(1, 'spotify.jpg') },
  { kind: 'cols', ar: 1 / 1.1,
    left: [mi(1, 'pixel-balcony.jpg'), mi(1.3, 'blue-lock.jpg')],
    right: [mi(1.4, 'castle.jpg'), mi(0.9, 'boxer.gif'), mi(0.7, 'sword.gif')] },
  { kind: 'full', ar: 2.3, tile: mi(1, 'underpass.gif') },
  { kind: 'cols', ar: 1 / 1.6,
    left: [mi(1.2, 'bright-young-women.jpg'), mi(0.8, 'gif-interview.gif'), mi(1.3, 'i-love-you.jpg')],
    right: [mi(0.8, 'yusuke.jpg'), mi(1.4, 'shadow.jpg'), mi(1, 'red-silhouette.gif')] },
  { kind: 'full', ar: 1.4, tile: mi(1, 'dvd-video.jpg') },
]

export const columns: Column[] = [
  { size: 'w', items: [
    img(0.8, 1.1, 'underpass.gif'),
    img(1.3, 0.75, 'shadow.jpg'),
    img(0.7, 1.3, 'yusuke.jpg'),
  ] },
  { size: 'm', items: [
    img(1.1, 0.8, 'castle.jpg'),
    img(0.9, 1, 'balcony-window.gif'),
  ] },
  { size: 'n', items: [
    { row: [img(1, 0.9, 'dvd-video.jpg'), img(1, 0.9, 'sons-of-caesar.png')], flex: 0.55, ar: 0.9 },
    img(1.2, 0.7, 'pixel-balcony.jpg'),
    img(0.8, 1.2, 'spotify.jpg'),
  ] },
  { size: 'm', items: [
    img(0.8, 1.4, 'red-silhouette.gif'),
    img(1.2, 0.85, 'bright-young-women.jpg'),
  ] },
  { size: 'n', items: [
    img(1.1, 0.8, 'gif-interview.gif'),
    whole(img(0.9, 1, 'lego.jpg')),
    img(0.7, 1.3, 'dark-sonic.jpg'),
  ] },
  { size: 'n', items: [
    img(1, 0.75, 'society.png'),
    { row: [img(1, 0.9, 'cleopatra.png'), img(1, 0.9, 'i-love-you.jpg')], flex: 0.5, ar: 0.9 },
    img(0.9, 0.9, 'boxer.gif'),
  ] },
  { size: 'm', items: [
    img(1.3, 0.8, 'blue-lock.jpg'),
    img(0.7, 1.2, 'sword.gif'),
  ] },
]
