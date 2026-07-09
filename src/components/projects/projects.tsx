'use client'

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { useTransitionRouter } from 'next-view-transitions'
import { sharedMorph } from '@/lib/transition'
import { saveScroll } from '@/lib/scrollStore'
import { takeWorkReturn } from '@/lib/workReturn'
import { FG, MUTED } from './constants'
import { projects, type Project } from './data'
import { ProjectPreview } from './project-preview'

const ACCENT = '#6B3040'

export default function Projects() {
  const router = useTransitionRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])
  const travelling = useRef(false)

  // Índice del proyecto del que estamos VOLVIENDO (para el morph inverso). Se
  // lee sincrónicamente en el primer render → los view-transition-name ya están
  // aplicados cuando la view transition captura el snapshot de esta página.
  const [returnIdx] = useState<number>(() => {
    const s = takeWorkReturn()
    if (!s) return -1
    return projects.findIndex((p) => p.slug === s)
  })

  // Proyecto activo = fila más cercana al centro del viewport (scroll-driven,
  // sin hover). -1 mientras la sección no domina el viewport. Al VOLVER de un
  // detalle arranca ya activo en ese proyecto → la preview existe en el primer
  // paint para poder recibir el `work-media` del morph inverso.
  const [active, setActive] = useState<number>(returnIdx)

  // Limpia los view-transition-name del morph inverso (título + preview) una vez
  // que el usuario interactúa: si quedan pegados, romperían la próxima ida (dos
  // elementos con el mismo name). Se dispara al primer scroll/mousemove.
  const cleanedReturn = useRef(returnIdx < 0)
  const cleanReturnNames = useCallback(() => {
    if (cleanedReturn.current) return
    cleanedReturn.current = true
    const t = titleRefs.current[returnIdx]
    if (t) t.style.viewTransitionName = ''
    if (previewRef.current) previewRef.current.style.viewTransitionName = ''
  }, [returnIdx])

  // La preview se ancla verticalmente a la fila activa (quickTo, sin re-render).
  const posY = useRef<((v: number) => void) | null>(null)
  const bindPreview = useCallback((el: HTMLDivElement | null) => {
    previewRef.current = el
    if (el) {
      // Centrado vertical sobre el propio origen → `y` = centro de la fila.
      gsap.set(el, { yPercent: -50 })
      posY.current = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    }
  }, [])

  // Recalcula la fila más cercana al centro en cada scroll/resize (via rAF del
  // ticker de GSAP para no thrashear layout). También reubica la preview.
  useEffect(() => {
    const update = () => {
      // Mientras el morph inverso no se limpió, no toques la preview: su
      // posición y su `work-media` son parte del snapshot de la transición.
      if (!cleanedReturn.current) return
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
        secR && secR.top < window.innerHeight * 0.6 && secR.bottom > window.innerHeight * 0.4

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
  }, [])

  // Tilt 3D de la preview siguiendo el mouse. Coords guardadas por evento,
  // aplicadas una vez por rAF (mina #7). quickTo vive en el ticker global →
  // killTweensOf en cleanup para no acumular al remontar.
  const mouse = useRef({ x: 0, y: 0, dirty: false })
  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2' })
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2' })

    const onMove = (e: MouseEvent) => {
      // Primer movimiento tras volver: suelta el morph inverso (limpia names).
      cleanReturnNames()
      // -1..1 relativo al centro del viewport.
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
      mouse.current.dirty = true
    }
    const apply = () => {
      if (mouse.current.dirty) {
        mouse.current.dirty = false
        rotY(mouse.current.x * 9)
        rotX(-mouse.current.y * 9)
      }
    }
    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(apply)
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(apply)
      gsap.killTweensOf(el)
    }
  }, [cleanReturnNames])

  // ── Morph INVERSO (volver del detalle) ──────────────────────────────────
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
  }, [returnIdx])

  // Fallback: si el usuario scrollea sin mover el mouse, también suelta el morph.
  useEffect(() => {
    if (returnIdx < 0) return
    const onScroll = () => cleanReturnNames()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [returnIdx, cleanReturnNames])

  // Scrollea hasta centrar una fila en el viewport (usado cuando se clickea una
  // fila que aún no está activa).
  const scrollRowToCenter = (i: number) => {
    const el = rowRefs.current[i]
    if (!el) return
    const r = el.getBoundingClientRect()
    const target = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(target, { duration: 0.8 })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }

  const onRowClick = (p: Project, i: number) => {
    // 1er click (no activa): scrollea hasta centrarla. 2do click (ya activa):
    // navega al detalle.
    if (active !== i) {
      scrollRowToCenter(i)
      return
    }
    openProject(p, i)
  }

  const openProject = (p: Project, i: number) => {
    if (travelling.current) return
    travelling.current = true
    // Shared elements: el título de esta fila y la preview flotante toman los
    // mismos view-transition-name que el detalle → el browser morphea su
    // posición/tamaño. Los aplicamos imperativamente para que estén presentes
    // en el snapshot de la transición (antes de que React re-renderice).
    const title = titleRefs.current[i]
    if (title) title.style.viewTransitionName = 'work-title'
    if (previewRef.current)
      previewRef.current.style.viewTransitionName = 'work-media'
    saveScroll(window.scrollY)
    router.push(`/work/${p.slug}`, {
      onTransitionReady: sharedMorph,
      scroll: false
    })
  }

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Kicker */}
      <div className="absolute top-24 left-10 md:left-20" style={{ zIndex: 5 }}>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            color: MUTED,
            textTransform: 'uppercase',
            opacity: 0.6
          }}
        >
          03 — Work
        </span>
      </div>

      {/* Lista tipográfica gigante */}
      <div
        className="relative flex flex-col justify-center min-h-screen px-10 md:px-20"
        style={{ paddingTop: '12vh', paddingBottom: '12vh', maxWidth: '52%' }}
      >
        {projects.map((p, i) => {
          const dimmed = active !== -1 && active !== i
          const on = active === i
          // Fila del proyecto del que volvemos: lleva el title-name para el
          // morph inverso (solo en el primer paint tras volver).
          const isReturn = returnIdx === i
          return (
            <button
              key={p.slug}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              onClick={() => onRowClick(p, i)}
              className="group relative flex items-baseline justify-between gap-8 text-left"
              style={{
                background: 'none',
                border: 'none',
                borderTop: `1px solid ${ACCENT}22`,
                padding: 'clamp(1rem, 2.4vh, 2rem) 0',
                cursor: 'pointer',
                opacity: dimmed ? 0.32 : 1,
                transition: 'opacity 0.4s ease'
              }}
            >
              {/* Índice + título */}
              <span className="flex items-baseline gap-6 md:gap-10 min-w-0">
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    color: MUTED,
                    flexShrink: 0
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  ref={(el) => {
                    titleRefs.current[i] = el
                  }}
                  className="leading-none truncate"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(2rem, 6vw, 5.5rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    color: on ? ACCENT : FG,
                    viewTransitionName: isReturn ? 'work-title' : undefined,
                    transform: on ? 'translateX(18px)' : 'translateX(0)',
                    transition:
                      'color 0.35s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)'
                  }}
                >
                  {p.title}
                </span>
              </span>

              {/* Rubro + año + flecha */}
              <span className="flex items-center gap-6 flex-shrink-0">
                <span
                  className="hidden md:block text-right"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.8rem',
                    color: MUTED,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {p.kind}
                  <span style={{ opacity: 0.5 }}> · {p.year}</span>
                </span>
                <span
                  style={{
                    fontSize: '1.4rem',
                    color: ACCENT,
                    opacity: on ? 1 : 0,
                    transform: on ? 'translateX(0)' : 'translateX(-8px)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease'
                  }}
                >
                  ↗
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Preview anclada a la derecha, siguiendo verticalmente la fila activa.
          Centrada sobre su propio origen con yPercent:-50 → `y` = centro de la
          fila. El tilt 3D vive en un wrapper interno con perspective. */}
      <div
        ref={bindPreview}
        className="fixed top-0"
        onClick={() => active !== -1 && openProject(projects[active], active)}
        style={{
          right: 'clamp(3rem, 6vw, 7rem)',
          zIndex: 30,
          width: 'min(34vw, 460px)',
          height: 'min(24vw, 300px)',
          perspective: 900,
          opacity: active !== -1 ? 1 : 0,
          // Solo clickeable cuando hay proyecto activo (si no, no debe robar
          // clicks a las filas de abajo).
          pointerEvents: active !== -1 ? 'auto' : 'none',
          cursor: active !== -1 ? 'pointer' : 'default',
          transition: 'opacity 0.45s ease',
          willChange: 'transform'
        }}
      >
        <div
          ref={tiltRef}
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            scale: active !== -1 ? '1' : '0.92',
            transition: 'scale 0.5s cubic-bezier(0.22,1,0.36,1)'
          }}
        >
          {active !== -1 && <ProjectPreview project={projects[active]} />}
        </div>
      </div>
    </section>
  )
}
