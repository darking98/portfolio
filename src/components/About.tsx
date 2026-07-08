'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FG     = '#2a1a14'
const MUTED  = '#8a7a70'
const ACCENT = '#6B3040'

const LABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.6rem',
  letterSpacing: '0.18em',
  color: MUTED,
  textTransform: 'uppercase',
}

// Acto 1 — statement (mask reveal por líneas)
const STATEMENT: { text: string; accent?: boolean }[] = [
  { text: 'I engineer web products' },
  { text: 'at scale —' },
  { text: 'real-time systems,', accent: true },
  { text: 'AI-first interfaces.', accent: true },
]

// Acto 2 — stack por categorías
const STACK: { cat: string; items: string[] }[] = [
  { cat: 'Frontend', items: ['React', 'Next.js', 'React Native', 'TypeScript', 'Tailwind', 'Chakra UI'] },
  { cat: 'State & Testing', items: ['Zustand', 'React Query', 'Zod', 'Cypress', 'Jest', 'Storybook'] },
  { cat: 'Backend & Infra', items: ['Node.js', 'Nest.js', 'PostgreSQL', 'Supabase', 'Docker', 'GCP'] },
  { cat: 'AI', items: ['LLMs', 'AI Agents', 'MCP', 'Prompting', 'SSE'] },
]

const LINKS: { label: string; href: string }[] = [
  { label: 'Email',    href: 'mailto:me@diegogabrielrodriguez.com' },
  { label: 'GitHub',   href: 'https://github.com/darking98' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/diego-gabriel-rodriguez' },
  { label: 'Website',  href: 'https://www.diegogabrielrodriguez.com' },
]

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null)
  const act1Ref     = useRef<HTMLDivElement>(null)
  const lineRefs     = useRef<(HTMLSpanElement | null)[]>([])
  const act2Ref     = useRef<HTMLDivElement>(null)
  const introRef    = useRef<HTMLDivElement>(null)
  const colRefs     = useRef<(HTMLDivElement | null)[]>([])
  const statusRef   = useRef<HTMLDivElement>(null)
  const svgRef      = useRef<SVGSVGElement>(null)
  const pathRef     = useRef<SVGPathElement>(null)

  useGSAP(() => {
    const path = pathRef.current
    if (path) {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    }
    gsap.set(act2Ref.current, { autoAlpha: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })

    // ── Acto 1: statement, mask reveal por líneas ──
    tl.to(pathRef.current, { strokeDashoffset: 0, duration: 1.4, ease: 'none' }, 0)
    tl.from(lineRefs.current, {
      yPercent: 115,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.16,
    }, 0)

    // hold, luego Acto 1 sale
    tl.to(act1Ref.current, {
      autoAlpha: 0, yPercent: -6, filter: 'blur(6px)',
      duration: 0.5, ease: 'power2.in',
    }, 1.3)
    tl.to(svgRef.current, { autoAlpha: 0, duration: 0.4 }, 1.3)

    // ── Acto 2: dossier ──
    tl.set(act2Ref.current, { autoAlpha: 1 }, 1.5)
    tl.from(introRef.current, {
      autoAlpha: 0, y: 26, filter: 'blur(8px)',
      duration: 0.5, ease: 'power3.out',
    }, 1.55)
    tl.from(colRefs.current, {
      autoAlpha: 0, y: 30, filter: 'blur(8px)',
      duration: 0.5, ease: 'power3.out', stagger: 0.14,
    }, 1.8)
    tl.from(statusRef.current, {
      autoAlpha: 0, y: 18,
      duration: 0.45, ease: 'power3.out',
    }, 2.3)
  }, { scope: sectionRef })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '340vh', marginTop: '-100vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Serpentina (acto 1) */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
          viewBox="0 0 1920 1000"
          preserveAspectRatio="xMinYMid slice"
          fill="none"
        >
          <path
            ref={pathRef}
            d="M 0,160 C 300,240 300,420 150,500 S 0,680 190,760 S 420,900 280,1000"
            stroke={ACCENT}
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0.55 }}
          />
        </svg>

        {/* ── ACTO 1 — Statement ── */}
        <div
          ref={act1Ref}
          className="absolute inset-0 flex items-center"
          style={{ zIndex: 3 }}
        >
          <div className="w-full max-w-7xl mx-auto px-10 md:px-20">
            {STATEMENT.map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <span
                  ref={(el) => { lineRefs.current[i] = el }}
                  className="block"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 5.5rem)',
                    fontWeight: 400,
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    color: line.accent ? ACCENT : FG,
                  }}
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTO 2 — Dossier ── */}
        <div
          ref={act2Ref}
          className="absolute inset-0 flex items-center"
          style={{ zIndex: 2 }}
        >
          <div className="w-full max-w-7xl mx-auto px-10 md:px-20 flex flex-col gap-16">

            {/* Intro */}
            <div ref={introRef} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-16 items-start">
              <span style={{ ...LABEL, opacity: 0.6, paddingTop: '0.4rem' }}>01 / About</span>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
                fontWeight: 400,
                color: FG,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
                maxWidth: '640px',
              }}>
                Frontend engineer with 5+ years building complex apps in
                Fintech &amp; iGaming — international payments, real-time
                dashboards and high-concurrency platforms. Now going
                <span style={{ color: ACCENT }}> AI-first</span>: agents,
                LLM-based systems and MCP to orchestrate models, context
                and tools.
              </p>
            </div>

            {/* Stack grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {STACK.map((col, i) => (
                <div key={col.cat} ref={(el) => { colRefs.current[i] = el }}>
                  <div
                    className="pb-3 mb-4"
                    style={{ borderBottom: `1px solid ${ACCENT}22` }}
                  >
                    <span style={LABEL}>{col.cat}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {col.items.map((it) => (
                      <li key={it} style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.92rem',
                        color: FG,
                        opacity: 0.85,
                      }}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Status */}
            <div
              ref={statusRef}
              className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 pt-6"
              style={{ borderTop: `1px solid ${ACCENT}22` }}
            >
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex items-center gap-2.5">
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#7d9b6a',
                    display: 'inline-block',
                  }} />
                  <span style={LABEL}>Available for work</span>
                </div>
                <span style={LABEL}>Buenos Aires, ARG</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {LINKS.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                    style={{ ...LABEL, color: ACCENT, textDecoration: 'none' }}
                    className="pointer-events-auto hover:opacity-70 transition-opacity"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
