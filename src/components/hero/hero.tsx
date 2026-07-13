'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { INITIAL_Z, NAME_SIZE, NAME_COLOR, NAME_OPACITY } from './constants'
import { useHeroAnimation } from './use-hero-animation'
import { useViewport } from '@/hooks/useViewport'

const Avatar3D = dynamic(() => import('./avatar-3d'), { ssr: false })

const nameStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: NAME_SIZE,
  color: NAME_COLOR,
  fontWeight: 500,
  letterSpacing: '-0.03em',
  opacity: NAME_OPACITY,
} as const

// Portrait/mobile: nombre más grande que en el clamp desktop para que "Gabriel"
// y "Rodriguez" sean más anchos que la cabeza del avatar y asomen a los lados.
const stackedNameStyle = {
  ...nameStyle,
  fontSize: 'clamp(3.75rem, 20vw, 9rem)',
} as const

export default function Hero({
  ready,
  onAvatarLoaded
}: {
  ready: boolean
  onAvatarLoaded?: () => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const firstNameRef = useRef<HTMLDivElement>(null)
  const middleNameRef = useRef<HTMLDivElement>(null)
  const lastNameRef = useRef<HTMLDivElement>(null)
  const avatarContainerRef = useRef<HTMLDivElement>(null)
  const avatarWrapRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const cameraZRef = useRef(INITIAL_Z)
  // Pausa el frameloop del Hero cuando el avatar ya hizo su fade-out (pasada la
  // sección): corta el trabajo por-frame sin destruir el contexto WebGL. NO
  // desmontar el canvas: recrear el contexto + recompilar shaders + re-subir la
  // geometría a GPU produce un hitch notable al volver.
  const [pastHero, setPastHero] = useState(false)

  const { isMobile, isPortrait, isTouch } = useViewport()
  // En portrait apilamos los nombres verticalmente; en landscape/desktop van a
  // los lados. `stacked` gobierna tanto el layout CSS como los targets de GSAP.
  const stacked = isMobile || isPortrait

  useHeroAnimation({
    ready,
    stacked,
    isTouch,
    sectionRef,
    namesRef,
    firstNameRef,
    middleNameRef,
    lastNameRef,
    avatarContainerRef,
    avatarWrapRef,
    taglineRef,
    cameraZRef,
    onPastHero: setPastHero
  })

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '150vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={namesRef} className="absolute inset-0 pointer-events-none">
          {stacked ? (
            /* ── Portrait/mobile: los 3 nombres apilados a la altura de la cara ──
               Centrado vertical (donde está la cabeza del avatar) para que el
               texto cruce por detrás y asome a los lados. Las 3 líneas comparten
               borde izquierdo (items-start), el bloque se centra en el viewport.
               GSAP anima cada línea (ver use-hero-animation stacked branch).
               key="stacked": fuerza a React a montar este árbol desde cero al
               cambiar de layout, en vez de reusar los nodos del branch desktop
               (que arrastraban los estilos inline de GSAP: opacity:0 / translate). */
            <div
              key="stacked"
              className="absolute inset-0 flex flex-col items-center justify-center uppercase"
              style={{ zIndex: 10 }}
            >
              <div className="flex flex-col items-start gap-[0.02em] w-max">
                <div ref={firstNameRef} className="select-none">
                  <span className="leading-[0.9]" style={stackedNameStyle}>Diego</span>
                </div>
                <div ref={middleNameRef} className="select-none">
                  <span
                    className="leading-[0.9]"
                    style={{ ...stackedNameStyle, whiteSpace: 'nowrap' }}
                  >
                    Gabriel
                  </span>
                </div>
                <div ref={lastNameRef} className="select-none">
                  <span className="leading-[0.9]" style={stackedNameStyle}>Rodriguez</span>
                </div>
              </div>
            </div>
          ) : (
            <div key="wide" className="contents">
              {/* Diego · Rodriguez a los lados */}
              <div
                className="uppercase absolute inset-0 flex items-center"
                style={{ zIndex: 10 }}
              >
                <div
                  ref={firstNameRef}
                  className="flex-1 flex justify-end select-none"
                >
                  <span className="leading-none" style={nameStyle}>Diego</span>
                </div>
                <div
                  ref={lastNameRef}
                  className="flex-1 flex justify-start select-none"
                  style={{ marginLeft: '-2vw' }}
                >
                  <span className="leading-none" style={nameStyle}>Rodriguez</span>
                </div>
              </div>

              {/* Gabriel centrado */}
              <div
                ref={middleNameRef}
                className="absolute uppercase inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{ zIndex: 15 }}
              >
                <span
                  className="leading-none"
                  style={{ ...nameStyle, whiteSpace: 'nowrap' }}
                >
                  Gabriel
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Avatar 3D */}
        <div
          ref={avatarWrapRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <div ref={avatarContainerRef} className="w-full h-full">
            <Avatar3D
              onLoaded={onAvatarLoaded}
              cameraZRef={cameraZRef}
              paused={pastHero}
              portrait={isPortrait}
            />
          </div>
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none w-full px-6 text-center"
          style={{ zIndex: 25 }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(0.6rem, 2.6vw, 0.7rem)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#8a7a70'
            }}
          >
            AI Full Stack Engineer
            <span style={{ color: '#6B3040', margin: '0 0.6em' }}>—</span>
            Scalable &amp; High-Impact UX
          </span>
        </div>
      </div>
    </section>
  )
}
