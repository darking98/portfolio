import type { Project } from './data'
import { MUTED } from './constants'

// Preview del proyecto activo. Estructura lista para media real: si el proyecto
// trae `video` o `image` los pinta; si no, cae al gradiente `hue` como
// placeholder premium. El chrome (fecha + "PREVIEW") vive fuera del media para
// que el tilt 3D del wrapper padre no lo deforme raro.
export function ProjectPreview({ project }: { project: Project }) {
  const [a, b] = project.hue
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
        {project.video ? (
          <video
            src={project.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
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
