'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { INITIAL_Z, NAME_SIZE, NAME_COLOR, NAME_OPACITY } from './constants'
import { useHeroAnimation } from './use-hero-animation'

const Avatar3D = dynamic(() => import('./avatar-3d'), { ssr: false })

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

  useHeroAnimation({
    ready,
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
          {/* Diego · Rodriguez */}
          <div
            className="uppercase absolute inset-0 flex items-center"
            style={{ zIndex: 10 }}
          >
            <div
              ref={firstNameRef}
              className="flex-1 flex justify-end select-none"
            >
              <span
                className="leading-none"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: NAME_SIZE,
                  color: NAME_COLOR,
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  opacity: NAME_OPACITY
                }}
              >
                Diego
              </span>
            </div>
            <div
              ref={lastNameRef}
              className="flex-1 flex justify-start select-none"
              style={{ marginLeft: '-2vw' }}
            >
              <span
                className="leading-none"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: NAME_SIZE,
                  color: NAME_COLOR,
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  opacity: NAME_OPACITY
                }}
              >
                Rodriguez
              </span>
            </div>
          </div>

          {/* Gabriel */}
          <div
            ref={middleNameRef}
            className="absolute uppercase inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ zIndex: 15 }}
          >
            <span
              className="leading-none"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: NAME_SIZE,
                color: NAME_COLOR,
                fontWeight: 500,
                letterSpacing: '-0.03em',
                opacity: NAME_OPACITY,
                whiteSpace: 'nowrap'
              }}
            >
              Gabriel
            </span>
          </div>
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
            />
          </div>
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none whitespace-nowrap"
          style={{ zIndex: 25 }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#8a7a70'
            }}
          >
            AI Full Stack Engineer
            <span style={{ color: '#6B3040', margin: '0 0.6em' }}>—</span>
            Scalable & High-Impact UX
          </span>
        </div>
      </div>
    </section>
  )
}
