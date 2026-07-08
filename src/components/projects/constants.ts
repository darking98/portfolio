export const FG = '#2a1a14'
export const MUTED = '#8a7a70'

// Medidas del carousel (en vw)
export const SLIVER = 6
export const ACTIVE = 54
export const GAP = 1.4

export interface Lenis {
  scrollTo: (t: number, o?: object) => void
}

// translateX (vw) para centrar el panel activo a
export const trackX = (a: number) => 50 - (a * (SLIVER + GAP) + ACTIVE / 2)

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
