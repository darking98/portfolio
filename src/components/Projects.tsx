'use client'

import { useRef } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { slideUp } from '@/lib/transition'
import { saveScroll } from '@/lib/scrollStore'

gsap.registerPlugin(ScrollTrigger)

const FG = '#2a1a14'
const MUTED = '#8a7a70'

// Medidas del carousel (en vw)
const SLIVER = 6
const ACTIVE = 54
const GAP = 1.4

const projects = [
  {
    title: 'Project Alpha',
    meta: '2025 — Fullstack, UI',
    img: 'linear-gradient(150deg, #6B3040, #2a1a14)'
  },
  {
    title: 'Nebula Studio',
    meta: '2024 — Motion, Three.js',
    img: 'linear-gradient(150deg, #b07050, #6B3040)'
  },
  {
    title: 'Aurora Dashboard',
    meta: '2024 — Data, Next.js',
    img: 'linear-gradient(150deg, #7a4a30, #2a1a14)'
  },
  {
    title: 'Vertex Commerce',
    meta: '2023 — Platform, API',
    img: 'linear-gradient(150deg, #8a7a70, #2a1a14)'
  },
  {
    title: 'Lumen Identity',
    meta: '2023 — Brand, WebGL',
    img: 'linear-gradient(150deg, #6B3040, #b07050)'
  }
]

const N = projects.length

// translateX (vw) para centrar el panel activo a
const trackX = (a: number) => 50 - (a * (SLIVER + GAP) + ACTIVE / 2)

interface Lenis {
  scrollTo: (t: number, o?: object) => void
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

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
      router.push('/example', { onTransitionReady: slideUp })
    } else {
      goToProject(i)
    }
  }

  useGSAP(
    () => {
      // Estado inicial: panel 0 activo
      gsap.set(trackRef.current, { x: `${trackX(0)}vw` })
      panelRefs.current.forEach((p, i) => {
        gsap.set(p, { width: `${i === 0 ? ACTIVE : SLIVER}vw` })
      })
      captionRefs.current.forEach((c, i) => {
        gsap.set(c, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 12 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(N - 1) * 110}%`,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (N - 1),
            duration: { min: 0.2, max: 0.5 },
            ease: 'power2.inOut',
            directional: false
          }
        }
      })
      stRef.current = tl.scrollTrigger ?? null

      for (let k = 1; k < N; k++) {
        const at = k - 1
        tl.to(
          trackRef.current,
          { x: `${trackX(k)}vw`, ease: 'power2.inOut', duration: 1 },
          at
        )
        tl.to(
          panelRefs.current[k - 1],
          { width: `${SLIVER}vw`, ease: 'power2.inOut', duration: 1 },
          at
        )
        tl.to(
          panelRefs.current[k],
          { width: `${ACTIVE}vw`, ease: 'power2.inOut', duration: 1 },
          at
        )
        // caption crossfade
        tl.to(
          captionRefs.current[k - 1],
          { autoAlpha: 0, y: -12, duration: 0.4, ease: 'power2.in' },
          at
        )
        tl.to(
          captionRefs.current[k],
          { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          at + 0.4
        )
      }
    },
    { scope: sectionRef }
  )

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
          02 / Work
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
