'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

// Campo de estrellas en Canvas 2D dedicado (NO R3F — no agrega contexto WebGL).
// Full-screen fijo detrás de la constelación; parallax por mouse en capas de
// profundidad + twinkle. El rAF sigue corriendo pero salta el dibujo cuando el
// canvas no está en viewport (IntersectionObserver) para no gastar frames.
//
// Expone una API imperativa `warp(cx, cy)`: acelera todas las estrellas en
// líneas de velocidad radiando desde (cx,cy) → efecto hyperspace hacia ese
// punto. Devuelve una promesa que resuelve cerca del pico (para encadenar la
// navegación). `resetWarp()` vuelve al estado normal.
type Star = {
  x: number
  y: number
  z: number // profundidad 0..1 (chica = lejos, lenta, tenue)
  r: number
  tw: number // fase de twinkle
  tws: number // velocidad de twinkle
}

type Meteor = {
  x: number
  y: number
  vx: number
  vy: number
  len: number
}

export type StarfieldHandle = {
  warp: (cx: number, cy: number) => Promise<void>
  resetWarp: () => void
}

export const Starfield = forwardRef<StarfieldHandle>(function Starfield(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Estado de warp compartido con el loop (mutable, sin re-render)
  const warpRef = useRef({ active: false, t: 0, cx: 0, cy: 0 })

  useImperativeHandle(ref, () => ({
    warp: (cx: number, cy: number) => {
      warpRef.current = { active: true, t: 0, cx, cy }
      // Dispara la navegación cuando el flash ya llena la pantalla → la view
      // transition revela el destino desde el blanco sin pausa.
      return new Promise<void>((resolve) => setTimeout(resolve, 620))
    },
    resetWarp: () => {
      warpRef.current.active = false
      warpRef.current.t = 0
    }
  }))

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
    let nextMeteor = 1.2 + Math.random() * 2.5
    const mouse = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const spawnMeteor = () => {
      const ltr = Math.random() < 0.5
      const speed = 400 + Math.random() * 480
      const angle = (12 + Math.random() * 16) * (Math.PI / 180)
      const dir = ltr ? 1 : -1
      meteors.push({
        x: ltr ? -80 : w + 80,
        y: Math.random() * h * 0.6,
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

      const count = Math.round((w * h) / 6500)
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
      const warp = warpRef.current
      // Durante el warp seguimos dibujando aunque el IO diga no-visible (el
      // click puede dispararlo en cualquier momento).
      if (!visible && !warp.active) return

      mouse.x += (target.x - mouse.x) * 0.05
      mouse.y += (target.y - mouse.y) * 0.05

      // progreso del warp 0..1 (dura ~0.9s)
      let wp = 0
      if (warp.active) {
        warp.t += dt
        wp = Math.min(warp.t / 0.72, 1)
      }
      // easeInCubic: acelera fuerte hacia el final (flash lleno cerca de navegar)
      const accel = wp * wp * wp

      // durante el warp oscurecemos con estela (no clear total) → rastros
      if (warp.active) {
        ctx.fillStyle = `rgba(13, 10, 18, ${0.35 - accel * 0.15})`
        ctx.fillRect(0, 0, w, h)
      } else {
        ctx.clearRect(0, 0, w, h)
      }

      for (const s of stars) {
        s.tw += dt * s.tws

        if (warp.active) {
          // vector desde el punto de warp a la estrella → dirección de fuga
          const dx = s.x - warp.cx
          const dy = s.y - warp.cy
          const dist = Math.hypot(dx, dy) || 1
          const ux = dx / dist
          const uy = dy / dist
          // las estrellas se alejan del punto acelerando (efecto de caer hacia él)
          const push = accel * (dist * 1.4 + 120)
          const hx = s.x + ux * push
          const hy = s.y + uy * push
          // estela: línea desde posición base a la posición empujada
          const streak = 8 + accel * 90
          const tailX = hx - ux * streak
          const tailY = hy - uy * streak
          const alpha = 0.5 + accel * 0.5
          const grad = ctx.createLinearGradient(hx, hy, tailX, tailY)
          grad.addColorStop(0, `rgba(255, 250, 244, ${alpha})`)
          grad.addColorStop(1, 'rgba(232, 224, 213, 0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 0.8 + s.z * 1.6
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(hx, hy)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()
          continue
        }

        const px = s.x - mouse.x * 26 * s.z
        const py = s.y - mouse.y * 18 * s.z
        const twinkle = 0.55 + 0.45 * Math.sin(s.tw)
        const alpha = (0.22 + s.z * 0.6) * twinkle
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 224, 213, ${alpha})`
        ctx.fill()
      }

      // Núcleo de luz creciendo en el punto de warp (el "destino"). El radio se
      // mide hasta la esquina MÁS LEJANA del punto → así llena toda la pantalla
      // aunque la estrella esté en un borde. `flash` va más rápido que accel
      // para que el blanco domine casi toda la pantalla cerca del disparo.
      if (warp.active) {
        const corner = Math.hypot(
          Math.max(warp.cx, w - warp.cx),
          Math.max(warp.cy, h - warp.cy)
        )
        const flash = Math.min(wp * 1.35, 1) // llega a 1 antes que el final
        const rad = 4 + flash * corner * 1.15
        const core = ctx.createRadialGradient(
          warp.cx,
          warp.cy,
          0,
          warp.cx,
          warp.cy,
          rad
        )
        core.addColorStop(0, `rgba(255, 253, 250, ${0.2 + flash * 0.8})`)
        core.addColorStop(0.65, `rgba(244, 238, 230, ${flash * 0.7})`)
        core.addColorStop(1, 'rgba(232, 224, 213, 0)')
        ctx.fillStyle = core
        ctx.beginPath()
        ctx.arc(warp.cx, warp.cy, rad, 0, Math.PI * 2)
        ctx.fill()
      }

      if (warp.active) return // sin meteoros durante el warp

      // ── Estrellas fugaces ──
      nextMeteor -= dt
      if (nextMeteor <= 0) {
        spawnMeteor()
        nextMeteor = 2.5 + Math.random() * 4
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx * dt
        m.y += m.vy * dt
        if (m.x < -160 || m.x > w + 160 || m.y > h + 160) {
          meteors.splice(i, 1)
          continue
        }
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
})
