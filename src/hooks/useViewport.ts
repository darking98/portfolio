'use client'

import { useEffect, useState } from 'react'

// Breakpoints canónicos del proyecto — ÚNICA fuente de verdad, espejada en
// globals.css (@theme). Si cambiás uno, cambialo en ambos lados.
export const BREAKPOINTS = {
  /** < 768px: teléfonos. */
  mobile: 768,
  /** 768–1023px: tablets / portrait ancho. */
  tablet: 1024,
} as const

export interface Viewport {
  /** width < 768 */
  isMobile: boolean
  /** 768 ≤ width < 1024 */
  isTablet: boolean
  /** width ≥ 1024 (el diseño "original") */
  isDesktop: boolean
  /** alto > ancho — clave para reencuadrar 3D y apilar layouts */
  isPortrait: boolean
  /** dispositivo táctil sin puntero fino → desactivar parallax de mouse */
  isTouch: boolean
}

// Default desktop (el diseño canónico). Es también el valor del PRIMER render
// en cliente: así el markup inicial coincide con el SSR y no hay hydration
// mismatch. El efecto corrige al viewport real inmediatamente después.
const DEFAULT: Viewport = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isPortrait: false,
  isTouch: false,
}

function read(): Viewport {
  if (typeof window === 'undefined') return DEFAULT
  const w = window.innerWidth
  return {
    isMobile: w < BREAKPOINTS.mobile,
    isTablet: w >= BREAKPOINTS.mobile && w < BREAKPOINTS.tablet,
    isDesktop: w >= BREAKPOINTS.tablet,
    isPortrait: window.matchMedia('(orientation: portrait)').matches,
    isTouch: window.matchMedia('(hover: none) and (pointer: coarse)').matches,
  }
}

export function useViewport(): Viewport {
  // Arranca en DEFAULT en cliente y server → hidratación consistente.
  const [vp, setVp] = useState<Viewport>(DEFAULT)

  useEffect(() => {
    const update = () => setVp((prev) => {
      const next = read()
      // Evita re-render si nada cambió (el resize dispara muy seguido).
      for (const k in next) {
        if (next[k as keyof Viewport] !== prev[k as keyof Viewport]) return next
      }
      return prev
    })
    // Corrige al viewport real en el primer commit del cliente (post-hidratación).
    update()

    // resize (throttled a rAF) además de matchMedia: los `change` de matchMedia
    // solo disparan al CRUZAR un umbral; arrastrar el viewport en devtools puede
    // cambiar la orientación sin cruzar ningún breakpoint de ancho → el avatar
    // quedaba con el encuadre viejo. resize cubre todo cambio de tamaño.
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return vp
}
