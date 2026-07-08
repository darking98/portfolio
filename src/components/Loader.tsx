'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

const WORDS_LOADING = ['hello...', 'thinking...', 'designing...', 'creating...']
const WORDS_WAITING = ['optimizing...', 'rendering...', 'compiling...', 'polishing...']
const WORD_DONE     = 'done.'
const ALL_WORDS     = [...WORDS_LOADING, ...WORDS_WAITING, WORD_DONE]

interface LoaderProps {
  resumeRef:  { current: (() => void) | null }
  onReady:    () => void
  onComplete: () => void
}

export default function Loader({ resumeRef, onReady, onComplete }: LoaderProps) {
  const overlayRef  = useRef<HTMLDivElement>(null)
  const faceRef     = useRef<HTMLDivElement>(null)
  const winkEyeRef  = useRef<SVGGElement>(null)
  const wordsRef    = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    document.getElementById('__loader_cover')?.remove()
  }, [])

  useGSAP(() => {
    // Init: palabras abajo, carita oculta
    for (let i = 0; i < ALL_WORDS.length; i++) {
      if (wordsRef.current[i]) gsap.set(wordsRef.current[i], { yPercent: 100 })
    }
    gsap.set(faceRef.current, { scale: 0.5, autoAlpha: 0 })

    const waitingEls = WORDS_WAITING.map((_, i) => wordsRef.current[WORDS_LOADING.length + i])

    let currentEl   = wordsRef.current[0]!
    let avatarReady = false
    let pendingDelay: gsap.core.Tween | null = null
    let waitIdx     = 0
    let finished    = false

    const doneEl = wordsRef.current[ALL_WORDS.length - 1]!

    // Transición final → "done." → carita feliz → guiño → se levanta el overlay
    const goToSmiley = () => {
      if (finished) return
      finished = true

      const from = currentEl
      const tl = gsap.timeline()

      // sale la palabra actual, entra "done."
      gsap.set(doneEl, { yPercent: 100 })
      tl.to(from, { yPercent: -100, duration: 0.38, ease: 'power2.inOut' })
      tl.to(doneEl, { yPercent: 0, duration: 0.38, ease: 'power2.inOut' }, '<')

      // "done." se mantiene un momento y sale
      tl.to(doneEl, { yPercent: -100, duration: 0.38, ease: 'power2.inOut' }, '+=0.6')

      // entra la carita con un rebote
      tl.to(faceRef.current, {
        scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.7)',
      }, '-=0.1')

      // guiño (un ojo se cierra y vuelve)
      tl.to(winkEyeRef.current, {
        scaleY: 0.08, duration: 0.12, transformOrigin: 'center center', ease: 'power2.in',
      }, '+=0.45')
      tl.to(winkEyeRef.current, {
        scaleY: 1, duration: 0.22, transformOrigin: 'center center', ease: 'back.out(2.5)',
      })

      // el hero arranca su entrada detrás del overlay
      tl.add(() => onReady(), '+=0.25')

      // se expande el hero: el overlay se va para arriba
      tl.to(overlayRef.current, {
        yPercent: -100, duration: 1.15, ease: 'power4.inOut', onComplete,
      }, '+=0.3')
    }

    // Loop de palabras de espera hasta que el avatar cargue
    const waitLoop = () => {
      if (avatarReady) { goToSmiley(); return }

      const from = currentEl
      const to   = waitingEls[waitIdx % waitingEls.length]!
      waitIdx++
      currentEl = to

      gsap.set(to, { yPercent: 100 })
      gsap.to(from, { yPercent: -100, duration: 0.38, ease: 'power2.inOut' })
      gsap.to(to, {
        yPercent: 0, duration: 0.38, ease: 'power2.inOut',
        onComplete: () => {
          if (avatarReady) { goToSmiley(); return }
          pendingDelay = gsap.delayedCall(0.5, waitLoop)
        },
      })
    }

    // Señal desde page.tsx cuando el avatar cargó
    resumeRef.current = () => {
      if (avatarReady) return
      avatarReady = true
      if (pendingDelay) {
        pendingDelay.kill()
        goToSmiley()
      }
    }

    // Fase 1: ciclar palabras de carga
    const tl = gsap.timeline()
    tl.to(wordsRef.current[0], { yPercent: 0, duration: 0.38, ease: 'power2.out' })

    for (let i = 0; i < WORDS_LOADING.length - 1; i++) {
      const curr = wordsRef.current[i]
      const next = wordsRef.current[i + 1]
      if (!curr || !next) continue
      tl.to({}, { duration: 0.48 })
      tl.to(curr, { yPercent: -100, duration: 0.38, ease: 'power2.inOut' })
      tl.to(next, { yPercent: 0,    duration: 0.38, ease: 'power2.inOut' }, '<')
    }

    // Fase 2: loop de espera
    tl.call(() => {
      currentEl    = wordsRef.current[WORDS_LOADING.length - 1]!
      pendingDelay = gsap.delayedCall(0.48, waitLoop)
    })
  })

  const wordStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
    fontWeight: 700,
    fontStyle: 'italic',
    color: '#e8e0d5',
    letterSpacing: '0.06em',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50"
      style={{ background: '#6B3040', borderBottom: '4px solid rgba(42, 31, 24, 0.18)', willChange: 'transform' }}
    >
      {/* Palabras */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ position: 'relative', width: '18em', height: '2em', overflow: 'hidden' }}>
          {ALL_WORDS.map((word, i) => (
            <span key={i} ref={(el) => { wordsRef.current[i] = el }} style={wordStyle}>
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Carita feliz */}
      <div
        ref={faceRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <svg width="96" height="96" viewBox="0 0 100 100" fill="none">
          {/* ojo izquierdo */}
          <circle cx="36" cy="40" r="5.5" fill="#e8e0d5" />
          {/* ojo derecho (guiña) */}
          <g ref={winkEyeRef}>
            <circle cx="64" cy="40" r="5.5" fill="#e8e0d5" />
          </g>
          {/* sonrisa */}
          <path
            d="M32 58 Q50 76 68 58"
            stroke="#e8e0d5"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  )
}
