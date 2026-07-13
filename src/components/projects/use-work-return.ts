import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  type RefObject
} from 'react'
import { gsap } from 'gsap'
import { takeWorkReturn } from '@/lib/workReturn'
import { projects } from './data'

type Args = {
  previewRef: RefObject<HTMLDivElement | null>
  // Limpia los view-transition-name (título + preview) del morph inverso. Lo
  // provee el orquestador, que muta el `.style` de SUS refs locales (el linter
  // no permite mutar refs pasados como argumento a un hook).
  clearNames: (idx: number) => void
}

// ── Morph INVERSO (volver del detalle de Work) ──────────────────────────────
// Toda la coreografía de shared-elements al VOLVER de un detalle:
//  - `returnIdx`: índice del proyecto del que volvemos (leído sincrónicamente en
//    el primer render → los view-transition-name ya están en el snapshot).
//  - En el primer layout, ancla la preview sobre la fila que vuelve y le asigna
//    `work-media` → el browser morphea la imagen del detalle a la vitrina.
//  - Dispara `clearNames` al primer scroll/mousemove: si los names quedan
//    pegados, romperían la próxima ida (dos elementos con el mismo name).
// Devuelve `returnIdx`, si ya se limpió (`cleaned` ref) y `cleanReturnNames`.
export function useWorkReturn({ previewRef, clearNames }: Args) {
  // Índice del proyecto del que estamos VOLVIENDO (para el morph inverso). Se
  // lee sincrónicamente en el primer render → los view-transition-name ya están
  // aplicados cuando la view transition captura el snapshot de esta página.
  const [returnIdx] = useState<number>(() => {
    const s = takeWorkReturn()
    if (!s) return -1
    return projects.findIndex((p) => p.slug === s)
  })

  // Limpia los view-transition-name del morph inverso (título + preview) una vez
  // que el usuario interactúa: si quedan pegados, romperían la próxima ida (dos
  // elementos con el mismo name). Se dispara al primer scroll/mousemove.
  const cleaned = useRef(returnIdx < 0)
  const cleanReturnNames = useCallback(() => {
    if (cleaned.current) return
    cleaned.current = true
    clearNames(returnIdx)
  }, [returnIdx, clearNames])

  // El título ya lleva `work-title` por render (isReturn). Acá, sincrónicamente
  // en el primer layout (antes del paint que la view transition captura),
  // posicionamos la preview sobre la fila que vuelve y le asignamos `work-media`
  // → el browser morphea también la imagen desde el detalle a su lugar en la
  // vitrina. Luego, cuando el usuario scrollea, ambos names se limpian.
  useLayoutEffect(() => {
    if (returnIdx < 0) return
    const prev = previewRef.current
    if (!prev) return
    // La restauración de scroll (en page.tsx) recentra la fila que vuelve en el
    // viewport → su centro es el centro del viewport. Anclamos la preview ahí
    // (sin inercia): debe estar en su lugar final en el snapshot, no animándose.
    // Usamos innerHeight/2 en vez del rect de la fila porque el scroll se
    // restaura en el layout effect del padre (corre DESPUÉS de este) → el rect
    // todavía estaría desfasado.
    const anchor = () => {
      gsap.set(prev, { yPercent: -50, y: window.innerHeight / 2 })
      prev.style.viewTransitionName = 'work-media'
    }
    anchor()
    // Reafirma tras el paint por si el scroll se asienta un frame después.
    const id = requestAnimationFrame(anchor)
    return () => cancelAnimationFrame(id)
  }, [returnIdx, previewRef])

  // Fallback: si el usuario scrollea sin mover el mouse, también suelta el morph.
  useEffect(() => {
    if (returnIdx < 0) return
    const onScroll = () => cleanReturnNames()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [returnIdx, cleanReturnNames])

  return { returnIdx, cleaned, cleanReturnNames }
}
