import { useRef, type RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type HeroRefs = {
  ready: boolean
  // Portrait/mobile: nombres apilados → entradas/salidas verticales.
  stacked: boolean
  // Táctil sin puntero fino → sin parallax de mouse (evita trabajo por-frame).
  isTouch: boolean
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
  onPastHero
}: HeroRefs) {
  // Estado inicial oculto (antes de que el Loader libere el Hero).
  // Solo ocultamos ANTES de la entrada (mientras !ready). Una vez que ready es
  // true, la entrada gobierna la opacidad y NO volvemos a ocultar — así, cambiar
  // de viewport (stacked) tras la entrada no re-oculta los nombres para siempre
  // (bug: los elementos del nuevo layout quedaban en opacity:0 sin revelarse).
  useGSAP(() => {
    if (ready) return
    gsap.set(avatarContainerRef.current, { y: 20, x: 0, scale: 1, opacity: 0 })
    if (stacked) {
      gsap.set(firstNameRef.current, { y: 24, opacity: 0 })
      gsap.set(lastNameRef.current, { y: 24, opacity: 0 })
    } else {
      gsap.set(firstNameRef.current, { x: '8vw', opacity: 0 })
      gsap.set(lastNameRef.current, { x: '-8vw', opacity: 0 })
    }
    gsap.set(middleNameRef.current, { y: 18, opacity: 0 })
    gsap.set(taglineRef.current, { y: 14, opacity: 0 })
  }, [stacked, ready])

  // Parallax del nombre siguiendo el mouse (opuesto al avatar) → profundidad.
  // Solo en desktop con puntero fino: en stacked (mobile/tablet) el offset de
  // ±24px descentra el nombre apilado, y en touch no hay hover. Al desactivarlo
  // reseteamos x/y por si quedó un offset del layout anterior (mina #9).
  useGSAP(() => {
    const el = namesRef.current
    if (!el) return
    if (isTouch || stacked) {
      gsap.killTweensOf(el)
      gsap.set(el, { x: 0, y: 0 })
      return
    }
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
  }, [isTouch, stacked])

  // Marca si la entrada ya reveló los nombres.
  const entered = useRef(false)

  // Si el viewport (stacked) cambia DESPUÉS de la entrada, los elementos del
  // nuevo layout pueden traer estilos inline residuales (opacity:0, translate)
  // del branch anterior. Los forzamos a su estado visible final, sin animar.
  useGSAP(() => {
    if (!entered.current) return
    gsap.set(
      [firstNameRef.current, lastNameRef.current, middleNameRef.current],
      { x: 0, y: 0, autoAlpha: 1, clearProps: 'transform' }
    )
  }, [stacked])

  // Entrada (cuando ready) → al terminar, engancha el timeline de salida por scrub.
  // Depende SOLO de ready (no de stacked): re-correr la entrada por un resize
  // reproduciría el fade-in desde opacity:0. La dirección de entrada (x vs y) usa
  // el stacked del momento en que ready se cumple, que es suficiente.
  useGSAP(
    () => {
      if (!ready) return
      entered.current = true

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
            // Salida: en stacked los nombres se van hacia arriba/abajo; en
            // desktop se abren a los lados.
            if (stacked) {
              exit
                .to(
                  firstNameRef.current,
                  { y: '-3vh', autoAlpha: 0, duration: 0.35, ease: 'none' },
                  '<'
                )
                .to(
                  lastNameRef.current,
                  { y: '3vh', autoAlpha: 0, duration: 0.35, ease: 'none' },
                  '<'
                )
            } else {
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
            }
            exit
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
        .to(
          firstNameRef.current,
          stacked ? { y: 0, opacity: 1, duration: 1.1 } : { x: 0, opacity: 1, duration: 1.1 },
          '<0.1'
        )
        .to(
          lastNameRef.current,
          stacked ? { y: 0, opacity: 1, duration: 1.1 } : { x: 0, opacity: 1, duration: 1.1 },
          '<0.05'
        )
        .to(middleNameRef.current, { y: 0, opacity: 1, duration: 0.8 }, '<0.15')
        .to(taglineRef.current, { y: 0, opacity: 1, duration: 0.8 }, '<0.2')
    },
    { dependencies: [ready] }
  )
}
