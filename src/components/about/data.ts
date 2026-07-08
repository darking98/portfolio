// ── Kickers de sección ──
export const KICKER = '01 — Experience'
export const KICKER_SKILLS = '02 — Skills'

// ── Acto 2 — "constelación naciente": las experiencias son estrellas que se
// encienden y se conectan. x/y en viewBox 0–1920 / 0–1000. Trazadas de
// abajo-izquierda a arriba-derecha para sugerir el ascenso hacia el espacio.
// `labelSide` decide de qué lado del punto se lee el texto (evita chocar borde).
export type Station = {
  slug: string
  role: string
  company: string
  sector?: string
  years: string
  x: number
  y: number
  labelSide: 'left' | 'right'
}

export const STATIONS: Station[] = [
  {
    slug: 'freelance',
    role: 'Web Developer',
    company: 'Freelance',
    years: '2021',
    x: 330,
    y: 760,
    labelSide: 'right'
  },
  {
    slug: 'castor',
    role: 'Front End Developer',
    company: 'Castor, Inc',
    sector: 'Fintech',
    years: '2021 — 2023',
    x: 720,
    y: 560,
    labelSide: 'left'
  },
  {
    slug: 'polynomium',
    role: 'Fullstack Developer',
    company: 'Polynomium',
    sector: 'Fintech',
    years: '2024 — 2025',
    x: 1150,
    y: 640,
    labelSide: 'right'
  },
  {
    slug: 'infinity-corp',
    role: 'AI Full Stack Engineer',
    company: 'Infinity Corp',
    sector: 'iGaming',
    years: '2025 — 2026',
    x: 1560,
    y: 360,
    labelSide: 'left'
  }
]

// Detalle de cada experiencia (contenido placeholder — completar luego).
export type ExperienceDetail = {
  intro: string
  highlights: string[]
  stack: string[]
}

export const EXPERIENCE_DETAILS: Record<string, ExperienceDetail> = {
  freelance: {
    intro:
      'Placeholder — describí acá el trabajo freelance: qué clientes, qué construiste, qué aprendiste en esta primera etapa.',
    highlights: [
      'Logro / proyecto destacado #1',
      'Logro / proyecto destacado #2',
      'Logro / proyecto destacado #3'
    ],
    stack: ['HTML', 'CSS/SCSS', 'JavaScript', 'React']
  },
  castor: {
    intro:
      'Placeholder — Castor, Inc (Fintech). Contá tu rol como Front End Developer, los productos en los que trabajaste y el impacto.',
    highlights: [
      'Logro / proyecto destacado #1',
      'Logro / proyecto destacado #2',
      'Logro / proyecto destacado #3'
    ],
    stack: ['React', 'TypeScript', 'Chakra UI', 'React Query']
  },
  polynomium: {
    intro:
      'Placeholder — Polynomium (Fintech). Rol Fullstack: pagos internacionales, dashboards en tiempo real, alta concurrencia.',
    highlights: [
      'Logro / proyecto destacado #1',
      'Logro / proyecto destacado #2',
      'Logro / proyecto destacado #3'
    ],
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker']
  },
  'infinity-corp': {
    intro:
      'Placeholder — Infinity Corp (iGaming). AI Full Stack Engineer: agents, sistemas LLM, orquestación con MCP, plataformas de alta concurrencia.',
    highlights: [
      'Logro / proyecto destacado #1',
      'Logro / proyecto destacado #2',
      'Logro / proyecto destacado #3'
    ],
    stack: ['LLMs', 'AI Agents', 'MCP', 'Next.js', 'SSE']
  }
}

// ── Acto 3 — 3 constelaciones interactivas ──
// Cada cluster es un nodo-madre; al hacer click despliega sus skills orbitando.
// `x/y` (viewBox 0–1920 / 0–1000) = posición del nodo-madre. Las skills se
// distribuyen en anillos alrededor de ese centro (ver constellation.tsx).
export type ClusterId = 'frontend' | 'backend' | 'ai'

export type Cluster = {
  id: ClusterId
  label: string
  x: number
  y: number
  skills: string[]
}

export const CLUSTERS: Cluster[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    x: 470,
    y: 500,
    skills: [
      'React',
      'Next.js',
      'React Native',
      'TypeScript',
      'JavaScript (ES6+)',
      'Expo',
      'TailwindCSS',
      'CSS/SCSS',
      'HTML',
      'Chakra UI',
      'Zustand',
      'React Query',
      'Zod',
      'Axios',
      'Storybook',
      'Cypress',
      'Jest'
    ]
  },
  {
    id: 'backend',
    label: 'Backend',
    x: 970,
    y: 560,
    skills: [
      'Node.js',
      'Nest.js',
      'PostgreSQL',
      'Supabase',
      'Docker',
      'Git',
      'Google Cloud'
    ]
  },
  {
    id: 'ai',
    label: 'AI',
    x: 1450,
    y: 460,
    skills: ['LLMs', 'AI Agents', 'MCP', 'Prompt', 'SSE']
  }
]

// ── Cierre cinético (toque de B) → puente hacia Projects ──
export const CLOSER = { pre: 'Engineering,', accent: 'now AI-first.' }
