// Proyectos de la sección Work. Contenido placeholder — completar luego.
export type Metric = { value: string; label: string }

export type Project = {
  slug: string
  title: string
  kind: string // rubro
  year: string
  // Dos colores para el mockup animado generativo (preview flotante)
  hue: [string, string]
  metrics: Metric[]
}

export const projects: Project[] = [
  {
    slug: 'project-alpha',
    title: 'Project Alpha',
    kind: 'Fullstack · UI',
    year: '2025',
    hue: ['#6B3040', '#2a1a14'],
    metrics: [
      { value: '2M+', label: 'usuarios activos' },
      { value: '40%', label: 'más rápido' }
    ]
  },
  {
    slug: 'nebula-studio',
    title: 'Nebula Studio',
    kind: 'Motion · Three.js',
    year: '2024',
    hue: ['#b07050', '#6B3040'],
    metrics: [
      { value: '60fps', label: 'en cualquier device' },
      { value: '3×', label: 'engagement' }
    ]
  },
  {
    slug: 'aurora-dashboard',
    title: 'Aurora Dashboard',
    kind: 'Data · Next.js',
    year: '2024',
    hue: ['#7a4a30', '#2a1a14'],
    metrics: [
      { value: '<200ms', label: 'p95 latency' },
      { value: '12k', label: 'eventos/seg' }
    ]
  },
  {
    slug: 'vertex-commerce',
    title: 'Vertex Commerce',
    kind: 'Platform · API',
    year: '2023',
    hue: ['#8a7a70', '#2a1a14'],
    metrics: [
      { value: '99.9%', label: 'uptime' },
      { value: '+28%', label: 'conversión' }
    ]
  },
  {
    slug: 'lumen-identity',
    title: 'Lumen Identity',
    kind: 'Brand · WebGL',
    year: '2023',
    hue: ['#6B3040', '#b07050'],
    metrics: [
      { value: 'Awwwards', label: 'honorable mention' },
      { value: '5', label: 'países' }
    ]
  }
]

export const N = projects.length

// Detalle de cada proyecto (placeholder — completar luego).
export type ProjectDetail = {
  intro: string
  role: string
  highlights: string[]
  stack: string[]
  links?: { label: string; href: string }[]
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'project-alpha': {
    intro:
      'Placeholder — describí el problema que resolvía Project Alpha, el contexto y por qué importaba.',
    role: 'Fullstack Engineer',
    highlights: [
      'Logro / decisión técnica destacada #1',
      'Logro / decisión técnica destacada #2',
      'Logro / decisión técnica destacada #3'
    ],
    stack: ['React', 'Next.js', 'Node.js', 'PostgreSQL']
  },
  'nebula-studio': {
    intro:
      'Placeholder — Nebula Studio: experiencia interactiva / motion. Qué construiste y el impacto visual.',
    role: 'Creative Developer',
    highlights: ['Destacado #1', 'Destacado #2', 'Destacado #3'],
    stack: ['Three.js', 'React Three Fiber', 'GSAP', 'GLSL']
  },
  'aurora-dashboard': {
    intro:
      'Placeholder — Aurora Dashboard: dashboards de datos en tiempo real, alta concurrencia.',
    role: 'Frontend Lead',
    highlights: ['Destacado #1', 'Destacado #2', 'Destacado #3'],
    stack: ['Next.js', 'React Query', 'WebSocket', 'D3']
  },
  'vertex-commerce': {
    intro:
      'Placeholder — Vertex Commerce: plataforma de e-commerce / API a escala.',
    role: 'Fullstack Engineer',
    highlights: ['Destacado #1', 'Destacado #2', 'Destacado #3'],
    stack: ['Nest.js', 'PostgreSQL', 'Redis', 'Docker']
  },
  'lumen-identity': {
    intro:
      'Placeholder — Lumen Identity: sitio de marca con WebGL, premiado. El detrás de escena.',
    role: 'Creative Developer',
    highlights: ['Destacado #1', 'Destacado #2', 'Destacado #3'],
    stack: ['WebGL', 'Three.js', 'GSAP', 'Next.js']
  }
}
