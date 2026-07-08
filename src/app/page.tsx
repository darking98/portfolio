'use client'

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import dynamic from 'next/dynamic'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '@/components/Hero'
import Header from '@/components/layout/header'
import About from '@/components/about/about'
import Projects from '@/components/projects/projects'
import Contact from '@/components/contact/contact'
import ScrollGuide from '@/components/ScrollGuide'
import { takeScroll } from '@/lib/scrollStore'

const Loader = dynamic(() => import('@/components/loader/loader'), { ssr: false })

// useLayoutEffect en cliente, useEffect en SSR (evita el warning)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Persiste entre navegaciones (SPA); se resetea solo en un reload completo.
let hasLoaded = false

interface Lenis {
  scrollTo: (t: number, o?: object) => void
  resize: () => void
}

export default function Home() {
  const [heroReady,  setHeroReady]  = useState(hasLoaded)
  const [loaderDone, setLoaderDone] = useState(hasLoaded)
  const loaderResumeRef = useRef<(() => void) | null>(null)

  const handleAvatarLoaded = useCallback(() => {
    loaderResumeRef.current?.()
  }, [])

  // Al volver de otra ruta: restaura la posición de scroll previa.
  useIsoLayoutEffect(() => {
    const y = takeScroll()
    if (y <= 0) return

    const restore = () => {
      // 1) Reconstruye los pin-spacers → altura real del documento
      ScrollTrigger.refresh()
      const lenis = (window as unknown as { lenis?: Lenis }).lenis
      // 2) Lenis recalcula sus límites (si no, clampa a la altura vieja → salta a 0)
      lenis?.resize()
      // 3) Salta a la posición guardada
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(y, { immediate: true, force: true })
      } else {
        window.scrollTo(0, y)
      }
      ScrollTrigger.update()
    }

    restore()
    // Segundo intento tras el paint por si el pin-spacer aún no medía bien
    const id = requestAnimationFrame(restore)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      {!loaderDone && (
        <Loader
          resumeRef={loaderResumeRef}
          onReady={() => setHeroReady(true)}
          onComplete={() => { hasLoaded = true; setLoaderDone(true) }}
        />
      )}
      {loaderDone && <Header />}
      {loaderDone && <ScrollGuide />}
      <main>
        <Hero ready={heroReady} onAvatarLoaded={handleAvatarLoaded} />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
