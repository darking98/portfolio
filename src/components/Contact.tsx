'use client'

import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, AsciiRenderer } from '@react-three/drei'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

const BG = '#171210'
const CREAM = '#e8e0d5'
const ACCENT = '#b04a5a'

const LABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase'
}

// Link con fondo pill oscuro para contrastar sobre el ASCII
const LINK: React.CSSProperties = {
  ...LABEL,
  color: CREAM,
  fontWeight: 600,
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: '999px',
  background: 'rgba(10,7,6,0.55)',
  border: '1px solid rgba(232,224,213,0.14)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  textShadow: '0 1px 8px rgba(0,0,0,0.8)'
}

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/darking98' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/diego-gabriel-rodriguez'
  }
]

// Monta el AsciiRenderer recién cuando el canvas tiene tamaño válido,
// para que su setSize corra antes del primer render (evita getImageData con NaN).
function AsciiFX() {
  const { size } = useThree()
  if (!size.width || !size.height) return null
  return (
    <AsciiRenderer
      fgColor={CREAM}
      bgColor={BG}
      characters=" .:-+*=%@#"
      resolution={0.19}
    />
  )
}

// Luz que sigue el cursor → el ASCII se "ilumina" (caracteres más densos) al pasar por arriba
function CursorLight() {
  const ref = useRef<THREE.PointLight>(null)
  const { viewport } = useThree()
  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 1.6), [])
  useFrame((state) => {
    if (!ref.current) return
    targetPos.set(
      state.pointer.x * (viewport.width / 2),
      state.pointer.y * (viewport.height / 2),
      1.6
    )
    ref.current.position.lerp(targetPos, 0.12)
  })
  return (
    <pointLight
      ref={ref}
      intensity={9}
      distance={3.5}
      decay={2}
      color="#ffe6cf"
    />
  )
}

function Head({ enterRef }: { enterRef: { current: number } }) {
  const { scene } = useGLTF('/avatar.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  const groupRef = useRef<THREE.Group>(null)
  const target = useRef({ x: 0, y: 0 })

  const { modelScale, modelPosition } = useMemo(() => {
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = 2.4 / size.y
    return {
      modelScale: s,
      modelPosition: new THREE.Vector3(
        -center.x * s,
        -center.y * s - 0.35,
        -center.z * s
      )
    }
  }, [cloned])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientY / window.innerHeight - 0.5) * (Math.PI / 14)
      target.current.y = (e.clientX / window.innerWidth - 0.5) * (Math.PI / 8)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y +=
      (target.current.y - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x +=
      (target.current.x - groupRef.current.rotation.x) * 0.05
    // Parallax "desde arriba": el avatar desciende a su lugar al entrar
    groupRef.current.position.y = modelPosition.y + enterRef.current * 0.1
  })

  return (
    <group ref={groupRef} scale={modelScale} position={modelPosition}>
      <primitive object={cloned} />
    </group>
  )
}

useGLTF.preload('/avatar.glb')

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const asciiWrapRef = useRef<HTMLDivElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef(1)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6
        }
      })

      // El ASCII se "tipea" de arriba hacia abajo (muchos pasos = ticking rápido)
      tl.fromTo(
        asciiWrapRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'steps(52)', duration: 0.6 },
        0
      )

      // Parallax "desde arriba": el avatar desciende dentro de la escena 3D
      // (así el clip y la scanline quedan siempre alineados)
      tl.fromTo(enterRef, { current: 1 }, { current: 0, ease: 'power1.out' }, 0)

      // Línea de escaneo (cursor) que baja junto al borde del tipeo
      tl.fromTo(
        scanlineRef.current,
        { top: '0%', autoAlpha: 1 },
        { top: '100%', ease: 'none', duration: 0.6 },
        0
      )
      // se apaga al terminar de tipear
      tl.to(
        scanlineRef.current,
        { autoAlpha: 0, duration: 0.06, ease: 'none' },
        0.6
      )

      // El nombre aparece letra por letra
      tl.from(
        '.contact-letter',
        {
          yPercent: 90,
          autoAlpha: 0,
          filter: 'blur(8px)',
          duration: 0.35,
          ease: 'power3.out',
          stagger: 0.03
        },
        0.42
      )

      // Los links entran con desplazamiento (sin autoAlpha → nunca quedan invisibles)
      tl.from(
        '.contact-fade',
        {
          y: 22,
          filter: 'blur(5px)',
          duration: 0.35,
          ease: 'power2.out',
          stagger: 0.1
        },
        0.5
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full"
      style={{ background: BG, height: '180vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Avatar en ASCII */}
        <div
          ref={asciiWrapRef}
          className="absolute inset-0"
          style={{ zIndex: 0 }}
        >
          <Canvas camera={{ position: [0, 0, 3], fov: 42 }} dpr={[1, 2]}>
            <ambientLight intensity={1.1} />
            <directionalLight position={[2, 3, 4]} intensity={1.4} />
            <directionalLight position={[-3, 1, -2]} intensity={0.5} />
            <CursorLight />
            <Suspense fallback={null}>
              <Head enterRef={enterRef} />
            </Suspense>
            <AsciiFX />
          </Canvas>
        </div>

        {/* Línea de escaneo */}
        <div
          ref={scanlineRef}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            zIndex: 1,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent, rgba(232,224,213,0.9) 20%, rgba(232,224,213,0.9) 80%, transparent)',
            boxShadow:
              '0 0 16px 3px rgba(232,224,213,0.55), 0 0 4px 1px rgba(232,224,213,0.8)'
          }}
        />

        {/* Scrims para legibilidad del texto */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{
            zIndex: 5,
            height: '32vh',
            background: `linear-gradient(to bottom, ${BG}ee 0%, ${BG}99 35%, transparent 100%)`
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{
            zIndex: 5,
            height: '48vh',
            background: `linear-gradient(to top, ${BG}f2 0%, ${BG}b0 40%, transparent 100%)`
          }}
        />

        {/* Footer: utilidad + nombre gigante (todo abajo, lejos del Header) */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-8 md:px-12 pb-6">
          {/* Fila de utilidad */}
          <div className="flex justify-between items-end mb-5 md:mb-7">
            <div className="flex flex-col gap-1">
              <a
                href="mailto:me@diegogabrielrodriguez.com"
                style={LINK}
                className="contact-fade hover:opacity-70 transition-opacity"
              >
                me@diegogabrielrodriguez.com
              </a>
            </div>

            <div className="flex items-center gap-5 md:gap-7">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={LINK}
                  className="contact-fade hover:opacity-70 transition-opacity"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nombre gigante (letra por letra) */}
          <div className="flex items-end justify-between leading-[0.85] select-none">
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(3rem, 13vw, 15rem)',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                color: CREAM,
                textShadow: '0 4px 40px rgba(0,0,0,0.55)'
              }}
            >
              {'Diego'.split('').map((ch, i) => (
                <span key={i} className="contact-letter inline-block">
                  {ch}
                </span>
              ))}
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(3rem, 13vw, 15rem)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: CREAM,
                whiteSpace: 'nowrap',
                textShadow: '0 4px 40px rgba(0,0,0,0.55)'
              }}
            >
              {'Rodriguez'.split('').map((ch, i) => (
                <span key={i} className="contact-letter inline-block">
                  {ch}
                </span>
              ))}
              <span
                className="contact-letter inline-block"
                style={{ color: ACCENT }}
              >
                .
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
