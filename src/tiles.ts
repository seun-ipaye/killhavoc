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
