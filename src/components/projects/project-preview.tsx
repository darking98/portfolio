import type { Project } from './data'

// Mockup animado generativo: sugiere una UI viva (barra de navegación, panel de
// datos con barras que respiran, shimmer que barre) tintada con los colores del
// proyecto. Placeholder premium hasta tener capturas reales — reemplazable por
// <img>/<video> sin cambiar el resto.
export function ProjectPreview({ project }: { project: Project }) {
  const [a, b] = project.hue
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: 6,
        background: `linear-gradient(150deg, ${a}, ${b})`
      }}
    >
      {/* Shimmer que barre */}
      <div
        className="work-shimmer absolute inset-y-0"
        style={{
          width: '40%',
          background:
            'linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent)'
        }}
      />

      {/* "Ventana" de app flotando */}
      <div
        className="work-float absolute inset-6 flex flex-col"
        style={{
          borderRadius: 5,
          background: 'rgba(232, 224, 213, 0.06)',
          border: '1px solid rgba(232, 224, 213, 0.12)',
          backdropFilter: 'blur(2px)'
        }}
      >
        {/* Barra de navegación */}
        <div
          className="flex items-center gap-1.5 px-3"
          style={{ height: 22, borderBottom: '1px solid rgba(232,224,213,0.1)' }}
        >
          <span
            className="rounded-full"
            style={{ width: 6, height: 6, background: 'rgba(232,224,213,0.4)' }}
          />
          <span
            className="rounded-full"
            style={{ width: 6, height: 6, background: 'rgba(232,224,213,0.25)' }}
          />
          <span
            className="rounded-full"
            style={{ width: 6, height: 6, background: 'rgba(232,224,213,0.18)' }}
          />
        </div>

        {/* Cuerpo: barras de datos que respiran */}
        <div className="flex-1 p-4 flex flex-col justify-center gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="work-bar rounded-full"
              style={{
                height: 7,
                width: `${90 - i * 9}%`,
                background: 'rgba(232, 224, 213, 0.5)',
                animationDelay: `${i * 0.22}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
