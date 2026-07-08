'use client'

import { LABEL } from './constants'
import { useClock } from './use-clock'
import { HeaderStatus } from './header-status'

export default function Header() {
  const time = useClock()

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        animation: 'headerFadeIn 0.7s ease forwards'
      }}
    >
      <HeaderStatus time={time} />
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <a href="#about" style={LABEL}>
          About
        </a>
        <a href="#work" style={LABEL}>
          Work
        </a>
        <a href="#contact" style={LABEL}>
          Contact
        </a>
      </nav>
    </header>
  )
}
