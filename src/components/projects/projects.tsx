'use client'

import { useRef, useCallback } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { sharedMorph } from '@/lib/transition'
import { saveScroll } from '@/lib/scrollStore'
import { useTilt } from '@/hooks/useTilt'
import { useViewport } from '@/hooks/useViewport'
import { MUTED } from './constants'
import { projects, type Project } from './data'
import { ProjectPreview } from './project-preview'
import { ProjectRow } from './project-row'
import { useWorkReturn } from './use-work-return'
import { useActiveRow } from './use-active-row'

export default function Projects() {
  const router = useTransitionRouter()
  const { isMobile } = useViewport()
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])
  const travelling = useRef(false)

  // Limpia los view-transition-name del morph inverso sobre los refs LOCALES
  // (título de la fila que vuelve + preview). Vive en el orquestador porque el
  // linter no permite mutar refs pasados como argumento a un hook.
  const clearNames = useCallback((idx: number) => {
    const t = titleRefs.current[idx]
    if (t) t.style.viewTransitionName = ''
    const prev = previewRef.current
    if (prev) prev.style.viewTransitionName = ''
  }, [])

  // Morph inverso (volver del detalle): returnIdx + limpieza de los
  // view-transition-name + anclaje de la preview en el snapshot.
  const { returnIdx, cleaned, cleanReturnNames } = useWorkReturn({
    previewRef,
    clearNames
  })

  // Fila activa (más cercana al centro por scroll) + anclaje vertical de la
  // preview. Arranca en returnIdx para que la preview exista en el primer paint.
  const { active, bindPreview, scrollRowToCenter } = useActiveRow({
    sectionRef,
    rowRefs,
    previewRef,
    initialActive: returnIdx,
    cleaned,
    inlinePreview: isMobile
  })

  // Tilt 3D de la preview siguiendo el mouse (hook compartido con Experience).
  // El primer movimiento suelta el morph inverso (limpia los view-transition-name).
  // Desactivado en mobile: no hay puntero fino y la preview inline se remonta.
  useTilt(tiltRef, {
    max: 9,
    enabled: !isMobile,
    onFirstMove: cleanReturnNames
  })

  const onRowClick = (p: Project, i: number) => {
    // Mobile (touch): tap directo navega — no hay hover ni "fila activa por
    // centro" que tenga sentido táctil.
    if (isMobile) {
      openProject(p, i)
      return
    }
    // Desktop: 1er click (no activa) scrollea hasta centrarla; 2do (ya activa)
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
      {/* Kicker. En mobile baja (el header en columna es más alto) y se alinea
          al padding lateral de la lista. */}
      <div
        className="absolute left-6 md:left-20 top-[16vh] md:top-24"
        style={{ zIndex: 5 }}
      >
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

      {/* Lista tipográfica gigante. Desktop: media pantalla centrada (la otra
          mitad es para la preview flotante). Mobile: ancho completo, alineada al
          inicio (no centrada) — con la preview inline la lista crece y centrarla
          la metía bajo el header; padding-top despeja el header en columna. */}
      <div
        className={`relative flex flex-col min-h-screen px-6 md:px-20 ${
          isMobile ? 'justify-start' : 'justify-center'
        }`}
        style={{
          paddingTop: isMobile ? '22vh' : '12vh',
          paddingBottom: '12vh',
          maxWidth: isMobile ? '100%' : '52%'
        }}
      >
        {projects.map((p, i) => (
          <div key={p.slug}>
            <ProjectRow
              project={p}
              index={i}
              on={active === i}
              dimmed={active !== -1 && active !== i}
              isReturn={returnIdx === i}
              rowRef={(el) => {
                rowRefs.current[i] = el
              }}
              titleRef={(el) => {
                titleRefs.current[i] = el
              }}
              onClick={() => onRowClick(p, i)}
            />

            {/* Preview INLINE (solo mobile): aparece debajo de la fila activa,
                a ancho completo. Lleva previewRef/tilt igual que la flotante →
                el morph shared-element (work-media) sigue funcionando. */}
            {isMobile && active === i && (
              <div
                ref={bindPreview}
                onClick={() => openProject(p, i)}
                className="w-full"
                style={{
                  height: 'min(56vw, 260px)',
                  margin: '0.75rem 0 1.5rem',
                  perspective: 900,
                  cursor: 'pointer',
                  willChange: 'transform'
                }}
              >
                <div
                  ref={tiltRef}
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <ProjectPreview key={p.slug} project={p} still />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview flotante (solo desktop): anclada a la derecha, siguiendo
          verticalmente la fila activa. Centrada sobre su propio origen con
          yPercent:-50 → `y` = centro de la fila. Tilt 3D en wrapper interno. */}
      {!isMobile && (
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
            {active !== -1 && (
              <ProjectPreview
                key={projects[active].slug}
                project={projects[active]}
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
