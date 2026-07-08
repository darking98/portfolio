'use client'

import { useRef } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { slideUp } from '@/lib/transition'
import { saveScroll } from '@/lib/scrollStore'
import { FG, GAP, MUTED, easeInOutCubic, type Lenis } from './constants'
import { N, projects } from './data'
import { useProjectsCarousel } from './use-projects-carousel'

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const captionRefs = useRef<(HTMLDivElement | null)[]>([])
  const stRef = useRef<ScrollTrigger | null>(null)
  const router = useTransitionRouter()

  // Índice del proyecto centrado actualmente
  const currentIndex = () => {
    const st = stRef.current
    if (!st || st.end === st.start) return 0
    return Math.round(
      ((window.scrollY - st.start) / (st.end - st.start)) * (N - 1)
    )
  }

  // Scroll al snap point del proyecto k → lo expande
  const goToProject = (k: number) => {
    const st = stRef.current
    if (!st) return
    const target = st.start + (k / (N - 1)) * (st.end - st.start)
    // duración proporcional a la distancia (pasos), para que no sea brusco
    const steps = Math.abs(k - currentIndex())
    const duration = Math.min(1.4, 0.5 + steps * 0.28)
    const lenis = (window as unknown as { lenis?: Lenis }).lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(target, { duration, easing: easeInOutCubic })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }

  // Click en un panel: si ya es el activo → navega; si no → lo expande
  const onPanelClick = (i: number) => {
    if (i === currentIndex()) {
      saveScroll(window.scrollY)
      router.push('/work', { onTransitionReady: slideUp })
    } else {
      goToProject(i)
    }
  }

  useProjectsCarousel({ sectionRef, trackRef, panelRefs, captionRefs, stRef })

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Label */}
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

      {/* Track */}
      <div className="absolute inset-0 flex items-center">
        <div
          ref={trackRef}
          className="flex items-center"
          style={{ gap: `${GAP}vw` }}
        >
          {projects.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                panelRefs.current[i] = el
              }}
              onClick={() => onPanelClick(i)}
              className="relative shrink-0 overflow-hidden cursor-pointer"
              style={{
                height: '62vh',
                background: p.img,
                borderRadius: '2px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Captions */}
      <div
        className="absolute bottom-12 left-10 md:left-20"
        style={{ zIndex: 5 }}
      >
        <div className="relative" style={{ height: '3.5rem' }}>
          {projects.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                captionRefs.current[i] = el
              }}
              className="absolute bottom-0 left-0"
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
                  fontWeight: 500,
                  color: FG,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap'
                }}
              >
                {p.title}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem',
                  color: MUTED,
                  marginTop: '0.2rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {p.meta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
