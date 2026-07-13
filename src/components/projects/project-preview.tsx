import { useEffect, useRef } from 'react'
import type { Project } from './data'
import { MUTED } from './constants'

// Preview del proyecto activo. Estructura lista para media real: si el proyecto
// trae `video` o `image` los pinta; si no, cae al gradiente `hue` como
// placeholder premium. El chrome (fecha + "PREVIEW") vive fuera del media para
// que el tilt 3D del wrapper padre no lo deforme raro.
//
// RAM: un <video autoPlay loop> mantiene un pipeline de decode + buffers de
// frames en GPU MIENTRAS existe, sin importar su tamaño en pantalla. Al cambiar
// de proyecto React reconciliaría el MISMO nodo <video> y solo mutaría `src` →
// el decoder viejo no se libera y se acumulan al scrollear (mina de RAM en Work).
// Por eso: (1) la fila padre le pasa `key={project.slug}` para que React
// DESMONTE el video saliente en vez de mutar `src`; (2) en cleanup vaciamos el
// src y llamamos load() para soltar el buffer de decode explícitamente.
export function ProjectPreview({
  project,
  still = false
}: {
  project: Project
  // `still`: fuerza imagen estática en vez de video (mobile: sin decode/batería
  // de un <video> autoPlay). Usa project.image o el primer .png de la gallery.
  still?: boolean
}) {
  const [a, b] = project.hue
  const videoRef = useRef<HTMLVideoElement>(null)

  // Imagen para el modo estático: la explícita, o el primer .png de la gallery.
  const stillImage =
    project.image ?? project.gallery?.find((g) => g.endsWith('.png'))
  const useVideo = !still && project.video
  const useImage = still ? stillImage : project.image

  // Autoplay robusto. `muted` se fuerza por propiedad (React no lo refleja de
  // forma confiable como atributo declarativo, y sin muted el autoplay se
  // bloquea → el video quedaba en pausa sin src visible). Además el `src` se
  // (re)asigna acá y se llama play() imperativamente: cubre mobile (autoPlay
  // declarativo difiere la carga) y el doble montaje de React Strict Mode en dev
  // (el cleanup previo dejaba el <video> sin src). Al desmontar de verdad libera
  // el decode (buffers de GPU) — mina de RAM en Work.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !project.video) return
    v.muted = true
    if (v.getAttribute('src') !== project.video) v.src = project.video
    const tryPlay = () => v.play().catch(() => {})
    tryPlay()
    v.addEventListener('canplay', tryPlay, { once: true })
    return () => {
      v.removeEventListener('canplay', tryPlay)
      v.pause()
      v.removeAttribute('src')
      v.load()
    }
  }, [project.video])
  return (
    <div className="relative w-full h-full">
      {/* Chrome: fecha (izq) + PREVIEW (der) */}
      <div className="absolute -top-6 inset-x-0 flex items-center justify-between">
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            color: MUTED,
            textTransform: 'uppercase'
          }}
        >
          {project.year}
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            color: MUTED,
            textTransform: 'uppercase',
            opacity: 0.7
          }}
        >
          Preview
        </span>
      </div>

      {/* Marco del media */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius: 6, background: `linear-gradient(150deg, ${a}, ${b})` }}
      >
        {useVideo ? (
          // El `src` NO va declarativo: lo asigna el efecto por ref. Mezclar
          // src declarativo con removeAttribute('src') en el cleanup dejaba el
          // video sin fuente (React no re-aplica una prop que no cambió).
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : useImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={useImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {/* Shimmer que barre (placeholder) */}
            <div
              className="work-shimmer absolute inset-y-0"
              style={{
                width: '40%',
                background:
                  'linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent)'
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(232,224,213,0.55)'
              }}
            >
              {project.title}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
