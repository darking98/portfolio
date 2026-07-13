import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { STATIONS, type Station } from './data'

type Props = {
  wrapRef: RefObject<HTMLDivElement | null>
  starRefs: RefObject<(HTMLDivElement | null)[]>
  labelRefs: RefObject<(HTMLDivElement | null)[]>
  linkRefs: RefObject<(SVGPathElement | null)[]>
  svgRef: RefObject<SVGSVGElement | null>
  onStarClick: (station: Station, cx: number, cy: number) => void
  // Portrait/mobile: coords en columna zigzag (xM/yM) + label debajo del punto.
  vertical: boolean
}

const VW = 1920
const VH = 1000

// Coords activas de una estación según orientación (horizontal vs zigzag mobile).
function coords(s: Station, vertical: boolean) {
  return vertical ? { x: s.xM, y: s.yM } : { x: s.x, y: s.y }
}

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
export function Trajectory({
  wrapRef,
  starRefs,
  labelRefs,
  linkRefs,
  svgRef,
  onStarClick,
  vertical
}: Props) {
  // Capa de parallax: envuelve estrellas + líneas y se desplaza en bloque según
  // el mouse (profundidad respecto al starfield de fondo, que se mueve a otra
  // velocidad). Va en un wrapper propio → NO pisa el x/y del scrub de cada
  // estrella (mina #9), y al mover todo junto las líneas siguen pegadas a los
  // puntos. quickTo throttleado a rAF + killTweensOf en cleanup (mina #7).
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = parallaxRef.current
    // En mobile/portrait no hay puntero fino → sin parallax de mouse (evita
    // trabajo por-frame y no descoloca la columna). Mina #7.
    if (!el || vertical) return
    const toX = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power2' })
    const toY = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power2' })
    const AMP = 26 // px de desplazamiento máximo

    const mouse = { x: 0, y: 0, dirty: false }
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
      mouse.dirty = true
    }
    const apply = () => {
      if (!mouse.dirty) return
      mouse.dirty = false
      toX(mouse.x * AMP)
      toY(mouse.y * AMP * 0.6)
    }

    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(apply)
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(apply)
      gsap.killTweensOf(el)
    }
  }, [vertical])

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 3 }}
    >
     {/* Capa de parallax (mouse): mueve estrellas + líneas en bloque. El scrub
         anima la opacity de wrapRef (padre) → no colisiona con el x/y de acá. */}
     <div ref={parallaxRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
      {/* Líneas conectoras entre estrellas consecutivas.
          viewBox 0–100 + preserveAspectRatio="none" → coordenadas en % del
          viewport, EL MISMO mapeo que usan las estrellas (pct). Así los extremos
          de la línea caen exactamente sobre el centro de cada punto. El escalado
          no-uniforme no deforma el trazo gracias a non-scaling-stroke. */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {STATIONS.slice(0, -1).map((s, i) => {
          const n = STATIONS[i + 1]
          const a = coords(s, vertical)
          const b = coords(n, vertical)
          const x1 = (a.x / VW) * 100
          const y1 = (a.y / VH) * 100
          const x2 = (b.x / VW) * 100
          const y2 = (b.y / VH) * 100
          return (
            <path
              key={i}
              ref={(el) => {
                linkRefs.current[i] = el
              }}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
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
      {STATIONS.map((s, i) => {
        const c = coords(s, vertical)
        return (
        <div key={s.company} className="absolute" style={pct(c.x, c.y)}>
          {/* Estrella = botón (hit-area 34px). GSAP anima este elemento
              (autoAlpha/scale/x/y por scrub + morph): al estar oculto por
              autoAlpha:hidden, no es clickeable → solo clickeable cuando está
              encendida. pointer-events-auto solo acá (el contenedor es none). */}
          <button
            ref={(el) => {
              starRefs.current[i] = el as unknown as HTMLDivElement
            }}
            aria-label={`${s.role} — ${s.company}`}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              onStarClick(s, r.left + r.width / 2, r.top + r.height / 2)
            }}
            className="group absolute flex items-center justify-center"
            style={{
              width: 34,
              height: 34,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              willChange: 'transform, opacity'
            }}
          >
            <div
              className="rounded-full transition-[box-shadow,width,height] duration-300 group-hover:w-3 group-hover:h-3"
              style={{
                width: 8,
                height: 8,
                background: STAR,
                boxShadow: `0 0 16px 3px ${GLOW}`
              }}
            />
          </button>

          {/* Label (rol · empresa · años). Desktop: al lado del punto (labelSide).
              Mobile/portrait: SIEMPRE debajo del punto, centrado y más angosto.
              MINA #9: el POSICIONAMIENTO (translate de centrado/lado) va en el
              wrapper externo; el elemento que GSAP anima (labelRefs → y/autoAlpha/
              blur) es el hijo interno SIN transform de posición. Si compartieran
              transform, el `y` de GSAP pisaría el translate de centrado y el label
              caía descolocado (se veía cortado contra el borde en mobile). */}
          <div
            className="absolute"
            style={
              vertical
                ? {
                    top: 0,
                    left: '50%',
                    width: 'min(210px, 58vw)',
                    textAlign: 'center',
                    transform: 'translate(-50%, 24px)'
                  }
                : {
                    top: 0,
                    left: 0,
                    width: 340,
                    textAlign: s.labelSide === 'right' ? 'left' : 'right',
                    transform:
                      s.labelSide === 'right'
                        ? 'translate(22px, -50%)'
                        : 'translate(calc(-100% - 22px), -50%)'
                  }
            }
          >
            <div
              ref={(el) => {
                labelRefs.current[i] = el
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#b8ab9e',
                  // Más aire en mobile: los roles de 2 líneas (AI Full Stack /
                  // Front End) quedaban pegados a este kicker de años.
                  marginBottom: vertical ? '0.85rem' : '0.5rem'
                }}
              >
                {s.years}
                {s.sector ? ` · ${s.sector}` : ''}
              </div>
              <div
                className="leading-none"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: vertical
                    ? 'clamp(1.35rem, 6vw, 1.9rem)'
                    : 'clamp(1.5rem, 2.8vw, 2.4rem)',
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
                  fontSize: vertical
                    ? 'clamp(0.9rem, 3.6vw, 1.1rem)'
                    : 'clamp(0.95rem, 1.3vw, 1.2rem)',
                  fontWeight: 400,
                  color: '#c9a9b3',
                  letterSpacing: '-0.01em'
                }}
              >
                {s.company}
              </div>
            </div>
          </div>
        </div>
        )
      })}
     </div>
    </div>
  )
}
