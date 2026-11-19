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

const t = (flex: number, color: string, light = false, kind: TileKind = 'link'): Tile => ({
  flex, ar: 1, color, light: light || undefined, kind, href: kind === 'link' ? '#' : undefined,
})

export const mobileSections: MobileSection[] = [
  { kind: 'cols', ar: 1 / 1.5,
    left: [t(1.2, '#c1121f'), t(0.8, '#e9e9e9', true, 'static'), t(1, '#264653')],
    right: [t(0.8, '#3d405b'), t(1.3, '#ffb4a2', true), t(0.9, '#2a2a2a')] },
  { kind: 'full', ar: 1, tile: t(1, '#e07a5f') },
  { kind: 'cols', ar: 1 / 1.1,
    left: [t(1, '#81b29a', true), t(1.3, '#111111')],
    right: [t(1.4, '#6d6875'), t(0.9, '#c1121f', false, 'static'), t(0.7, '#1d3557')] },
  { kind: 'full', ar: 2.3, tile: t(1, '#b5838d') },
  { kind: 'full', ar: 1.5, tile: t(1, '#f2cc8f', true) },
  { kind: 'cols', ar: 1 / 1.35,
    left: [t(0.7, '#e07a5f'), t(1.1, '#264653'), t(0.8, '#ffb4a2', true), t(0.9, '#3d405b')],
    right: [t(1.3, '#e9e9e9', true), t(1, '#81b29a', true), t(1.1, '#c1121f')] },
  { kind: 'full', ar: 1.2, tile: t(1, '#1d3557') },
  { kind: 'cols', ar: 1 / 1.7,
    left: [t(1.2, '#6d6875'), t(0.8, '#e07a5f'), t(1.3, '#111111')],
    right: [t(0.8, '#f2cc8f', true), t(1.2, '#264653'), t(0.8, '#b5838d'), t(0.8, '#2a2a2a')] },
  { kind: 'full', ar: 2, tile: t(1, '#c1121f') },
]

export const columns: Column[] = [
  { size: 'w', items: [
    { flex: 0.8, ar: 1.1, color: '#c1121f', kind: 'link', href: '#' },
    { flex: 1.3, ar: 0.75, color: '#e9e9e9', light: true, kind: 'static' },
    { flex: 0.7, ar: 1.3, color: '#264653', kind: 'link', href: '#' },
  ] },
  { size: 'm', items: [
    { flex: 1.1, ar: 0.8, color: '#3d405b', kind: 'link', href: '#' },
    { flex: 0.9, ar: 1, color: '#ffb4a2', light: true, kind: 'link', href: '#' },
  ] },
  { size: 'n', items: [
    { row: [
      { flex: 1, ar: 0.9, color: '#e07a5f', kind: 'link', href: '#' },
      { flex: 1, ar: 0.9, color: '#81b29a', light: true, kind: 'link', href: '#' },
    ], flex: 0.55, ar: 0.9 },
    { flex: 1.2, ar: 0.7, color: '#2a2a2a', kind: 'link', href: '#' },
    { flex: 0.8, ar: 1.2, color: '#c1121f', kind: 'static' },
  ] },
  { size: 'm', items: [
    { flex: 0.8, ar: 1.4, color: '#b5838d', kind: 'link', href: '#' },
    { flex: 1.2, ar: 0.85, color: '#111111', kind: 'link', href: '#' },
  ] },
  { size: 'n', items: [
    { flex: 1.1, ar: 0.8, color: '#f2cc8f', light: true, kind: 'link', href: '#' },
    { flex: 0.9, ar: 1, color: '#6d6875', kind: 'button' },
    { flex: 0.7, ar: 1.3, color: '#1d3557', kind: 'static' },
  ] },
  { size: 'n', items: [
    { flex: 1, ar: 0.75, color: '#81b29a', light: true, kind: 'link', href: '#' },
    { row: [
      { flex: 1, ar: 0.9, color: '#264653', kind: 'button' },
      { flex: 1, ar: 0.9, color: '#e9e9e9', light: true, kind: 'link', href: '#' },
    ], flex: 0.5, ar: 0.9 },
    { flex: 0.9, ar: 0.9, color: '#e07a5f', kind: 'link', href: '#' },
  ] },
  { size: 'm', items: [
    { flex: 1.3, ar: 0.8, color: '#f2cc8f', light: true, kind: 'link', href: '#' },
    { flex: 0.7, ar: 1.2, color: '#c1121f', kind: 'link', href: '#' },
  ] },
]
