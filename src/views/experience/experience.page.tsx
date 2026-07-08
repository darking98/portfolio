'use client'

import { useTransitionRouter } from 'next-view-transitions'
import type { Station, ExperienceDetail } from '@/components/about/data'
import { warpOut } from '@/lib/transition'

// Misma paleta que el Hero (el Background global pastel se ve detrás → fondo
// transparente). NO poner background propio: taparía el grain/gradiente global.
const FG = '#2a1a14'
const MUTED = '#8a7a70'
const ACCENT = '#6B3040'

type Props = {
  station: Station
  detail: ExperienceDetail
}

// View pura: recibe la data ya resuelta por el server component y la pinta.
export function ExperiencePage({ station, detail }: Props) {
  const router = useTransitionRouter()

  const goBack = () =>
    router.push('/', { onTransitionReady: warpOut, scroll: false })

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ color: FG }}
    >
      <div className="relative max-w-5xl mx-auto px-10 md:px-16 py-24 md:py-32">
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
          ← Back to trajectory
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
          {station.years}
          {station.sector ? ` · ${station.sector}` : ''}
        </div>

        <h1
          className="leading-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: FG
          }}
        >
          {station.role}
        </h1>
        <div
          className="mt-3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
            fontWeight: 400,
            color: ACCENT,
            letterSpacing: '-0.01em'
          }}
        >
          {station.company}
        </div>

        {/* Intro */}
        <p
          className="mt-14"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(1.1rem, 1.6vw, 1.45rem)',
            lineHeight: 1.6,
            color: FG,
            maxWidth: 680,
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
      </div>
    </main>
  )
}
