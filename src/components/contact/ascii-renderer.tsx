'use client'

// Fork del AsciiRenderer de drei. El original llama effect.setSize() en un
// useEffect pasivo, pero suscribe useFrame antes: un rAF puede colarse entre
// el commit y el effect y renderizar con iWidth/iHeight undefined →
// `getImageData ... not of type 'long'`. Acá setSize corre en useLayoutEffect
// (antes de cualquier frame) y el render queda guardado hasta tener tamaño.

import { useMemo, useRef, useLayoutEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { AsciiEffect } from 'three-stdlib'

interface AsciiRendererProps {
  renderIndex?: number
  bgColor?: string
  fgColor?: string
  characters?: string
  invert?: boolean
  color?: boolean
  resolution?: number
}

export default function AsciiRenderer({
  renderIndex = 1,
  bgColor = 'black',
  fgColor = 'white',
  characters = ' .:-+*=%@#',
  invert = true,
  color = false,
  resolution = 0.15
}: AsciiRendererProps) {
  const { size, gl, scene, camera } = useThree()
  const sizedRef = useRef(false)

  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, { invert, color, resolution })
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.pointerEvents = 'none'
    return effect
  }, [gl, characters, invert, color, resolution])

  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor
    effect.domElement.style.backgroundColor = bgColor
  }, [effect, fgColor, bgColor])

  useLayoutEffect(() => {
    if (!size.width || !size.height) {
      sizedRef.current = false
      return
    }
    effect.setSize(size.width, size.height)
    sizedRef.current = true
  }, [effect, size])

  useLayoutEffect(() => {
    const parent = gl.domElement.parentNode
    if (!parent) return
    gl.domElement.style.opacity = '0'
    parent.appendChild(effect.domElement)
    return () => {
      gl.domElement.style.opacity = '1'
      parent.removeChild(effect.domElement)
    }
  }, [effect, gl])

  useFrame(() => {
    if (!sizedRef.current) return
    effect.render(scene, camera)
  }, renderIndex)

  return null
}
