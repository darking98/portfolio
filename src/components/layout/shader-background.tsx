'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;

  float softColumn(vec2 uv, vec2 pos, float xStretch, float brightness, float spread) {
    vec2 d = uv - pos;
    d.x *= xStretch;
    float dist = length(d);
    return brightness / (dist * dist + spread);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // base: very dark warm brown-black
    vec3 col = vec3(0.032, 0.022, 0.016);

    // mouse remapped to 0-1
    vec2 m = uMouse * 0.5 + 0.5;
    float t = uTime * 0.2;

    // column 1 — left, warm terracotta
    float c1 = softColumn(uv, vec2(0.28 + m.x * 0.12, 1.25), 8.0, 0.055, 0.028);
    col += vec3(0.50, 0.25, 0.08) * c1;

    // column 2 — center, brightest amber
    float c2 = softColumn(uv, vec2(0.52 + sin(t) * 0.018 + m.x * 0.10, 1.35), 6.5, 0.085, 0.022);
    col += vec3(0.62, 0.30, 0.10) * c2;

    // column 3 — right, deeper earth tone
    float c3 = softColumn(uv, vec2(0.80 + m.x * 0.06, 1.15), 9.0, 0.030, 0.038);
    col += vec3(0.40, 0.18, 0.06) * c3;

    // mouse halo — warm glow at cursor
    float mg = softColumn(uv, vec2(m.x, m.y), 1.4, 0.007, 0.055);
    col += vec3(0.55, 0.28, 0.09) * mg;

    // ground bleed — faint warmth at very bottom
    float ground = smoothstep(0.25, 0.0, uv.y);
    col += vec3(0.45, 0.22, 0.07) * ground * 0.045;

    // vignette
    float vig = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vig = pow(clamp(vig * 13.0, 0.0, 1.0), 0.32);
    col = mix(col * 0.25, col, vig);

    // gamma
    col = pow(clamp(col, 0.0, 1.0), vec3(0.90));

    gl_FragColor = vec4(col, 1.0);
  }
`

function Scene() {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null)
  const { size } = useThree()
  const targetMouse = useRef(new THREE.Vector2(0, 0))
  const currentMouse = useRef(new THREE.Vector2(0, 0))

  const uniforms = useMemo(
    () => ({
      uTime:       { value: 0 },
      uMouse:      { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [],
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetMouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ clock }) => {
    currentMouse.current.lerp(targetMouse.current, 0.06)
    const m = meshRef.current
    if (!m) return
    m.material.uniforms.uTime.value = clock.elapsedTime
    m.material.uniforms.uMouse.value = currentMouse.current
    m.material.uniforms.uResolution.value = new THREE.Vector2(size.width, size.height)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function ShaderBackground() {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  )
}
