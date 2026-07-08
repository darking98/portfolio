import { useRef, useEffect, useMemo } from 'react'
import AsciiRenderer from '@/ui/ascii-renderer'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { BG, CREAM } from './constants'

// Renderiza UN frame apenas el GLB está listo (frameloop está en 'never'
// hasta que la sección se acerca): fuerza la subida de la geometría a GPU y
// la compilación de shaders durante la carga inicial, tapado por el clip-path.
// Sin esto, el primer frame real ocurre en mitad del scroll y el reveal
// muestra un canvas negro mientras la GPU traga los 85MB del avatar.
export function WarmUp() {
  const advance = useThree((s) => s.advance)
  useEffect(() => {
    const id = requestAnimationFrame(() => advance(performance.now()))
    return () => cancelAnimationFrame(id)
  }, [advance])
  return null
}

// Monta el AsciiRenderer recién cuando el canvas tiene tamaño válido,
// para que su setSize corra antes del primer render (evita getImageData con NaN).
export function AsciiFX() {
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
export function CursorLight() {
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

export function Head({ enterRef }: { enterRef: { current: number } }) {
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
