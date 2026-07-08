'use client'

import { useState, useEffect } from 'react'

const LABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.65rem',
  letterSpacing: '0.14em',
  color: '#8a7a70',
  textTransform: 'uppercase',
}

export default function Header() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires',
      }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem 2rem',
      animation: 'headerFadeIn 0.7s ease forwards',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span style={LABEL}>{time}</span>
        <span style={{ ...LABEL, color: '#b0a090' }}>·</span>
        <span style={LABEL}>Buenos Aires</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#7d9b6a',
              display: 'inline-block',
              boxShadow: '0 0 0 0 rgba(125, 155, 106, 0.6)',
              animation: 'availablePulse 2.4s ease-in-out infinite',
            }}
          />
          <span style={LABEL}>Available for work</span>
        </div>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <a href="#about" style={LABEL}>About</a>
        <a href="#work"  style={LABEL}>Work</a>
      </nav>
    </header>
  )
}
