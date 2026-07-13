import type { RefObject } from 'react'
import { CLOSER } from './data'

type Props = {
  closerRef: RefObject<HTMLDivElement | null>
  // Portrait/mobile: baja el cierre para separarlo de la estrella Frontend
  // (que en columna queda cerca del fondo). Centrado en vez de a la izquierda.
  vertical: boolean
}

// Cierre cinético (toque de B): frase corta que se ensambla al final y hace de
// puente hacia Projects. Va sobre el fondo oscuro del Acto 3 → paleta clara.
export function Closer({ closerRef, vertical }: Props) {
  return (
    <div
      ref={closerRef}
      className={
        vertical
          ? 'absolute bottom-[5vh] left-0 right-0 px-6 text-center'
          : 'absolute bottom-[14vh] left-10 md:left-20'
      }
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
