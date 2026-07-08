'use client'

import { useRef, useState, useCallback } from 'react'
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
  const previewRef = useRef<HTMLDivElement>(null)
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

  const [hovered, setHovered] = useState<number | null>(null)

  // Preview flotante sigue al cursor con inercia (quickTo, sin re-render).
  const posRef = useRef<{ x: (v: number) => void; y: (v: number) => void }>(null)
  const bindPreview = useCallback((el: HTMLDivElement | null) => {
    previewRef.current = el
    if (el) {
      posRef.current = {
        x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
      }
    }
  }, [])

  // Limpia el view-transition-name del título del morph inverso una vez que
  // terminó (si queda pegado, rompería la próxima ida).
  const cleanedReturn = useRef(false)
  const cleanReturnNames = useCallback(() => {
    if (cleanedReturn.current) return
    cleanedReturn.current = true
    const t = titleRefs.current[returnIdx]
    if (t) t.style.viewTransitionName = ''
  }, [returnIdx])

  const onMouseMove = (e: React.MouseEvent) => {
    posRef.current?.x(e.clientX + 28)
    posRef.current?.y(e.clientY - 140)
    // Al primer movimiento tras volver: limpia el estado de retorno (la preview
    // fantasma vuelve a seguir el cursor normalmente).
    cleanReturnNames()
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
      id="work"
      className="relative w-full min-h-screen overflow-hidden"
      onMouseMove={onMouseMove}
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
        style={{ paddingTop: '12vh', paddingBottom: '12vh' }}
        onMouseLeave={() => setHovered(null)}
      >
        {projects.map((p, i) => {
          const dimmed = hovered !== null && hovered !== i
          const active = hovered === i
          // Fila del proyecto del que volvemos: lleva el title-name para el
          // morph inverso (solo en el primer paint tras volver).
          const isReturn = returnIdx === i
          return (
            <button
              key={p.slug}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              onMouseEnter={() => setHovered(i)}
              onClick={() => openProject(p, i)}
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
                    color: active ? ACCENT : FG,
                    viewTransitionName: isReturn ? 'work-title' : undefined,
                    transform: active ? 'translateX(18px)' : 'translateX(0)',
                    transition: 'color 0.35s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)'
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
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateX(0)' : 'translateX(-8px)',
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

      {/* Preview flotante que sigue al cursor */}
      <div
        ref={bindPreview}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 30,
          width: 'min(34vw, 460px)',
          height: 'min(24vw, 300px)',
          opacity: hovered !== null ? 1 : 0,
          scale: hovered !== null ? '1' : '0.92',
          transition: 'opacity 0.35s ease, scale 0.4s cubic-bezier(0.22,1,0.36,1)',
          willChange: 'transform'
        }}
      >
        {hovered !== null && (
          <div className="relative w-full h-full">
            <ProjectPreview project={projects[hovered]} />
            {/* Métricas superpuestas */}
            <div className="absolute -bottom-4 left-0 flex gap-6 translate-y-full">
              {projects[hovered].metrics.map((m) => (
                <div key={m.label}>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: FG,
                      letterSpacing: '-0.02em',
                      lineHeight: 1
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.62rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: MUTED,
                      marginTop: '0.3rem'
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
