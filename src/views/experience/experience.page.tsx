'use client'

import { useEffect, useRef, useState } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Station, ExperienceDetail } from '@/components/experience-skills/data'
import { warpOut } from '@/lib/transition'
import { useScrollTop } from '@/hooks/useScrollTop'
import { useTilt } from '@/hooks/useTilt'
import { useViewport } from '@/hooks/useViewport'

gsap.registerPlugin(ScrollTrigger)

// Misma paleta que el Hero (el Background global pastel se ve detrás → fondo
// transparente). NO poner background propio: taparía el grain/gradiente global.
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
  station: Station
  detail: ExperienceDetail
}

// Escenas de la columna que scrollea: overview + cada highlight. Cada una se
// asocia a una imagen de la galería (la media sticky cambia al leerla).
type Scene = { kind: 'overview' | 'highlight'; text: string; media: number }

export function ExperiencePage({ station, detail }: Props) {
  useScrollTop()
  const router = useTransitionRouter()
  const { isDesktop } = useViewport()
  const mainRef = useRef<HTMLElement>(null)
  const goBack = () =>
    router.push('/', { onTransitionReady: warpOut, scroll: false })

  const gallery = detail.gallery ?? []
  const hasMedia = gallery.length > 0

  // Escenas = overview + highlights; cada una apunta a una imagen (cíclico si
  // hay menos imágenes que escenas).
  const scenes: Scene[] = [
    { kind: 'overview', text: detail.intro, media: 0 },
    ...detail.highlights.map((h, i) => ({
      kind: 'highlight' as const,
      text: h,
      media: hasMedia ? (i + 1) % gallery.length : 0
    }))
  ]

  // Índice de la imagen sticky activa (la de la escena que cruza el centro).
  const [activeMedia, setActiveMedia] = useState(0)
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([])

  // Tilt 3D de la media sticky siguiendo el mouse (reutiliza el patrón de Work).
  const tiltRef = useRef<HTMLDivElement>(null)
  useTilt(tiltRef, { max: 7, enabled: hasMedia })

  // La escena cuyo centro está más cerca del centro del viewport manda la media.
  useEffect(() => {
    if (!hasMedia) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.media)
            if (!Number.isNaN(idx)) setActiveMedia(idx)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    sceneRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [hasMedia])

  // Reveal por scroll: mismo patrón que Work.
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        })
      })
    },
    { scope: mainRef }
  )

  const isVideo = (src: string) => /\.(webm|mp4|mov)$/i.test(src)

  // Media inline (mobile): la imagen de UNA escena, debajo de su texto. En
  // desktop la media va sticky a la derecha (ver más abajo). object-cover acá
  // (marco fijo, la captura llena) — en desktop es object-contain.
  const InlineMedia = ({ idx }: { idx: number }) => {
    const src = gallery[idx]
    if (!src) return null
    const cls = 'w-full h-full object-cover'
    return (
      <div
        className="relative w-full overflow-hidden mt-6"
        style={{
          aspectRatio: '16 / 10',
          borderRadius: 8,
          background: '#1a1310',
          boxShadow: '0 20px 50px -24px rgba(42,26,20,0.45)'
        }}
      >
        {isVideo(src) ? (
          <video src={src} autoPlay muted loop playsInline className={cls} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`${station.company} — ${idx + 1}`} className={cls} />
        )}
      </div>
    )
  }

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen w-full overflow-x-clip"
      style={{ color: FG }}
    >
      {/* Volver */}
      <div className={`${PAD} pt-10 md:pt-12`}>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2"
          style={{
            ...KICKER,
            fontSize: '0.7rem',
            letterSpacing: '0.16em',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ← Back to trajectory
        </button>
      </div>

      {/* Cover tipográfico: el rol manda, sin media (la info primero) */}
      <header className={`${PAD} pt-16 md:pt-24 pb-16 md:pb-24`}>
        <div style={{ ...KICKER, marginBottom: '1.4rem' }}>
          {station.years}
          {station.sector ? ` · ${station.sector}` : ''}
        </div>
        <h1
          className="leading-[0.9]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(2.8rem, 10vw, 9rem)',
            fontWeight: 500,
            letterSpacing: '-0.035em',
            color: FG
          }}
        >
          {station.role}
        </h1>
        <div
          className="mt-4"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(1.3rem, 2.4vw, 2rem)',
            color: ACCENT,
            letterSpacing: '-0.01em'
          }}
        >
          {station.company}
        </div>
      </header>

      {/* Scrollytelling: texto (izq) scrollea · media (der) sticky que cambia */}
      <section
        className={`${PAD} grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12`}
        style={{ borderTop: `1px solid ${HAIR}`, paddingTop: '4rem' }}
      >
        {/* Columna que scrollea: escenas */}
        <div className="flex flex-col">
          {scenes.map((s, i) => (
            <div
              key={i}
              ref={(el) => {
                sceneRefs.current[i] = el
              }}
              data-media={s.media}
              className="reveal flex flex-col justify-center"
              style={{
                // Mobile: espaciado menor (no hay media sticky al lado que
                // justifique el 7vh). Desktop: mantiene el ritmo del scrollytelling.
                paddingBlock: isDesktop
                  ? 'clamp(2.5rem, 7vh, 5rem)'
                  : 'clamp(1.75rem, 4vh, 2.75rem)',
                borderTop: i > 0 ? `1px solid ${HAIR}` : undefined
              }}
            >
              <div style={{ ...KICKER, marginBottom: '1.4rem' }}>
                {s.kind === 'overview'
                  ? 'Overview'
                  : `Highlight · ${String(i).padStart(2, '0')}`}
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:
                    s.kind === 'overview'
                      ? 'clamp(1.4rem, 2.2vw, 2.1rem)'
                      : 'clamp(1.2rem, 1.8vw, 1.6rem)',
                  lineHeight: 1.45,
                  color: FG,
                  letterSpacing: '-0.015em',
                  maxWidth: 560
                }}
              >
                {s.text}
              </p>
              {/* Mobile: la imagen de esta escena, inline debajo del texto (en
                  desktop la media va sticky a la derecha). */}
              {!isDesktop && hasMedia && <InlineMedia idx={s.media} />}
            </div>
          ))}
        </div>

        {/* Columna sticky: media que acompaña la lectura */}
        <div className="hidden lg:block">
          <div
            className="sticky top-0 h-screen flex items-center"
            style={{ paddingBlock: '8vh', perspective: 1000 }}
          >
            <div
              ref={tiltRef}
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: '16 / 10',
                borderRadius: 8,
                background: '#1a1310',
                boxShadow: '0 30px 80px -30px rgba(42,26,20,0.5)',
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
            >
              {gallery.map((src, i) => {
                const on = i === activeMedia
                // object-contain: screenshots de web se ven COMPLETAS (sin
                // recortar contenido); el fondo oscuro rellena los bordes.
                const common =
                  'absolute inset-0 w-full h-full object-contain transition-opacity duration-500'
                return isVideo(src) ? (
                  <video
                    key={src}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={common}
                    style={{ opacity: on ? 1 : 0 }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt={`${station.company} — ${i + 1}`}
                    className={common}
                    style={{ opacity: on ? 1 : 0 }}
                  />
                )
              })}
              {!hasMedia && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ ...KICKER, color: 'rgba(232,224,213,0.55)' }}
                >
                  {station.company}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stack al pie */}
      <section
        className={`reveal ${PAD} mt-20 md:mt-28 mb-20 md:mb-28 pt-10 flex flex-col gap-4`}
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        <span style={KICKER}>Stack</span>
        <div className="flex flex-wrap gap-x-6 gap-y-2 max-w-2xl">
          {detail.stack.map((s) => (
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
      </section>
    </main>
  )
}
