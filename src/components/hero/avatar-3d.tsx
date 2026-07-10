'use client'

import { useRef, Suspense, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { INITIAL_Z } from './constants'

interface ModelProps {
  onLoaded?: () => void
  cameraZRef?: { current: number }
}

function Model({ onLoaded, cameraZRef }: ModelProps) {
  const { scene } = useGLTF('/avatar.glb')
  const groupRef = useRef<THREE.Group>(null)
  const targetRot = useRef({ x: 0, y: 0 })

  const { modelScale, modelPosition } = useMemo(() => {
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = 2 / size.y
    return {
      modelScale: s,
      modelPosition: new THREE.Vector3(
        -center.x * s,
        -center.y * s - 0.15,
        -center.z * s
      )
    }
  }, [scene])

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
  paused = false
}: {
  onLoaded?: () => void
  cameraZRef?: { current: number }
  paused?: boolean
}) {
  return (
    <div className="w-full h-full">
      <Canvas
        frameloop={paused ? 'never' : 'always'}
        camera={{ position: [1.5, 0, INITIAL_Z], fov: 30, near: 0.5, far: 20 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[1, 2, 3]} intensity={1.2} />
        <directionalLight position={[-2, 1, -1]} intensity={0.4} />

        <Suspense fallback={null}>
          <Model onLoaded={onLoaded} cameraZRef={cameraZRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
