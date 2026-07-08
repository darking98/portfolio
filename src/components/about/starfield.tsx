'use client'

import { useEffect, useRef } from 'react'

// Campo de estrellas en Canvas 2D dedicado (NO R3F — no agrega contexto WebGL).
// Full-screen fijo detrás de la constelación; parallax por mouse en capas de
// profundidad + twinkle. El rAF sigue corriendo pero salta el dibujo cuando el
// canvas no está en viewport (IntersectionObserver) para no gastar frames.
type Star = {
  x: number
  y: number
  z: number // profundidad 0..1 (chica = lejos, lenta, tenue)
  r: number
  tw: number // fase de twinkle
  tws: number // velocidad de twinkle
}

// Estrella fugaz: cruza en diagonal, deja estela, y muere fuera de pantalla.
type Meteor = {
  x: number
  y: number
  vx: number
  vy: number
  len: number // largo de la estela (px)
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let stars: Star[] = []
    let visible = true
    const meteors: Meteor[] = []
    let nextMeteor = 1.2 + Math.random() * 2.5 // segundos hasta el próximo
    const mouse = { x: 0, y: 0 } // -1..1 suavizado
    const target = { x: 0, y: 0 }

    const spawnMeteor = () => {
      const ltr = Math.random() < 0.5 // izq→der o der→izq
      const speed = 400 + Math.random() * 480 // px/s
      const angle = (12 + Math.random() * 16) * (Math.PI / 180) // leve diagonal
      const dir = ltr ? 1 : -1
      meteors.push({
        x: ltr ? -80 : w + 80,
        y: Math.random() * h * 0.6, // aparecen en la mitad superior sobre todo
        vx: dir * speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        len: 90 + Math.random() * 120
      })
    }

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round((w * h) / 6500) // densidad responsive
      stars = Array.from({ length: count }, () => {
        const z = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.4 + z * 1.4,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.4
        }
      })
    }

    build()

    const onResize = () => build()
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
      },
      { rootMargin: '20%' }
    )
    io.observe(canvas)

    let raf = 0
    let last = performance.now()
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      if (!visible) return

      // parallax suavizado
      mouse.x += (target.x - mouse.x) * 0.05
      mouse.y += (target.y - mouse.y) * 0.05

      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        s.tw += dt * s.tws
        // capas: las cercanas (z alto) se desplazan más → profundidad
        const px = s.x - mouse.x * 26 * s.z
        const py = s.y - mouse.y * 18 * s.z
        const twinkle = 0.55 + 0.45 * Math.sin(s.tw)
        const alpha = (0.22 + s.z * 0.6) * twinkle
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 224, 213, ${alpha})`
        ctx.fill()
      }

      // ── Estrellas fugaces ──
      nextMeteor -= dt
      if (nextMeteor <= 0) {
        spawnMeteor()
        nextMeteor = 2.5 + Math.random() * 4 // cada ~2.5–6.5s
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx * dt
        m.y += m.vy * dt
        // fuera de pantalla (con margen) → muere
        if (m.x < -160 || m.x > w + 160 || m.y > h + 160) {
          meteors.splice(i, 1)
          continue
        }
        // estela: gradiente desde la cabeza hacia atrás (opuesto a la velocidad)
        const mag = Math.hypot(m.vx, m.vy) || 1
        const ux = m.vx / mag
        const uy = m.vy / mag
        const tailX = m.x - ux * m.len
        const tailY = m.y - uy * m.len
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
        grad.addColorStop(0, 'rgba(255, 250, 244, 0.9)')
        grad.addColorStop(0.4, 'rgba(232, 224, 213, 0.35)')
        grad.addColorStop(1, 'rgba(232, 224, 213, 0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()
        // cabeza brillante
        ctx.beginPath()
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 252, 247, 0.95)'
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
