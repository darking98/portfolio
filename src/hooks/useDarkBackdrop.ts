'use client'

import { useEffect, useState } from 'react'

// ¿El fondo detrás de una franja horizontal del viewport (a `probeY` px del top)
// es OSCURO? Fondos oscuros del sitio: la parte final de `#experience-skills`
// (el sky del arco ya oscureció) y `#contact`. La franja se parametriza porque
// cada consumidor vive a distinta altura: el header arriba (~48px), el
// ScrollGuide centrado (~50vh).
//
// `#experience-skills` empieza pastel (solapa el Hero por -100vh) y oscurece por
// scroll. Medido: el sky (radial oscuro) llega a ~0.93 opacidad a ~0.30·vh
// scrolleados dentro de la sección y a 1.0 a ~0.45·vh. Umbral en 0.35·vh → el
// header cambia justo cuando el fondo ya se ve mayormente oscuro (antes usaba
// 0.9·vh y cambiaba tardísimo, recién sobre las estrellas de abajo).
//
// Consolidado desde el Header y el ScrollGuide, que duplicaban esta lógica.
const DARK_ENTER = 0.35 // fracción de vh scrolleada dentro de experience-skills
export function useDarkBackdrop(probeY: number, enabled = true): boolean {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Permite pasar una fracción del viewport (0–1) o px absolutos.
    const resolveY = () =>
      probeY > 0 && probeY <= 1 ? window.innerHeight * probeY : probeY

    const overDark = (id: string, y: number, requireScrolled = false) => {
      const el = document.getElementById(id)
      if (!el) return false
      const r = el.getBoundingClientRect()
      if (!(r.top <= y && r.bottom > y)) return false
      // Para experience-skills: exigir que ya pasamos el tramo pastel inicial
      // (el sky se vuelve oscuro a ~0.35·vh scrolleados dentro de la sección).
      if (requireScrolled && -r.top < window.innerHeight * DARK_ENTER)
        return false
      return true
    }

    const update = () => {
      // Deshabilitado → siempre claro (el reset vive acá, no en el cuerpo del
      // efecto, para no disparar un setState sincrónico de más).
      const y = resolveY()
      const isDark =
        enabled &&
        (overDark('contact', y) || overDark('experience-skills', y, true))
      setDark((prev) => (prev === isDark ? prev : isDark))
    }

    update()
    if (!enabled) return
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [probeY, enabled])

  return dark
}
