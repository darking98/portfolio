'use client'

import { useEffect, useState } from 'react'

const ACCENT = '#6B3040'
const MUTED = '#8a7a70'

// En orden de aparición (deben existir con estos id en el DOM)
// clickOffset (fracción de viewport) = cuánto entrar en la sección al hacer click
const sections = [
  { id: 'about', label: 'About', clickOffset: 0.4 },
  { id: 'work', label: 'Work', clickOffset: 0 },
  { id: 'contact', label: 'Contact', clickOffset: 0 }
]

interface Lenis {
  scrollTo: (t: number, o?: object) => void
}

export default function ScrollGuide() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(-1)

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

  return (
    <div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
    >
      {/* Línea vertical */}
      <div
        className="absolute right-0 top-0 h-full"
        style={{ width: '1px', background: MUTED, opacity: 0.25 }}
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
                color: active === i ? ACCENT : MUTED,
                opacity: active === i ? 1 : 0.55,
                transition: 'color 0.3s ease, opacity 0.3s ease'
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                display: 'block',
                width: active === i ? '16px' : '7px',
                height: '1px',
                background: active === i ? ACCENT : MUTED,
                transition: 'width 0.3s ease, background 0.3s ease'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
