'use client'

import { useRef } from 'react'
import { LABEL } from './constants'
import { Trajectory } from './stations'
import { Starfield } from './starfield'
import { Constellation } from './constellation'
import { Closer } from './closer'
import { KICKER } from './data'
import { useAboutAnimation } from './use-about-animation'

const SPACE_BG = '#0d0a12'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const kickerRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const starfieldRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const starRefs = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const linkRefs = useRef<(SVGPathElement | null)[]>([])
  const constRef = useRef<HTMLDivElement>(null)
  const closerRef = useRef<HTMLDivElement>(null)

  useAboutAnimation({
    sectionRef,
    kickerRef,
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
          <Starfield />
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
          starRefs={starRefs}
          labelRefs={labelRefs}
          linkRefs={linkRefs}
          svgRef={svgRef}
        />

        {/* Acto 3 — constelaciones de skills interactivas */}
        <Constellation constRef={constRef} />
        <Closer closerRef={closerRef} />
      </div>
    </section>
  )
}
