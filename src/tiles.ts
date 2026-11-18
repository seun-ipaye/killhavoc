export type TileKind = 'link' | 'button' | 'static'

export interface Tile {
  /** vertical share of the column on desktop (flex-grow) */
  flex: number
  /** aspect ratio (w / h) used when the grid stacks on small screens */
  ar: number
  color: string
  /** true when the colour is light and needs dark text */
  light?: boolean
  kind: TileKind
  href?: string
}

export interface Column {
  /** n = narrow, w = wide */
  size: 'n' | 'w'
  tiles: Tile[]
}

export const columns: Column[] = [
  { size: 'n', tiles: [
    { flex: 1, ar: 1, color: '#c1121f', kind: 'link', href: '#' },
    { flex: 1.3, ar: 0.8, color: '#e9e9e9', light: true, kind: 'static' },
  ] },
  { size: 'w', tiles: [
    { flex: 1, ar: 1.25, color: '#264653', kind: 'link', href: '#' },
  ] },
  { size: 'n', tiles: [
    { flex: 1.2, ar: 0.75, color: '#6d6875', kind: 'link', href: '#' },
    { flex: 0.8, ar: 1.3, color: '#e07a5f', kind: 'button' },
  ] },
  { size: 'n', tiles: [
    { flex: 1, ar: 0.8, color: '#2a2a2a', kind: 'link', href: '#' },
  ] },
  { size: 'w', tiles: [
    { flex: 1, ar: 1.1, color: '#f2cc8f', light: true, kind: 'link', href: '#' },
  ] },
  { size: 'n', tiles: [
    { flex: 0.8, ar: 1.3, color: '#1d3557', kind: 'static' },
    { flex: 1.2, ar: 0.8, color: '#81b29a', light: true, kind: 'link', href: '#' },
  ] },
  { size: 'n', tiles: [
    { flex: 1, ar: 0.8, color: '#b5838d', kind: 'button' },
  ] },
  { size: 'w', tiles: [
    { flex: 1, ar: 1.25, color: '#111111', kind: 'link', href: '#' },
  ] },
  { size: 'n', tiles: [
    { flex: 1.1, ar: 0.9, color: '#ffb4a2', light: true, kind: 'link', href: '#' },
    { flex: 0.9, ar: 1.2, color: '#c1121f', kind: 'link', href: '#' },
  ] },
  { size: 'n', tiles: [
    { flex: 1, ar: 0.8, color: '#3d405b', kind: 'link', href: '#' },
  ] },
]
