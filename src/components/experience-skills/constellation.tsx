import { useState, useMemo, useRef, useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { CLUSTERS, type ClusterId, type Cluster } from './data'

type Props = {
  constRef: RefObject<HTMLDivElement | null>
  // Portrait/mobile: nodos-madre en coords xM/yM (columna) — coinciden con el
  // destino del morph de las estrellas-experiencia.
  vertical: boolean
}

const VW = 1920
const VH = 1000

// Colores del "espacio" (Acto 3 oscuro)
const STAR = '#e8e0d5'
const STAR_AI = '#e8e0d5' // AI sin color propio (mismo crema que el resto)
const DIM = '#9a8f9c'

// Distribuye N skills en anillos concéntricos alrededor del nodo-madre.
// Offsets en coordenadas de viewBox respecto al centro del cluster.
function orbit(count: number) {
  const out: { dx: number; dy: number; r: number }[] = []
  const rings = [
    { r: 155, cap: 6 },
    { r: 285, cap: 9 },
    { r: 415, cap: 14 }
  ]
  let placed = 0
  for (const ring of rings) {
    const n = Math.min(ring.cap, count - placed)
    if (n <= 0) break
    const phase = (ring.r / 155) * 0.5
    for (let i = 0; i < n; i++) {
      const a = phase + (i / n) * Math.PI * 2
      out.push({
        dx: Math.cos(a) * ring.r,
        dy: Math.sin(a) * ring.r * 0.72,
        r: ring.r
      })
      placed++
    }
    if (placed >= count) break
  }
  return out
}

function pct(x: number, y: number) {
  return { left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%` }
}

export function Constellation({ constRef, vertical }: Props) {
  const [active, setActive] = useState<ClusterId | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  // Parallax por mouse sobre la capa de clusters (nodos + skills se desplazan
  // juntos). Cada skill suma además un factor propio por su profundidad orbital
  // (data-depth) para que las de los anillos externos se muevan un poco más.
  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    const depthEls = Array.from(
      layer.querySelectorAll<HTMLElement>('[data-depth]')
    )
    const lx = gsap.quickTo(layer, 'x', { duration: 0.9, ease: 'power3' })
    const ly = gsap.quickTo(layer, 'y', { duration: 0.9, ease: 'power3' })
    const setters = depthEls.map((el) => {
      const d = parseFloat(el.dataset.depth || '0')
      return {
        x: gsap.quickTo(el, '--px', { duration: 0.9, ease: 'power3' }),
        y: gsap.quickTo(el, '--py', { duration: 0.9, ease: 'power3' }),
        d
      }
    })
    // Throttle a rAF: no encolar tweens por cada evento de mousemove (que puede
    // disparar cientos por segundo) → un solo update por frame.
    let raf = 0
    let nx = 0
    let ny = 0
    const apply = () => {
      raf = 0
      lx(-nx * 20)
      ly(-ny * 14)
      for (const s of setters) {
        s.x(-nx * s.d)
        s.y(-ny * s.d * 0.7)
      }
    }
    const onMove = (e: MouseEvent) => {
      nx = e.clientX / window.innerWidth - 0.5
      ny = e.clientY / window.innerHeight - 0.5
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
      // Mata los tweens quickTo (siguen vivos en el ticker global de GSAP si no
      // se limpian → fuga de memoria al remontar Experience/Skills).
      gsap.killTweensOf(layer)
      depthEls.forEach((el) => gsap.killTweensOf(el))
    }
  }, [])

  const orbits = useMemo(
    () =>
      CLUSTERS.reduce<Record<ClusterId, ReturnType<typeof orbit>>>(
        (acc, c) => {
          acc[c.id] = orbit(c.skills.length)
          return acc
        },
        {} as Record<ClusterId, ReturnType<typeof orbit>>
      ),
    []
  )

  return (
    <div
      ref={constRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 3, willChange: 'transform, opacity' }}
      onClick={() => setActive(null)}
    >
      {/* El cielo oscuro y el starfield ahora son globales de la sección
          (ascienden a lo largo del scroll). Acá solo viven los clusters. */}

      {/* Clusters */}
      <div ref={layerRef} className="absolute inset-0" style={{ zIndex: 2 }}>
        {CLUSTERS.map((c) => {
          const isActive = active === c.id
          const dimmed = active !== null && !isActive
          return (
            <ClusterView
              key={c.id}
              cluster={c}
              isActive={isActive}
              dimmed={dimmed}
              orbit={orbits[c.id]}
              vertical={vertical}
              onOpen={() => setActive(c.id)}
              onCollapse={() => setActive(null)}
            />
          )
        })}
      </div>
    </div>
  )
}

function ClusterView({
  cluster,
  isActive,
  dimmed,
  orbit,
  vertical,
  onOpen,
  onCollapse
}: {
  cluster: Cluster
  isActive: boolean
  dimmed: boolean
  orbit: { dx: number; dy: number; r: number }[]
  vertical: boolean
  onOpen: () => void
  onCollapse: () => void
}) {
  const isAI = cluster.id === 'ai'
  const starColor = isAI ? STAR_AI : STAR

  const clusterStyle: React.CSSProperties = {
    ...pct(vertical ? cluster.xM : cluster.x, vertical ? cluster.yM : cluster.y),
    transform: `translate(-50%, -50%) scale(${dimmed ? 0.82 : 1})`,
    opacity: dimmed ? 0.32 : 1,
    transition:
      'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)'
  }

  return (
    <div className="absolute" style={clusterStyle}>
      {/* Skills como estrellas orbitando: la palabra ES la estrella (glow),
          sin bullet. Jerarquía por anillo → profundidad. */}
      {orbit.map((o, i) => {
        const skill = cluster.skills[i]
        // twinkle desincronizado por índice
        const delay = isActive ? 0.1 + i * 0.028 : 0
        // anillo 0 (interno) → 2 (externo), derivado del radio
        const ring = o.r <= 200 ? 0 : o.r <= 340 ? 1 : 2
        // profundidad de parallax: anillos externos se mueven más
        const depth = 16 + ring * 14
        // jerarquía tipográfica: interno grande/opaco, externo chico/tenue
        const size = [0.98, 0.86, 0.76][ring]
        const dim = [1, 0.82, 0.62][ring]
        const glow = [10, 7, 5][ring]
        return (
          // Wrapper de parallax (sin transition: lo mueve GSAP por frame vía
          // --px/--py; no debe pelear con la transición del orbit interno)
          <span
            key={skill}
            data-depth={depth}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform:
                'translate(-50%, -50%) translate(calc(var(--px, 0) * 1px), calc(var(--py, 0) * 1px))'
            }}
          >
          <button
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              // Click en una estrella expandida → retrae el cluster
              e.stopPropagation()
              if (isActive) onCollapse()
            }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap select-none"
            style={{
              left: 0,
              top: 0,
              transform: `translate(-50%, -50%) translate(${
                isActive ? o.dx : 0
              }px, ${isActive ? o.dy : 0}px) scale(${isActive ? 1 : 0.3})`,
              opacity: isActive ? dim : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              transition: `opacity 0.55s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, text-shadow 0.25s ease, color 0.25s ease`,
              background: 'transparent',
              border: 'none',
              cursor: isActive ? 'pointer' : 'default',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: `${size}rem`,
              fontWeight: ring === 0 ? 500 : 400,
              letterSpacing: '0.01em',
              color: isAI ? STAR_AI : '#e6ddd2',
              textShadow: `0 0 ${glow}px ${starColor}${ring === 2 ? '55' : '99'}`
            }}
            onMouseEnter={(e) => {
              if (!isActive) return
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.textShadow = `0 0 16px ${starColor}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isAI ? STAR_AI : '#e6ddd2'
              e.currentTarget.style.textShadow = `0 0 ${glow}px ${starColor}${
                ring === 2 ? '55' : '99'
              }`
            }}
          >
            {skill}
          </button>
          </span>
        )
      })}

      {/* Nodo-madre (la "estrella brillante" del cluster) */}
      {/* El PUNTO del nodo-madre se ancla exactamente en (cluster.x, cluster.y)
          — el mismo destino al que aterriza la estrella-experiencia. El label y
          el "tap to reveal" cuelgan absolutos debajo, sin desplazar el punto. */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (isActive) onCollapse()
          else onOpen()
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: '50%',
          width: isAI ? 16 : 13,
          height: isAI ? 16 : 13,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <span
          className="relative block rounded-full"
          style={{
            width: '100%',
            height: '100%',
            background: starColor,
            boxShadow: isActive
              ? `0 0 24px 4px ${starColor}, 0 0 0 10px ${starColor}14`
              : `0 0 14px 2px ${starColor}aa`,
            transition: 'box-shadow 0.45s ease'
          }}
        >
          <span
            className="station-pulse absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 0 0 ${starColor}` }}
          />
        </span>

        {/* Label + hint, colgando debajo del punto (no afectan su centro) */}
        <span
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 whitespace-nowrap"
          style={{ top: 'calc(100% + 12px)' }}
        >
          <span
            className="uppercase"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isAI ? '0.85rem' : '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              color: isAI ? STAR_AI : STAR
            }}
          >
            {cluster.label}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: DIM,
              opacity: isActive ? 0 : 0.75,
              transition: 'opacity 0.3s ease'
            }}
          >
            {cluster.skills.length} · tap to reveal
          </span>
        </span>
      </button>
    </div>
  )
}
