'use client'

import { useRef, useState } from 'react'
import { INITIAL_Z } from './Avatar3D'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger)

const Avatar3D = dynamic(() => import('./Avatar3D'), { ssr: false })

const NAME_SIZE = 'clamp(3rem, 12vw, 18rem)'
const NAME_COLOR = '#6B3040'
const NAME_OPACITY = 0.9

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
  // Pausa el frameloop del Hero cuando el avatar ya hizo su fade-out (pasada
  // la sección): corta el trabajo por-frame sin destruir el contexto WebGL.
  // NO desmontar el canvas: recrear el contexto + recompilar shaders +
  // re-subir la geometría a GPU produce un hitch notable al volver.
  const [pastHero, setPastHero] = useState(false)

  useGSAP(() => {
    gsap.set(avatarContainerRef.current, {
      y: 20,
      x: 0,
      scale: 1,
      opacity: 0
    })
    gsap.set(firstNameRef.current, { x: '8vw', opacity: 0 })
    gsap.set(lastNameRef.current, { x: '-8vw', opacity: 0 })
    gsap.set(middleNameRef.current, { y: 18, opacity: 0 })
    gsap.set(taglineRef.current, { y: 14, opacity: 0 })
  }, [])

  // Parallax del nombre siguiendo el mouse (opuesto al avatar) → profundidad
  useGSAP(() => {
    const el = namesRef.current
    if (!el) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      xTo(-nx * 24)
      yTo(-ny * 16)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useGSAP(
    () => {
      if (!ready) return

      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          onComplete() {
            const exit = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
                onLeave: () => setPastHero(true),
                onEnterBack: () => setPastHero(false)
              }
            })
            exit
              .to(
                firstNameRef.current,
                { x: '-4vw', autoAlpha: 0, duration: 0.35, ease: 'none' },
                '<'
              )
              .to(
                lastNameRef.current,
                { x: '4vw', autoAlpha: 0, duration: 0.35, ease: 'none' },
                '<'
              )
              .to(
                middleNameRef.current,
                { y: 10, autoAlpha: 0, duration: 0.28, ease: 'none' },
                '<'
              )
              .to(
                cameraZRef,
                { current: 0.4, ease: 'power2.in', duration: 0.8 },
                0.05
              )
              .to(
                avatarWrapRef.current,
                { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' },
                0.55
              )
              .to(
                taglineRef.current,
                { autoAlpha: 0, y: 8, duration: 0.2, ease: 'none' },
                0
              )
          }
        })
        .to(avatarContainerRef.current, {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 1.3
        })
        .to(firstNameRef.current, { x: 0, opacity: 1, duration: 1.1 }, '<0.1')
        .to(lastNameRef.current, { x: 0, opacity: 1, duration: 1.1 }, '<0.05')
        .to(middleNameRef.current, { y: 0, opacity: 1, duration: 0.8 }, '<0.15')
        .to(taglineRef.current, { y: 0, opacity: 1, duration: 0.8 }, '<0.2')
    },
    { dependencies: [ready] }
  )

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
