// ── Acto 1 — kicker + statement de apertura ──
export const KICKER = '01 — Trajectory'

// ── Acto 2 — "constelación naciente": las experiencias son estrellas que se
// encienden y se conectan. x/y en viewBox 0–1920 / 0–1000. Trazadas de
// abajo-izquierda a arriba-derecha para sugerir el ascenso hacia el espacio.
// `labelSide` decide de qué lado del punto se lee el texto (evita chocar borde).
export type Station = {
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
    role: 'Web Developer',
    company: 'Freelance',
    years: '2021',
    x: 330,
    y: 760,
    labelSide: 'right'
  },
  {
    role: 'Front End Developer',
    company: 'Castor, Inc',
    sector: 'Fintech',
    years: '2021 — 2023',
    x: 720,
    y: 560,
    labelSide: 'left'
  },
  {
    role: 'Fullstack Developer',
    company: 'Polynomium',
    sector: 'Fintech',
    years: '2024 — 2025',
    x: 1150,
    y: 640,
    labelSide: 'right'
  },
  {
    role: 'AI Full Stack Engineer',
    company: 'Infinity Corp',
    sector: 'iGaming',
    years: '2025 — 2026',
    x: 1560,
    y: 360,
    labelSide: 'left'
  }
]

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
