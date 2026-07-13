export const BG = '#171210'
export const CREAM = '#e8e0d5'

export const LABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase'
}

// Link tipográfico (sin caja) — sombra sutil para contrastar sobre el ASCII
export const LINK: React.CSSProperties = {
  ...LABEL,
  color: CREAM,
  display: 'inline-block',
  textShadow: '0 1px 12px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.6)'
}

// `external` (default true) → abre en pestaña nueva. CV es ruta interna (/cv),
// v1 es el sitio de la versión anterior del portfolio.
export const SOCIALS: {
  label: string
  href: string
  external?: boolean
}[] = [
  { label: 'GitHub', href: 'https://github.com/darking98' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/diego-gabriel-rodriguez'
  },
  { label: 'CV', href: '/cv', external: false },
  { label: 'v1', href: 'https://v1.diegogabrielrodriguez.com' }
]
