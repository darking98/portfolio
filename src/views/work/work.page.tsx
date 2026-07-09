'use client'

import { useRef } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project, ProjectDetail } from '@/components/projects/data'
import { sharedMorphBack } from '@/lib/transition'
import { useScrollTop } from '@/lib/useScrollTop'
import { setWorkReturn } from '@/lib/workReturn'
import { ProjectCover } from './project-cover'

gsap.registerPlugin(ScrollTrigger)

// Misma paleta que el resto (Background global pastel detrás → fondo transparente).
const FG = '#2a1a14'
const MUTED = '#8a7a70'
const ACCENT = '#6B3040'
const HAIR = 'rgba(42, 26, 20, 0.14)'

const KICKER: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.62rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: MUTED
}

const PAD = 'px-6 md:px-12'

type Props = {
  project: Project
  detail: ProjectDetail
}

export function WorkPage({ project, detail }: Props) {
  useScrollTop()
  const router = useTransitionRouter()
  const mainRef = useRef<HTMLElement>(null)
  const goBack = () => {
    // Recuerda el proyecto para el morph inverso (la vitrina reasigna los
    // view-transition-name a esta fila al remontar).
    setWorkReturn(project.slug)
    router.push('/', { onTransitionReady: sharedMorphBack, scroll: false })
  }

  // Reveal por scroll: cada sección `.reveal` hace fade-in + leve subida al
  // entrar en viewport (una sola vez, no scrub). Descubre la data al bajar.
  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>('.reveal')
      els.forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        })
      })
    },
    { scope: mainRef }
  )

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen w-full overflow-x-clip"
      style={{ color: FG }}
    >
      {/* Volver: fijo arriba, sobre el cover oscuro */}
      <button
        onClick={goBack}
        className="cover-back fixed top-8 left-6 md:left-12 z-50 inline-flex items-center gap-2"
        style={{
          ...KICKER,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          color: '#e8e0d5',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          mixBlendMode: 'difference'
        }}
      >
        ← Back to work
      </button>

      {/* ── Portada interactiva 3D (full-screen) ── */}
      <ProjectCover project={project} detail={detail} />

      {/* ── CTA al sitio: banda apenas pasás el cover ── */}
      {detail.links && detail.links.length > 0 && (
        <section
          className={`reveal ${PAD} py-12 md:py-16`}
          style={{ borderBottom: `1px solid ${HAIR}` }}
        >
          <a
            href={detail.links[0].href}
            target="_blank"
            rel="noreferrer"
            className="work-cta group inline-flex items-baseline gap-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
              fontWeight: 500,
              color: FG,
              letterSpacing: '-0.03em',
              lineHeight: 1
            }}
          >
            {detail.links[0].label}
            <span
              className="work-cta-arrow"
              style={{ fontSize: '0.5em', color: ACCENT }}
            >
              ↗
            </span>
          </a>
          <div
            style={{
              ...KICKER,
              marginTop: '1rem',
              letterSpacing: '0.14em',
              color: MUTED
            }}
          >
            {detail.links[0].href.replace(/^https?:\/\//, '')}
          </div>
        </section>
      )}

      {/* ── Overview + Highlights: grid ancho ── */}
      <section
        className={`${PAD} mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-14`}
      >
        <div className="reveal lg:col-span-5">
          <div style={{ ...KICKER, marginBottom: '1.6rem' }}>Overview</div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(1.4rem, 2.2vw, 2.1rem)',
              lineHeight: 1.4,
              color: FG,
              letterSpacing: '-0.015em'
            }}
          >
            {detail.intro}
          </p>
        </div>

        <div className="reveal lg:col-span-6 lg:col-start-7">
          <div style={{ ...KICKER, marginBottom: '1.6rem' }}>Highlights</div>
          <ul className="flex flex-col">
            {detail.highlights.map((h, i) => (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-baseline"
                style={{ paddingBlock: '1.5rem', borderTop: `1px solid ${HAIR}` }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: ACCENT
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.5rem)',
                    lineHeight: 1.4,
                    color: FG,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {h}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stack (frontend / backend): tira meta al pie ── */}
      <section
        className={`reveal ${PAD} mt-16 md:mt-24 mb-20 md:mb-28 pt-10 flex flex-wrap items-start gap-x-24 gap-y-10`}
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {(
          [
            ['Frontend', detail.stack.frontend],
            ['Backend', detail.stack.backend]
          ] as const
        )
          .filter(([, items]) => items.length > 0)
          .map(([label, items]) => (
            <div key={label} className="flex flex-col gap-4">
              <span style={KICKER}>{label}</span>
              <div className="flex flex-wrap gap-x-6 gap-y-2 max-w-xl">
                {items.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                      color: FG,
                      opacity: 0.9
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </section>
    </main>
  )
}
