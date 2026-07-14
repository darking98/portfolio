'use client'

import { Component, type ReactNode, useRef, Suspense, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { INITIAL_Z } from './constants'

// Si el GLB falla (red, decode, GPU sin memoria) el avatar se omite pero
// `onFail` libera el Loader: sin esto, un fallo de carga lo dejaba en bucle
// infinito esperando el handshake (pasaba en mobile con OOM de VRAM).
class AvatarErrorBoundary extends Component<
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFail()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

interface ModelProps {
  onLoaded?: () => void
  cameraZRef?: { current: number }
  portrait?: boolean
}

function Model({ onLoaded, cameraZRef, portrait = false }: ModelProps) {
  const { scene } = useGLTF('/avatar.glb')
  const groupRef = useRef<THREE.Group>(null)
  const targetRot = useRef({ x: 0, y: 0 })
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera

  // Reencuadre por orientación aplicado imperativamente (NO recreamos el Canvas
  // con `key`: eso destruiría el contexto WebGL y re-subiría todo a GPU — mina #6).
  // La cámara mira al origen; en landscape se ubica en X=1.5 (encuadre en
  // ángulo). En portrait la centramos en X=0 (frontal) y abrimos el FOV para que
  // el modelo, más alto que ancho, entre completo y quede centrado en pantalla.
  // useEffect corre al montar Model (post-Suspense) y en cada cambio de portrait.
  useEffect(() => {
    camera.position.x = portrait ? 0 : 1.5
    camera.fov = portrait ? 46 : 30
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, portrait])

  const { modelScale, modelPosition } = useMemo(() => {
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = 2 / size.y
    // En portrait bajamos el modelo un poco más: pegado al top se notaba el
    // corte de la gorra contra el header. -0.15 es el offset base (landscape).
    const yOffset = portrait ? -0.5 : -0.15
    return {
      modelScale: s,
      modelPosition: new THREE.Vector3(
        -center.x * s,
        -center.y * s + yOffset,
        -center.z * s
      )
    }
  }, [scene, portrait])

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material]
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.roughness = 1.0
            mat.metalness = 0.0
            mat.envMapIntensity = 0.0
          }
        })
      }
    })
    const id = requestAnimationFrame(() => onLoaded?.())
    return () => cancelAnimationFrame(id)
  }, [scene, onLoaded])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      targetRot.current.y = nx * (Math.PI / 12)
      targetRot.current.x = ny * (Math.PI / 24)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ camera }) => {
    if (!groupRef.current) return

    groupRef.current.rotation.y +=
      (targetRot.current.y - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x +=
      (targetRot.current.x - groupRef.current.rotation.x) * 0.05

    if (cameraZRef) {
      camera.position.z = cameraZRef.current
    }
  })

  return (
    <group ref={groupRef} scale={modelScale} position={modelPosition}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/avatar.glb')

export default function Avatar3D({
  onLoaded,
  cameraZRef,
  paused = false,
  portrait = false
}: {
  onLoaded?: () => void
  cameraZRef?: { current: number }
  paused?: boolean
  portrait?: boolean
}) {
  // El handshake con el Loader debe dispararse EXACTAMENTE una vez, venga del
  // camino feliz (Model montado), de un fallo de carga (error boundary), de un
  // context lost o del watchdog — el que llegue primero gana.
  const firedRef = useRef(false)
  const fireLoaded = useCallback(() => {
    if (firedRef.current) return
    firedRef.current = true
    onLoaded?.()
  }, [onLoaded])

  // Watchdog: si a los 12s el avatar no cargó (red colgada, GPU muerta sin
  // evento), se libera el Loader igual. En cargas normales el modelo resuelve
  // en 1-2s y esto nunca dispara.
  useEffect(() => {
    const id = setTimeout(fireLoaded, 12000)
    return () => clearTimeout(id)
  }, [fireLoaded])

  // El encuadre inicial usa los valores landscape; Model lo reajusta a portrait
  // imperativamente vía useThree (sin recrear el Canvas — mina #6).
  return (
    <div className="w-full h-full">
      <Canvas
        frameloop={paused ? 'never' : 'always'}
        camera={{ position: [1.5, 0, INITIAL_Z], fov: 30, near: 0.5, far: 20 }}
        gl={{
          alpha: true,
          // En mobile el antialias del contexto cuesta memoria GPU que no
          // aporta a este encuadre; liberarla suma margen contra el OOM.
          antialias: typeof window === 'undefined' || window.innerWidth >= 768,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          // Si el proceso GPU muere durante la carga inicial, el Loader no
          // puede quedar esperando el handshake.
          gl.domElement.addEventListener('webglcontextlost', fireLoaded)
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[1, 2, 3]} intensity={1.2} />
        <directionalLight position={[-2, 1, -1]} intensity={0.4} />

        <AvatarErrorBoundary onFail={fireLoaded}>
          <Suspense fallback={null}>
            <Model onLoaded={fireLoaded} cameraZRef={cameraZRef} portrait={portrait} />
          </Suspense>
        </AvatarErrorBoundary>
      </Canvas>
    </div>
  )
}
