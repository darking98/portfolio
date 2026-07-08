'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { BG } from './constants'
import { AsciiFX, CursorLight, Head, WarmUp } from './scene'
import { ContactFooter } from './contact-footer'
import { useContactAnimation } from './use-contact-animation'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const asciiWrapRef = useRef<HTMLDivElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const winkEyeRef = useRef<SVGGElement>(null)
  const winkTlRef = useRef<gsap.core.Timeline | null>(null)
  const enterRef = useRef(1)
  const [inView, setInView] = useState(false)

  // Guiño al pasar el mouse por encima de la carita (mismo gesto que el Loader)
  const wink = () => {
    if (!winkEyeRef.current) return
    winkTlRef.current?.kill()
    winkTlRef.current = gsap
      .timeline()
      .to(winkEyeRef.current, {
        scaleY: 0.08,
        duration: 0.12,
        transformOrigin: 'center center',
        ease: 'power2.in'
      })
      .to(winkEyeRef.current, {
        scaleY: 1,
        duration: 0.22,
        transformOrigin: 'center center',
        ease: 'back.out(2.5)'
      })
  }

  // Pausa el frameloop cuando la sección está lejos del viewport: corta el
  // trabajo por-frame del AsciiEffect (getImageData + reescritura del DOM),
  // que corriendo de fondo infla la memoria. NO desmontar el canvas: recrear
  // el contexto + re-subir la geometría deja el reveal en negro (ya pasó).
  // El margen reanuda con anticipación, antes de que la sección sea visible.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '75%' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useContactAnimation({
    sectionRef,
    asciiWrapRef,
    scanlineRef,
    enterRef
  })

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full"
      style={{ background: BG, height: '180vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Avatar en ASCII */}
        <div ref={asciiWrapRef} className="absolute inset-0" style={{ zIndex: 0 }}>
          {/* dpr 1 + sin antialias: el ASCII muestrea el canvas a width*0.19,
              renderizar a mayor resolución es puro costo de GPU/memoria */}
          <Canvas
            camera={{ position: [0, 0, 3], fov: 42 }}
            dpr={1}
            gl={{ antialias: false }}
            frameloop={inView ? 'always' : 'never'}
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[2, 3, 4]} intensity={1.4} />
            <directionalLight position={[-3, 1, -2]} intensity={0.5} />
            <CursorLight />
            <Suspense fallback={null}>
              <Head enterRef={enterRef} />
              <WarmUp />
            </Suspense>
            <AsciiFX />
          </Canvas>
        </div>

        {/* Línea de escaneo */}
        <div
          ref={scanlineRef}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            zIndex: 1,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent, rgba(232,224,213,0.9) 20%, rgba(232,224,213,0.9) 80%, transparent)',
            boxShadow:
              '0 0 16px 3px rgba(232,224,213,0.55), 0 0 4px 1px rgba(232,224,213,0.8)'
          }}
        />

        {/* Scrims para legibilidad del texto */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{
            zIndex: 5,
            height: '32vh',
            background: `linear-gradient(to bottom, ${BG}ee 0%, ${BG}99 35%, transparent 100%)`
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{
            zIndex: 5,
            height: '55vh',
            background: `linear-gradient(to top, ${BG} 0%, ${BG}d8 42%, transparent 100%)`
          }}
        />

        <ContactFooter winkEyeRef={winkEyeRef} onWink={wink} />
      </div>
    </section>
  )
}
