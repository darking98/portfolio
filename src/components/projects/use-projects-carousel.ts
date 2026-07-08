import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ACTIVE, SLIVER, trackX } from './constants'
import { N } from './data'

gsap.registerPlugin(ScrollTrigger)

type CarouselRefs = {
  sectionRef: RefObject<HTMLElement | null>
  trackRef: RefObject<HTMLDivElement | null>
  panelRefs: RefObject<(HTMLDivElement | null)[]>
  captionRefs: RefObject<(HTMLDivElement | null)[]>
  stRef: RefObject<ScrollTrigger | null>
}

export function useProjectsCarousel({
  sectionRef,
  trackRef,
  panelRefs,
  captionRefs,
  stRef
}: CarouselRefs) {
  useGSAP(
    () => {
      // Estado inicial: panel 0 activo
      gsap.set(trackRef.current, { x: `${trackX(0)}vw` })
      panelRefs.current.forEach((p, i) => {
        gsap.set(p, { width: `${i === 0 ? ACTIVE : SLIVER}vw` })
      })
      captionRefs.current.forEach((c, i) => {
        gsap.set(c, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 12 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(N - 1) * 110}%`,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (N - 1),
            duration: { min: 0.2, max: 0.5 },
            ease: 'power2.inOut',
            directional: false
          }
        }
      })
      stRef.current = tl.scrollTrigger ?? null

      for (let k = 1; k < N; k++) {
        const at = k - 1
        tl.to(
          trackRef.current,
          { x: `${trackX(k)}vw`, ease: 'power2.inOut', duration: 1 },
          at
        )
        tl.to(
          panelRefs.current[k - 1],
          { width: `${SLIVER}vw`, ease: 'power2.inOut', duration: 1 },
          at
        )
        tl.to(
          panelRefs.current[k],
          { width: `${ACTIVE}vw`, ease: 'power2.inOut', duration: 1 },
          at
        )
        // caption crossfade
        tl.to(
          captionRefs.current[k - 1],
          { autoAlpha: 0, y: -12, duration: 0.4, ease: 'power2.in' },
          at
        )
        tl.to(
          captionRefs.current[k],
          { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          at + 0.4
        )
      }
    },
    { scope: sectionRef }
  )
}
