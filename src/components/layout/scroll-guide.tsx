'use client'

import { useEffect, useState } from 'react'
import { useViewport } from '@/hooks/useViewport'
import { useDarkBackdrop } from '@/hooks/useDarkBackdrop'

const ACCENT = '#6B3040'
const MUTED = '#8a7a70'
const WHITE = '#ffffff'
// Paleta para secciones oscuras (Contact): inactivos en bordo
const D_MUTED = '#6B3040'

// En orden de aparición (deben existir con estos id en el DOM)
// clickOffset (fracción de viewport) = cuánto entrar en la sección al hacer click
const sections = [
  { id: 'experience', label: 'Experience', clickOffset: 0 },
  { id: 'skills', label: 'Skills', clickOffset: 0 },
  { id: 'work', label: 'Work', clickOffset: 0 },
  { id: 'contact', label: 'Contact', clickOffset: 0 }
]

interface Lenis {
  scrollTo: (t: number, o?: object) => void
}

export default function ScrollGuide() {
  const { isMobile } = useViewport()
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(-1)
  // La guía está centrada verticalmente → sonda el fondo a 50% del viewport.
  // Hook compartido con el Header (fondo adaptativo por scroll).
  const dark = useDarkBackdrop(0.5)

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight
      setVisible(window.scrollY > vh * 0.4)

      // Activa = última sección cuyo top ya cruzó el centro del viewport
      let idx = -1
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top <= vh * 0.5) idx = i
      })
      setActive(idx)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const goTo = (id: string, offset = 0) => {
    const el = document.getElementById(id)
    if (!el) return
    const target =
      el.getBoundingClientRect().top + window.scrollY + offset * window.innerHeight
    const lenis = (window as unknown as { lenis?: Lenis }).lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(target, { duration: 1.4 })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }

  // En mobile el nav ya vive en el header (arriba) → el ScrollGuide vertical es
  // redundante y se superponía con la constelación. Todos los hooks corrieron
  // arriba, así que este return no rompe las reglas de hooks.
  if (isMobile) return null

  const mut = dark ? D_MUTED : MUTED
  // Color del item activo según la sección: Experience/Skills/Contact resaltan
  // en blanco; Work mantiene el bordo.
  const activeColor = (i: number) =>
    sections[i]?.id === 'work' ? ACCENT : WHITE

  return (
    <div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease'
      }}
    >
      {/* Línea vertical */}
      <div
        className="absolute right-0 top-0 h-full"
        style={{ width: '1px', background: mut, opacity: 0.3, transition: 'background 0.4s ease' }}
      />

      <div className="flex flex-col gap-6 items-end">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(s.id, s.clickOffset)}
            className="flex items-center gap-3 group cursor-pointer"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <span
              className={`hover:opacity-80! ${active === i ? 'font-bold' : ''}`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.58rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: active === i ? activeColor(i) : mut,
                opacity: active === i ? 1 : 0.55,
                transition: 'color 0.4s ease, opacity 0.3s ease'
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                display: 'block',
                width: active === i ? '16px' : '7px',
                height: '1px',
                background: active === i ? activeColor(i) : mut,
                transition: 'width 0.3s ease, background 0.4s ease'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
