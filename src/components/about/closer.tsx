import type { RefObject } from 'react'
import { CLOSER } from './data'

type Props = {
  closerRef: RefObject<HTMLDivElement | null>
}

// Cierre cinético (toque de B): frase corta que se ensambla al final y hace de
// puente hacia Projects. Va sobre el fondo oscuro del Acto 3 → paleta clara.
export function Closer({ closerRef }: Props) {
  return (
    <div
      ref={closerRef}
      className="absolute bottom-[14vh] left-10 md:left-20"
      style={{ zIndex: 6, willChange: 'transform, opacity' }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(1.6rem, 3.4vw, 3rem)',
          fontWeight: 500,
          letterSpacing: '-0.03em',
          lineHeight: 1.05
        }}
      >
        <span style={{ color: '#e8e0d5', opacity: 0.7 }}>{CLOSER.pre} </span>
        <span style={{ color: '#e8e0d5' }}>{CLOSER.accent}</span>
      </div>
    </div>
  )
}
