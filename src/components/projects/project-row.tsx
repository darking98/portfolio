import type { Project } from './data'
import { FG, MUTED } from './constants'

const ACCENT = '#6B3040'

type Props = {
  project: Project
  index: number
  /** Fila activa (encendida). */
  on: boolean
  /** Otra fila está activa → esta se atenúa. */
  dimmed: boolean
  /** Fila del proyecto del que volvemos → lleva el view-transition-name del morph inverso. */
  isReturn: boolean
  rowRef: (el: HTMLButtonElement | null) => void
  titleRef: (el: HTMLSpanElement | null) => void
  onClick: () => void
}

// Una fila de la vitrina de Work: índice + título gigante + rubro/año + flecha.
// El título lleva el `view-transition-name` 'work-title' cuando isReturn (morph
// inverso) — el orquestador también lo asigna imperativamente en la ida.
export function ProjectRow({
  project,
  index,
  on,
  dimmed,
  isReturn,
  rowRef,
  titleRef,
  onClick
}: Props) {
  return (
    <button
      ref={rowRef}
      onClick={onClick}
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
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          ref={titleRef}
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
          {project.title}
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
          {project.kind}
          <span style={{ opacity: 0.5 }}> · {project.year}</span>
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
}
