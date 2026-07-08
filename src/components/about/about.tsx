'use client'

import { useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useTransitionRouter } from 'next-view-transitions'
import { LABEL } from './constants'
import { Trajectory } from './stations'
import { Starfield, type StarfieldHandle } from './starfield'
import { Constellation } from './constellation'
import { Closer } from './closer'
import { KICKER, type Station } from './data'
import { useAboutAnimation } from './use-about-animation'
import { warpIn } from '@/lib/transition'
import { saveScroll } from '@/lib/scrollStore'

const SPACE_BG = '#0d0a12'

export default function About() {
  const router = useTransitionRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const kickerRef = useRef<HTMLDivElement>(null)
  const trajectoryRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const starfieldRef = useRef<HTMLDivElement>(null)
  const starfieldApi = useRef<StarfieldHandle>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const starRefs = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const linkRefs = useRef<(SVGPathElement | null)[]>([])
  const constRef = useRef<HTMLDivElement>(null)
  const closerRef = useRef<HTMLDivElement>(null)
  const travelling = useRef(false)

  // Click en una estrella-experiencia → warp hacia ella → detalle.
  const onStarClick = useCallback(
    async (station: Station, cx: number, cy: number) => {
      if (travelling.current) return
      travelling.current = true

      // Origen del flash de la view transition = posición de la estrella (%)
      const root = document.documentElement
      root.style.setProperty('--warp-x', `${(cx / window.innerWidth) * 100}%`)
      root.style.setProperty('--warp-y', `${(cy / window.innerHeight) * 100}%`)

      saveScroll(window.scrollY)

      // Ocultá todo lo demás (texto, líneas, otras experiencias, kicker) para
      // que solo se vea el viaje de estrellas. El starfield queda visible.
      gsap.to(
        [
          kickerRef.current,
          trajectoryRef.current,
          constRef.current,
          closerRef.current
        ],
        { opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: true }
      )

      // Líneas de velocidad radiando desde la estrella; al llegar al pico navega.
      await starfieldApi.current?.warp(cx, cy)
      router.push(`/experience/${station.slug}`, {
        onTransitionReady: warpIn,
        scroll: false
      })
    },
    [router]
  )

  useAboutAnimation({
    sectionRef,
    kickerRef,
    trajectoryRef,
    skyRef,
    starfieldRef,
    starRefs,
    labelRefs,
    linkRefs,
    constRef,
    closerRef
  })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '420vh', marginTop: '-100vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Cielo que asciende: overlay oscuro que gana opacidad a lo largo de la
            sección (pastel del Hero → espacio del clímax). Sin corte. */}
        <div
          ref={skyRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            opacity: 0,
            background: `radial-gradient(ellipse 120% 100% at 50% 40%, #17111f 0%, ${SPACE_BG} 72%)`
          }}
        />

        {/* Starfield global: aparece durante el ascenso y queda en el clímax */}
        <div
          ref={starfieldRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1, opacity: 0 }}
        >
          <Starfield ref={starfieldApi} />
        </div>

        {/* Kicker */}
        <div
          ref={kickerRef}
          className="absolute top-[16vh] left-10 md:left-20"
          style={{ zIndex: 4 }}
        >
          <span style={{ ...LABEL, color: '#c9a9b3', opacity: 0.9 }}>
            {KICKER}
          </span>
        </div>

        {/* Acto 2 — constelación naciente (experiencias) */}
        <Trajectory
          wrapRef={trajectoryRef}
          starRefs={starRefs}
          labelRefs={labelRefs}
          linkRefs={linkRefs}
          svgRef={svgRef}
          onStarClick={onStarClick}
        />

        {/* Acto 3 — constelaciones de skills interactivas */}
        <Constellation constRef={constRef} />
        <Closer closerRef={closerRef} />
      </div>

      {/* Anclas de scroll para el nav (Experience = inicio; Skills = donde
          arranca el Acto 3). Absolutas dentro de la section (fuera del sticky),
          para que el ScrollGuide/header salten a la posición de scroll correcta.
          `scroll-mt` no aplica: el nav usa getBoundingClientRect. */}
      <span
        id="experience"
        aria-hidden
        className="absolute left-0 w-px h-px pointer-events-none"
        style={{ top: '100vh' }}
      />
      <span
        id="skills"
        aria-hidden
        className="absolute left-0 w-px h-px pointer-events-none"
        style={{ top: '300vh' }}
      />
    </section>
  )
}
