import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'

type TiltOptions = {
  /** Grados máximos de rotación (default 9, como la preview de Work). */
  max?: number
  /** Duración del easing del quickTo (default 0.5). */
  duration?: number
  /** Si el tilt está activo (para pausarlo). Default true. */
  enabled?: boolean
  /** Callback en el primer movimiento (ej. limpiar un morph). Opcional. */
  onFirstMove?: () => void
}

// Tilt 3D por mouse sobre un elemento (rotationX/Y siguiendo el cursor).
// Reutiliza el patrón de la preview de Work. Minas cuidadas:
//  - coords guardadas por evento y aplicadas 1×/rAF (no encolar tweens por
//    evento) — mina #7.
//  - quickTo vive en el ticker global → killTweensOf en cleanup para no
//    acumular al remontar.
// El elemento necesita un ancestro con `perspective` y él mismo
// `transform-style: preserve-3d` para que el tilt se vea en 3D.
export function useTilt(
  ref: RefObject<HTMLElement | null>,
  { max = 9, duration = 0.5, enabled = true, onFirstMove }: TiltOptions = {}
) {
  const mouse = useRef({ x: 0, y: 0, dirty: false })
  const firstMove = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const rotX = gsap.quickTo(el, 'rotationX', { duration, ease: 'power2' })
    const rotY = gsap.quickTo(el, 'rotationY', { duration, ease: 'power2' })

    const onMove = (e: MouseEvent) => {
      if (firstMove.current) {
        firstMove.current = false
        onFirstMove?.()
      }
      // -1..1 relativo al centro del viewport
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
      mouse.current.dirty = true
    }
    const apply = () => {
      if (!mouse.current.dirty) return
      mouse.current.dirty = false
      rotY(mouse.current.x * max)
      rotX(-mouse.current.y * max)
    }

    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(apply)
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(apply)
      gsap.killTweensOf(el)
    }
  }, [ref, max, duration, enabled, onFirstMove])
}
