import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type HeroRefs = {
  ready: boolean
  sectionRef: RefObject<HTMLElement | null>
  namesRef: RefObject<HTMLDivElement | null>
  firstNameRef: RefObject<HTMLDivElement | null>
  middleNameRef: RefObject<HTMLDivElement | null>
  lastNameRef: RefObject<HTMLDivElement | null>
  avatarContainerRef: RefObject<HTMLDivElement | null>
  avatarWrapRef: RefObject<HTMLDivElement | null>
  taglineRef: RefObject<HTMLDivElement | null>
  cameraZRef: RefObject<number>
  // Pausa el frameloop del avatar al salir de la sección (no desmontar el canvas)
  onPastHero: (past: boolean) => void
}

export function useHeroAnimation({
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
  onPastHero
}: HeroRefs) {
  // Estado inicial oculto (antes de que el Loader libere el Hero)
  useGSAP(() => {
    gsap.set(avatarContainerRef.current, { y: 20, x: 0, scale: 1, opacity: 0 })
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
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.killTweensOf(el)
    }
  }, [])

  // Entrada (cuando ready) → al terminar, engancha el timeline de salida por scrub
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
                onLeave: () => onPastHero(true),
                onEnterBack: () => onPastHero(false)
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
}
