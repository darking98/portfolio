'use client'

import { useTransitionRouter } from 'next-view-transitions'
import { slideDown } from '@/lib/transition'

export default function ExamplePage() {
  const router = useTransitionRouter()

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center gap-6 px-10"
      style={{ background: '#6B3040', color: '#e8e0d5' }}
    >
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.65rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.6,
        }}
      >
        Example route
      </span>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(2.5rem, 8vw, 7rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        una boludez.
      </h1>
      <button
        onClick={() => router.push('/', { onTransitionReady: slideDown, scroll: false })}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
          opacity: 0.85,
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        ← volver
      </button>
    </main>
  )
}
