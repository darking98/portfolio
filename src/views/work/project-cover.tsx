'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Project, ProjectDetail } from '@/components/projects/data'

const CREAM = '#e8e0d5'

const KICKER: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.62rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase'
}

type Props = {
  project: Project
  detail: ProjectDetail
}

type Slide = { src?: string; kind: 'image' | 'video'; grad: string }

const isVideo = (src: string) => /\.(webm|mp4|mov)$/i.test(src)

// Slides: usa la galería real si existe; si no, 3 placeholders generativos con
// variaciones del gradiente `hue` del proyecto (para que el carousel funcione
// antes de tener media). Detecta video/imagen por extensión.
function useSlides(project: Project): Slide[] {
  const [a, b] = project.hue
  if (project.gallery && project.gallery.length > 0) {
    return project.gallery.map((src) => ({
      src,
      kind: isVideo(src) ? 'video' : 'image',
      grad: `linear-gradient(150deg, ${a}, ${b})`
    }))
  }
  return [
    { kind: 'image', grad: `linear-gradient(150deg, ${a}, ${b})` },
    { kind: 'image', grad: `linear-gradient(30deg, ${b}, ${a})` },
    { kind: 'image', grad: `linear-gradient(220deg, ${a}, ${b})` }
  ]
}

// Portada = carousel de imágenes full-screen, navegable por drag/swipe.
// Shared element: el track lleva `work-media` → morphea desde la preview de la
// vitrina. Sin R3F ni tilt: sólo transforms via GSAP (killTweensOf en cleanup).
export function ProjectCover({ project, detail }: Props) {
  const slides = useSlides(project)
  const n = slides.length

  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)

  // Estado del drag (refs para no re-renderizar por frame)
  const drag = useRef({ active: false, startX: 0, baseX: 0, width: 0, moved: 0 })

  // Fade-in de todo lo que NO morphea (meta, role, dots): el título y el
  // carousel entran por la view transition; el resto aparecería de golpe con el
  // snapshot nuevo. Delay ≥ duración del morph (0.62s) → primero se posicionan
  // título e imagen, y recién cuando el morph termina entran los demás.
  useGSAP(
    () => {
      gsap.from('.cover-in', {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.68
      })
    },
    { scope: stageRef }
  )

  // Anima el track a la posición del slide `i`.
  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(n - 1, i))
    indexRef.current = clamped
    setIndex(clamped)
    const w = stageRef.current?.offsetWidth ?? window.innerWidth
    gsap.to(trackRef.current, {
      x: -clamped * w,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  useEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return

    const onDown = (e: PointerEvent) => {
      drag.current.active = true
      drag.current.startX = e.clientX
      drag.current.width = stage.offsetWidth
      drag.current.baseX = -indexRef.current * drag.current.width
      drag.current.moved = 0
      gsap.killTweensOf(track)
      stage.setPointerCapture(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.startX
      drag.current.moved = dx
      // Resistencia en los extremos (no se puede arrastrar más allá del primero/último)
      let x = drag.current.baseX + dx
      const min = -(n - 1) * drag.current.width
      if (x > 0) x = x * 0.35
      else if (x < min) x = min + (x - min) * 0.35
      gsap.set(track, { x })
    }

    const onUp = (e: PointerEvent) => {
      if (!drag.current.active) return
      drag.current.active = false
      try {
        stage.releasePointerCapture(e.pointerId)
      } catch {}
      const { moved, width } = drag.current
      // Umbral: 18% del ancho o gesto claro
      const threshold = width * 0.18
      let next = indexRef.current
      if (moved < -threshold) next = indexRef.current + 1
      else if (moved > threshold) next = indexRef.current - 1
      goTo(next)
    }

    // Reposiciona en resize (el ancho del slide cambió)
    const onResize = () => {
      const w = stage.offsetWidth
      gsap.set(track, { x: -indexRef.current * w })
    }

    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', onResize)
    return () => {
      stage.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf(track)
    }
    // n es estable (depende del proyecto, que no cambia en esta view)
  }, [n])

  return (
    <div
      ref={stageRef}
      className="relative w-full overflow-hidden select-none"
      style={{ height: '100vh', touchAction: 'pan-y', cursor: 'grab' }}
    >
      {/* Track de slides. Shared element: morphea desde la preview de la vitrina. */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${n * 100}%`, viewTransitionName: 'work-media' }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative h-full shrink-0 overflow-hidden"
            style={{ width: `${100 / n}%`, background: s.grad }}
          >
            {s.src &&
              (s.kind === 'video' ? (
                <video
                  src={s.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.src}
                  alt={`${project.title} — ${i + 1}`}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ))}
          </div>
        ))}
      </div>

      {/* Velo inferior para asentar el texto sobre el visual */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(20,12,8,0.6), transparent 44%)'
        }}
      />

      {/* Título + meta */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 md:px-12 pb-16 md:pb-20">
        <div
          className="cover-in"
          style={{ ...KICKER, color: CREAM, opacity: 0.85, marginBottom: '1.2rem' }}
        >
          {project.kind} · {project.year}
        </div>
        <h1
          className="leading-[0.86]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(3.5rem, 14vw, 15rem)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            color: CREAM,
            textShadow: '0 6px 50px rgba(0,0,0,0.4)',
            // Shared element: morphea desde el título de la fila en la vitrina
            viewTransitionName: 'work-title'
          }}
        >
          {project.title}
        </h1>
        <div
          className="cover-in mt-4"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(1.1rem, 2vw, 1.7rem)',
            color: CREAM,
            opacity: 0.9,
            letterSpacing: '-0.01em'
          }}
        >
          {detail.role}
        </div>
      </div>

      {/* Dots + contador (navegación por click también) */}
      <div className="cover-in absolute bottom-8 right-6 md:right-12 flex items-center gap-4">
        <span style={{ ...KICKER, color: CREAM, opacity: 0.7 }}>
          {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === index ? 22 : 8,
                height: 3,
                borderRadius: 2,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: CREAM,
                opacity: i === index ? 1 : 0.4,
                transition: 'width 0.3s ease, opacity 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
