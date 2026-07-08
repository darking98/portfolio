'use client'

import { useRef, useEffect } from 'react'
import SmilingFace from '@/ui/smiling-face'
import { ALL_WORDS, wordStyle, type LoaderProps } from './constants'
import { useLoaderSequence } from './use-loader-sequence'

export default function Loader({
  resumeRef,
  onReady,
  onComplete
}: LoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const faceRef = useRef<HTMLDivElement>(null)
  const winkEyeRef = useRef<SVGGElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    document.getElementById('__loader_cover')?.remove()
  }, [])

  useLoaderSequence({
    overlayRef,
    faceRef,
    winkEyeRef,
    wordsRef,
    resumeRef,
    onReady,
    onComplete
  })

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50"
      style={{
        background: '#6B3040',
        borderBottom: '4px solid rgba(42, 31, 24, 0.18)',
        willChange: 'transform'
      }}
    >
      {/* Palabras */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            position: 'relative',
            width: '18em',
            height: '2em',
            overflow: 'hidden'
          }}
        >
          {ALL_WORDS.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                wordsRef.current[i] = el
              }}
              style={wordStyle}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Carita feliz */}
      <SmilingFace faceRef={faceRef} winkEyeRef={winkEyeRef} />
    </div>
  )
}
