import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STATIONS, CLUSTERS } from './data'

gsap.registerPlugin(ScrollTrigger)

type AboutRefs = {
  sectionRef: RefObject<HTMLElement | null>
  kickerRef: RefObject<HTMLDivElement | null>
  skillsKickerRef: RefObject<HTMLDivElement | null>
  trajectoryRef: RefObject<HTMLDivElement | null>
  skyRef: RefObject<HTMLDivElement | null>
  starfieldRef: RefObject<HTMLDivElement | null>
  starRefs: RefObject<(HTMLDivElement | null)[]>
  labelRefs: RefObject<(HTMLDivElement | null)[]>
  linkRefs: RefObject<(SVGPathElement | null)[]>
  constRef: RefObject<HTMLDivElement | null>
  closerRef: RefObject<HTMLDivElement | null>
}

const VW = 1920
const VH = 1000

// Timeline total = 3.6 unidades. Un solo arco:
//   Ascenso  [0.0 → 2.4]  el cielo oscurece + starfield aparece (pastel→espacio)
//   Naciente [0.2 → 2.1]  las 4 estrellas-experiencia se encienden y conectan
//   Morph    [2.1 → 2.7]  las estrellas fluyen hacia las constelaciones de skills
//   Clímax   [2.5 → 3.6]  constelaciones interactivas + closer
export function useAboutAnimation({
  sectionRef,
  kickerRef,
  skillsKickerRef,
  trajectoryRef,
  skyRef,
  starfieldRef,
  starRefs,
  labelRefs,
  linkRefs,
  constRef,
  closerRef
}: AboutRefs) {
  useGSAP(
    () => {
      // Estado inicial
      gsap.set(kickerRef.current, { autoAlpha: 0, y: 12 })
      gsap.set(skillsKickerRef.current, { autoAlpha: 0, y: 12 })
      // La trajectory (línea + estrellas + labels) arranca OCULTA y sube junto
      // con el sky: nunca visible sobre el pastel del Hero (que se solapa por el
      // margin-top -100vh). Sin esto, la línea punteada se ve en el Hero.
      gsap.set(trajectoryRef.current, { opacity: 0 })
      // xPercent/yPercent -50 centra el botón en el punto (reemplaza las clases
      // -translate-*-1/2, que GSAP pisaría al escribir su propio transform).
      gsap.set(starRefs.current, {
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 0,
        scale: 0.2,
        x: 0,
        y: 0
      })
      gsap.set(labelRefs.current, { autoAlpha: 0, y: 14, filter: 'blur(6px)' })
      gsap.set(constRef.current, { autoAlpha: 0 })
      gsap.set(closerRef.current, { autoAlpha: 0, y: 22, filter: 'blur(8px)' })

      // Longitud de cada línea conectora para el trazado
      linkRefs.current.forEach((p) => {
        if (!p) return
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true
        }
      })

      // ── Ascenso: el cielo oscurece rápido (queda oscuro antes de que se
      // encienda la 2ª estrella) y el starfield aparece con él ──
      tl.to(skyRef.current, { opacity: 1, ease: 'power2.out', duration: 0.55 }, 0)
      // La trajectory aparece un pelín DESPUÉS de que el sky ya cubre → nunca
      // sobre el Hero pastel.
      tl.to(
        trajectoryRef.current,
        { opacity: 1, ease: 'none', duration: 0.35 },
        0.22
      )
      tl.to(
        starfieldRef.current,
        { opacity: 1, ease: 'none', duration: 0.6 },
        0.1
      )
      tl.to(kickerRef.current, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.05)

      // ── Constelación naciente: estrellas se encienden + líneas se trazan ──
      const starAt = [0.25, 0.7, 1.2, 1.7]
      STATIONS.forEach((_, i) => {
        // enciende la estrella
        tl.to(
          starRefs.current[i],
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            ease: 'back.out(2)'
          },
          starAt[i]
        )
        // muestra su label (foco); atenúa el anterior
        tl.to(
          labelRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'power3.out'
          },
          starAt[i] + 0.05
        )
        if (i > 0) {
          // traza la línea desde la estrella anterior a esta
          tl.to(
            linkRefs.current[i - 1],
            { strokeDashoffset: 0, duration: 0.45, ease: 'power2.inOut' },
            starAt[i] - 0.1
          )
          // atenúa el label anterior (mantiene foco en la actual)
          tl.to(
            labelRefs.current[i - 1],
            { autoAlpha: 0.25, duration: 0.4, ease: 'power2.in' },
            starAt[i]
          )
        }
      })

      // ── Morph fluido: las estrellas-experiencia fluyen hacia las
      // constelaciones de skills; labels y líneas se retiran ──
      const morph = 2.15

      // labels fuera
      tl.to(
        labelRefs.current,
        { autoAlpha: 0, y: -10, filter: 'blur(6px)', duration: 0.4 },
        morph
      )
      // líneas fuera — por OPACIDAD (autoAlpha), garantizado invisible. El
      // strokeDashoffset dejaba residuo visible en la sección de skills.
      tl.to(
        linkRefs.current,
        { autoAlpha: 0, duration: 0.35, ease: 'power2.in' },
        morph
      )
      tl.to(kickerRef.current, { autoAlpha: 0, duration: 0.4 }, morph)

      // Cada estrella fluye hacia el nodo-madre de un cluster (destino). Se
      // reparten: 0→frontend, 1→backend, 2→ai, 3→ai. dx/dy como FUNCIONES → se
      // recalculan en cada refresh (invalidateOnRefresh) con el viewport actual,
      // así aterrizan EXACTO sobre el nodo-madre del cluster.
      const dest = [CLUSTERS[0], CLUSTERS[1], CLUSTERS[2], CLUSTERS[2]]
      STATIONS.forEach((s, i) => {
        const el = starRefs.current[i]
        if (!el) return
        tl.to(
          el,
          {
            x: () => ((dest[i].x - s.x) / VW) * window.innerWidth,
            y: () => ((dest[i].y - s.y) / VH) * window.innerHeight,
            scale: 1.4,
            duration: 0.6,
            ease: 'power2.inOut'
          },
          morph
        )
        // se funden al llegar (los nodos-madre reales toman el relevo)
        tl.to(el, { autoAlpha: 0, duration: 0.25 }, morph + 0.5)
      })

      // ── Clímax: constelaciones interactivas + closer ──
      tl.to(
        constRef.current,
        { autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
        morph + 0.4
      )
      // El kicker cambia Experience → Skills al entrar la constelación
      tl.to(
        skillsKickerRef.current,
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        morph + 0.4
      )
      tl.to(
        closerRef.current,
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power3.out'
        },
        morph + 0.7
      )
      // Cola muerta: mantiene el clímax quieto para explorar antes de Projects
      tl.to({}, { duration: 0.5 }, 3.0)
    },
    { scope: sectionRef }
  )
}
