import type { RefObject } from 'react'
import { STATIONS } from './data'

type Props = {
  starRefs: RefObject<(HTMLDivElement | null)[]>
  labelRefs: RefObject<(HTMLDivElement | null)[]>
  linkRefs: RefObject<(SVGPathElement | null)[]>
  svgRef: RefObject<SVGSVGElement | null>
}

const VW = 1920
const VH = 1000

// Colores del "cielo" del Acto 2 (ya va oscureciendo hacia el espacio)
const STAR = '#f4ede2'
const GLOW = '#e8e0d5'
const LINK = '#e8e0d5'

function pct(x: number, y: number) {
  return { left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%` }
}

// "Constelación naciente": cada experiencia es una estrella que se enciende y
// se conecta con la anterior por una línea que se traza. La activa muestra su
// texto al lado; las visitadas quedan como estrellas tenues conectadas.
export function Trajectory({ starRefs, labelRefs, linkRefs, svgRef }: Props) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 3 }}
    >
      {/* Líneas conectoras entre estrellas consecutivas */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {STATIONS.slice(0, -1).map((s, i) => {
          const n = STATIONS[i + 1]
          return (
            <path
              key={i}
              ref={(el) => {
                linkRefs.current[i] = el
              }}
              d={`M ${s.x} ${s.y} L ${n.x} ${n.y}`}
              stroke={LINK}
              strokeWidth={1.4}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: 0.35 }}
            />
          )
        })}
      </svg>

      {/* Estrellas + labels */}
      {STATIONS.map((s, i) => (
        <div key={s.company} className="absolute" style={pct(s.x, s.y)}>
          {/* Estrella */}
          <div
            ref={(el) => {
              starRefs.current[i] = el
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 8,
              height: 8,
              background: STAR,
              boxShadow: `0 0 16px 3px ${GLOW}`,
              willChange: 'transform, opacity'
            }}
          />

          {/* Label (rol · empresa · años) al lado que corresponde. El padre está
              anclado en el punto de la estrella (0,0 = centro del dot). El label
              se centra verticalmente en ese punto y se desplaza a un lado. */}
          <div
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            className="absolute"
            style={{
              top: 0,
              left: 0,
              width: 340,
              textAlign: s.labelSide === 'right' ? 'left' : 'right',
              transform:
                s.labelSide === 'right'
                  ? 'translate(22px, -50%)'
                  : 'translate(calc(-100% - 22px), -50%)',
              willChange: 'transform, opacity'
            }}
          >
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#b8ab9e',
                marginBottom: '0.5rem'
              }}
            >
              {s.years}
              {s.sector ? ` · ${s.sector}` : ''}
            </div>
            <div
              className="leading-none"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(1.5rem, 2.8vw, 2.4rem)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                color: '#f4ede2'
              }}
            >
              {s.role}
            </div>
            <div
              className="mt-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(0.95rem, 1.3vw, 1.2rem)',
                fontWeight: 400,
                color: '#c9a9b3',
                letterSpacing: '-0.01em'
              }}
            >
              {s.company}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
