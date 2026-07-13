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
  // Coords portrait/mobile (viewBox 1920×1000): la constelación horizontal se
  // reorganiza en columna ascendente zigzag (de abajo hacia arriba = ascenso).
  // En mobile el label va SIEMPRE debajo del punto (labelSide se ignora).
  xM: number
  yM: number
}

export const STATIONS: Station[] = [
  {
    slug: 'freelance',
    role: 'Web Developer',
    company: 'Freelance',
    years: '2021',
    x: 330,
    y: 760,
    labelSide: 'right',
    xM: 760,
    yM: 850
  },
  {
    slug: 'castor',
    role: 'Front End Developer',
    company: 'Castor, Inc',
    sector: 'Fintech',
    years: '2021 — 2023',
    x: 720,
    y: 560,
    labelSide: 'left',
    xM: 1160,
    yM: 610
  },
  {
    slug: 'polynomium',
    role: 'Fullstack Developer',
    company: 'Polynomium',
    sector: 'Fintech',
    years: '2024 — 2025',
    x: 1150,
    y: 640,
    labelSide: 'right',
    xM: 760,
    yM: 380
  },
  {
    slug: 'infinity-corp',
    role: 'AI Full Stack Engineer',
    company: 'Infinity Corp',
    sector: 'E-Gaming',
    years: '2025 — 2026',
    x: 1560,
    y: 360,
    labelSide: 'left',
    xM: 1160,
    yM: 140
  }
]

// Detalle de cada experiencia (contenido placeholder — completar luego).
export type ExperienceDetail = {
  intro: string
  highlights: string[]
  stack: string[]
  // Screenshots del trabajo (rutas bajo /public). La media sticky del detalle
  // las va mostrando según la sección que se lee. Si está vacía, la columna
  // sticky cae a un panel generativo (gradiente).
  gallery?: string[]
}

export const EXPERIENCE_DETAILS: Record<string, ExperienceDetail> = {
  freelance: {
    intro:
      'Product: e-commerce and web applications for small and medium-sized businesses.',
    highlights: [
      'Designed and deployed production-ready interfaces in Next.js and React for small and medium-sized businesses, focusing on clean code and performance-optimized components.',
      'Collaborated with a UI/UX designer to deliver high-performance web applications for diverse clients, ensuring responsive design and an optimal user experience.',
      'Developed a custom e-commerce platform for an interior design business, with real-time stock and pricing management.'
    ],
    stack: [
      'React',
      'Next.js',
      'TypeScript',
      'Framer',
      'Supabase',
      'Vercel',
      'JavaScript',
      'CSS/SCSS',
      'HTML'
    ],
    gallery: [
      '/experience/freelance/freelance-1.png',
      '/experience/freelance/freelance-2.png',
      '/experience/freelance/freelance-3.png',
      '/experience/freelance/freelance-4.png'
    ]
  },
  castor: {
    intro:
      'Product: a high-traffic Fintech application with payment, insurance, and credit-card modules.',
    highlights: [
      'Developed core application modules — utility payments, insurance, and mobile recharges — prioritizing performance and conversion rates in business-critical flows.',
      'Implemented secure digital onboarding and integrated third-party financial services, enabling the full credit-card lifecycle: activation, transaction monitoring, and secure handling of sensitive data.',
      'Delivered an administrative dashboard in Next.js for the internal support team, reducing operational friction in account management and oversight of user financial activity.'
    ],
    stack: [
      'React Vite',
      'Next.js',
      'React Native',
      'TypeScript',
      'React Query',
      'Chakra UI'
    ],
    gallery: [
      '/experience/castor/castor-1.png',
      '/experience/castor/castor-2.png',
      '/experience/castor/castor-3.png',
      '/experience/castor/castor-4.png'
    ]
  },
  polynomium: {
    intro:
      'Product: a financial platform with dynamic data and real-time payment statuses.',
    highlights: [
      'Led the complete architectural migration from a BaaS (Supabase) to a decoupled system with a Python-based REST API and a Next.js layer, eliminating vendor dependency and gaining full control over performance and security.',
      'Strategically optimized SEO and load times using SSR and ISR in Next.js, adapting rendering to the data type — dynamic vs. static — based on the financial product’s needs.',
      'Designed the authentication system with Auth0 + JWT, implementing interceptors in the Fetch API for automated token injection and secure communication with the Python backend.'
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Auth0', 'Zod', 'React Query'],
    gallery: [
      '/experience/polynomium/polynomium-1.png',
      '/experience/polynomium/polynomium-2.png',
      '/experience/polynomium/polynomium-3.png',
      '/experience/polynomium/polynomium-4.png'
    ]
  },
  'infinity-corp': {
    intro:
      'Product: a backoffice ecosystem for managing hundreds of online casinos with real-time operations.',
    highlights: [
      'Designed the high-concurrency backoffice ecosystem using React, Vite, and Tailwind CSS, enabling a single team to operate hundreds of casino instances simultaneously without performance degradation.',
      'Developed complex data-visualization dashboards with real-time monitoring of betting operations and user activity, reducing the support team’s operational response time.',
      'Implemented React Query as the remote-state layer, eliminating duplicate requests and improving frontend responsiveness through advanced caching strategies.',
      'Integrated Claude Code and GitHub Copilot as a core part of the development workflow, accelerating feature delivery and reducing technical debt from the start of the project.'
    ],
    stack: [
      'React Vite',
      'TypeScript',
      'Tailwind CSS',
      'React Query',
      'Zod',
      'Claude Code'
    ],
    gallery: [
      '/experience/infinity/infinity-1.png',
      '/experience/infinity/infinity-2.png',
      '/experience/infinity/infinity-3.png',
      '/experience/infinity/infinity-4.png'
    ]
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
  // Coords portrait/mobile (viewBox 1920×1000): 3 nodos-madre en columna
  // vertical. El morph de las estrellas-experiencia aterriza acá en mobile.
  xM: number
  yM: number
  skills: string[]
}

export const CLUSTERS: Cluster[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    x: 470,
    y: 500,
    xM: 960,
    yM: 800,
    skills: [
      'React',
      'Next.js',
      'React Native',
      'TypeScript',
      'JavaScript (ES6+)',
      'Expo',
      'TailwindCSS',
      'GSAP',
      'React Three Fiber',
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
    xM: 960,
    yM: 500,
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
    xM: 960,
    yM: 240,
    skills: ['LLMs', 'AI Agents', 'MCP', 'Prompt', 'SSE']
  }
]

// ── Cierre cinético (toque de B) → puente hacia Projects ──
export const CLOSER = { pre: 'Engineering,', accent: 'now AI-first.' }
