import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ContactRefs = {
  sectionRef: RefObject<HTMLElement | null>
  asciiWrapRef: RefObject<HTMLDivElement | null>
  scanlineRef: RefObject<HTMLDivElement | null>
  enterRef: RefObject<number>
}

export function useContactAnimation({
  sectionRef,
  asciiWrapRef,
  scanlineRef,
  enterRef
}: ContactRefs) {
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6
        }
      })

      // El ASCII se "tipea" de arriba hacia abajo (muchos pasos = ticking rápido)
      tl.fromTo(
        asciiWrapRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'steps(52)', duration: 0.6 },
        0
      )

      // Parallax "desde arriba": el avatar desciende dentro de la escena 3D
      // (así el clip y la scanline quedan siempre alineados)
      tl.fromTo(enterRef, { current: 1 }, { current: 0, ease: 'power1.out' }, 0)

      // Línea de escaneo (cursor) que baja junto al borde del tipeo
      tl.fromTo(
        scanlineRef.current,
        { top: '0%', autoAlpha: 1 },
        { top: '100%', ease: 'none', duration: 0.6 },
        0
      )
      // se apaga al terminar de tipear
      tl.to(
        scanlineRef.current,
        { autoAlpha: 0, duration: 0.06, ease: 'none' },
        0.6
      )

      // El nombre aparece letra por letra
      tl.from(
        '.contact-letter',
        {
          yPercent: 90,
          autoAlpha: 0,
          filter: 'blur(8px)',
          duration: 0.35,
          ease: 'power3.out',
          stagger: 0.03
        },
        0.42
      )

      // Los links entran (ocultos hasta el reveal; el pill resuelve el contraste)
      tl.from(
        '.contact-fade',
        {
          autoAlpha: 0,
          y: 22,
          filter: 'blur(5px)',
          duration: 0.35,
          ease: 'power2.out',
          stagger: 0.1
        },
        0.5
      )
    },
    { scope: sectionRef }
  )
}
