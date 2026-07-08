'use client'

import { useTransitionRouter } from 'next-view-transitions'
import type { Project, ProjectDetail } from '@/components/projects/data'
import { ProjectPreview } from '@/components/projects/project-preview'
import { sharedMorphBack } from '@/lib/transition'
import { useScrollTop } from '@/lib/useScrollTop'
import { setWorkReturn } from '@/lib/workReturn'

// Misma paleta que el resto (Background global pastel detrás → fondo transparente).
const FG = '#2a1a14'
const MUTED = '#8a7a70'
const ACCENT = '#6B3040'

type Props = {
  project: Project
  detail: ProjectDetail
}

export function WorkPage({ project, detail }: Props) {
  useScrollTop()
  const router = useTransitionRouter()
  const goBack = () => {
    // Recuerda el proyecto para el morph inverso (la vitrina reasigna los
    // view-transition-name a esta fila al remontar).
    setWorkReturn(project.slug)
    router.push('/', { onTransitionReady: sharedMorphBack, scroll: false })
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ color: FG }}
    >
      <div className="relative max-w-6xl mx-auto px-10 md:px-16 py-24 md:py-32">
        {/* Volver */}
        <button
          onClick={goBack}
          className="mb-16 inline-flex items-center gap-2"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: MUTED,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ← Back to work
        </button>

        {/* Encabezado */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.68rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: MUTED,
            marginBottom: '1.2rem'
          }}
        >
          {project.kind} · {project.year}
        </div>

        <h1
          className="leading-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: FG,
            // Shared element: morphea desde el título de la fila en la vitrina
            viewTransitionName: 'work-title'
          }}
        >
          {project.title}
        </h1>
        <div
          className="mt-3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
            color: ACCENT,
            letterSpacing: '-0.01em'
          }}
        >
          {detail.role}
        </div>

        {/* Hero visual del proyecto (el mismo preview generativo, en grande).
            Shared element: morphea desde la preview flotante de la vitrina. */}
        <div
          className="mt-14 w-full"
          style={{
            height: 'clamp(240px, 42vh, 520px)',
            viewTransitionName: 'work-media'
          }}
        >
          <ProjectPreview project={project} />
        </div>

        {/* Métricas */}
        <div className="mt-14 flex flex-wrap gap-x-16 gap-y-8">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  fontWeight: 600,
                  color: FG,
                  letterSpacing: '-0.03em',
                  lineHeight: 1
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: MUTED,
                  marginTop: '0.5rem'
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Intro */}
        <p
          className="mt-16"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(1.1rem, 1.6vw, 1.45rem)',
            lineHeight: 1.6,
            color: FG,
            maxWidth: 720,
            opacity: 0.9
          }}
        >
          {detail.intro}
        </p>

        {/* Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: MUTED,
              paddingTop: '0.4rem'
            }}
          >
            Highlights
          </span>
          <ul className="flex flex-col gap-5">
            {detail.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-baseline gap-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                  color: FG,
                  opacity: 0.88
                }}
              >
                <span style={{ color: ACCENT, fontSize: '0.7rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Stack */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: MUTED,
              paddingTop: '0.4rem'
            }}
          >
            Stack
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {detail.stack.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                  color: FG,
                  opacity: 0.85
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Links (opcional) */}
        {detail.links && detail.links.length > 0 && (
          <div className="mt-20 flex flex-wrap gap-6">
            {detail.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: ACCENT,
                  textDecoration: 'underline',
                  textUnderlineOffset: '5px'
                }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
