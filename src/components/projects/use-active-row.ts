import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type RefObject
} from 'react'
import { gsap } from 'gsap'

type Args = {
  sectionRef: RefObject<HTMLElement | null>
  rowRefs: RefObject<(HTMLButtonElement | null)[]>
  previewRef: RefObject<HTMLDivElement | null>
  // Índice inicial (el de retorno del morph inverso, o -1).
  initialActive: number
  // Ref del morph inverso: mientras no se limpió, no tocamos la preview (su
  // posición y `work-media` son parte del snapshot de la transición).
  cleaned: RefObject<boolean>
  // Mobile: la preview es INLINE (fluye en el DOM debajo de la fila) → GSAP no
  // debe posicionarla verticalmente (la descolocaría). Solo detectamos `active`.
  inlinePreview: boolean
}

// Determina la fila "activa" (más cercana al centro del viewport, scroll-driven,
// sin hover) y ancla la preview flotante verticalmente a esa fila. Devuelve el
// índice activo, el binder de la preview y un helper para centrar una fila.
export function useActiveRow({
  sectionRef,
  rowRefs,
  previewRef,
  initialActive,
  cleaned,
  inlinePreview
}: Args) {
  // Proyecto activo = fila más cercana al centro del viewport. -1 mientras la
  // sección no domina el viewport. Al VOLVER de un detalle arranca ya activo en
  // ese proyecto → la preview existe en el primer paint para recibir el morph.
  const [active, setActive] = useState<number>(initialActive)

  // La preview se ancla verticalmente a la fila activa (quickTo, sin re-render).
  // En mobile (inline) NO: la preview fluye en el DOM, solo guardamos el ref.
  const posY = useRef<((v: number) => void) | null>(null)
  const bindPreview = useCallback(
    (el: HTMLDivElement | null) => {
      previewRef.current = el
      if (el && !inlinePreview) {
        // Centrado vertical sobre el propio origen → `y` = centro de la fila.
        gsap.set(el, { yPercent: -50 })
        posY.current = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
      } else {
        posY.current = null
      }
    },
    [previewRef, inlinePreview]
  )

  // Recalcula la fila más cercana al centro en cada scroll/resize (via rAF del
  // ticker de GSAP para no thrashear layout). También reubica la preview.
  useEffect(() => {
    const update = () => {
      // Mientras el morph inverso no se limpió, no toques la preview: su
      // posición y su `work-media` son parte del snapshot de la transición.
      if (!cleaned.current) return
      const rows = rowRefs.current
      if (!rows.length) return
      const center = window.innerHeight / 2
      let best = -1
      let bestDist = Infinity
      // Solo consideramos la sección "en juego" si su centro cae cerca del
      // centro del viewport (evita activar cuando está entrando/saliendo).
      rows.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const mid = r.top + r.height / 2
        const dist = Math.abs(mid - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })

      const sec = sectionRef.current
      const secR = sec?.getBoundingClientRect()
      // La sección tiene que estar razonablemente en pantalla para activar.
      const onScreen =
        secR &&
        secR.top < window.innerHeight * 0.6 &&
        secR.bottom > window.innerHeight * 0.4

      const next = onScreen ? best : -1
      setActive((prev) => (prev === next ? prev : next))

      // Ancla la preview al centro de la fila activa.
      if (next >= 0 && posY.current) {
        const el = rows[next]
        if (el) {
          const r = el.getBoundingClientRect()
          posY.current(r.top + r.height / 2)
        }
      }
    }

    update()
    gsap.ticker.add(update)
    window.addEventListener('resize', update)
    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('resize', update)
    }
  }, [sectionRef, rowRefs, cleaned])

  // Scrollea hasta centrar una fila en el viewport (usado cuando se clickea una
  // fila que aún no está activa).
  const scrollRowToCenter = useCallback(
    (i: number) => {
      const el = rowRefs.current[i]
      if (!el) return
      const r = el.getBoundingClientRect()
      const target =
        window.scrollY + r.top + r.height / 2 - window.innerHeight / 2
      const lenis = (
        window as unknown as {
          lenis?: { scrollTo: (t: number, o?: object) => void }
        }
      ).lenis
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(target, { duration: 0.8 })
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' })
      }
    },
    [rowRefs]
  )

  return { active, bindPreview, scrollRowToCenter }
}
