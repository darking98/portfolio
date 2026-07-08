'use client'

import { useEffect } from 'react'

interface Lenis {
  scrollTo: (t: number, o?: object) => void
  resize: () => void
}

// Resetea el scroll al top al montar una ruta de detalle. Con router.push(...,
// { scroll: false }) Next NO resetea el scroll, y Lenis conserva la posición
// del documento anterior → la página nueva aparece scrolleada. Reseteamos tanto
// window como Lenis (que gobierna el scroll real).
export function useScrollTop() {
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.resize()
      lenis.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [])
}
