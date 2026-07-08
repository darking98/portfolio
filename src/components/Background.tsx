// Fondo global: gradiente radial cálido + grain sutil, fijo detrás de todo.
export default function Background() {
  return (
    <div
      aria-hidden
      className="fixed inset-0"
      style={{ zIndex: -1, pointerEvents: 'none' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 40%, #f1eade 0%, #e8e0d5 52%, #dccfc0 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          opacity: 0.14,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
