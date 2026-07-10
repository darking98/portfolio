export type Project = {
  slug: string
  title: string
  kind: string // rubro
  year: string
  hue: [string, string]
  image?: string
  video?: string
  gallery?: string[]
}

export const projects: Project[] = [
  {
    slug: 'abcdle',
    title: 'ABCDLE',
    kind: 'Word Game · Daily',
    year: '2026',
    hue: ['#6B3040', '#2a1a14'],
    video: '/projects/abcdle/abcdle-1.webm',
    gallery: [
      '/projects/abcdle/abcdle-1.webm',
      '/projects/abcdle/abcdle-2.webm',
      '/projects/abcdle/abcdle-1.png',
      '/projects/abcdle/abcdle-2.png',
      '/projects/abcdle/abcdle-3.png',
      '/projects/abcdle/abcdle-4.png',
      '/projects/abcdle/abcdle-5.png',
      '/projects/abcdle/abcdle-6.png',
      '/projects/abcdle/abcdle-7.png'
    ]
  },
  {
    slug: 'plmboxd',
    title: 'Plmboxd',
    kind: 'Streaming · Social',
    year: '2026',
    hue: ['#b07050', '#6B3040']
  },
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    kind: 'Portfolio · Personal',
    year: '2026',
    hue: ['#7a4a30', '#2a1a14'],
    video: '/projects/portfolio/portfolio-1.webm',
    gallery: [
      '/projects/portfolio/portfolio-1.webm',
      '/projects/portfolio/portfolio-2.webm',
      '/projects/portfolio/portfolio-1.png',
      '/projects/portfolio/portfolio-2.png',
      '/projects/portfolio/portfolio-3.png',
      '/projects/portfolio/portfolio-4.png',
      '/projects/portfolio/portfolio-5.png',
      '/projects/portfolio/portfolio-6.png'
    ]
  }
]

export const N = projects.length

// Detalle de cada proyecto (placeholder — completar luego).
export type ProjectDetail = {
  intro: string
  role: string
  highlights: string[]
  stack: { frontend: string[]; backend: string[] }
  links?: { label: string; href: string }[]
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  abcdle: {
    intro:
      'A daily casual game inspired by Wordle and the “Pasapalabra” TV show rosco — delivering a cross-platform web and mobile experience with a vibrant neo-brutalist visual design, built on shared code across a monorepo.',
    role: 'Fullstack Engineer & Designer',
    highlights: [
      'Architected a cross-platform web + mobile experience with shared code via a Turborepo and pnpm monorepo, with a neo-brutalist UI defined by solid shadows and high-contrast styling.',
      'Implemented an advanced multi-layer cache strategy combining Incremental Static Regeneration (Next.js 16 App Router) with an automated cron job that triggers targeted revalidations at 00:00 UTC, optimizing database performance.',
      'Built a secure anti-cheat validation system that computes remaining game time server-side using strict timestamps, preventing local clock manipulation while supporting granular state transitions (countdown, playing, paused, expired).',
      'Optimized core game-loop performance with in-memory caching of the daily roscos, paired with optimistic UI updates for instant feedback and flawless transitions powered by Tailwind CSS and Framer Motion.'
    ],
    stack: {
      frontend: [
        'React',
        'Next.js',
        'TypeScript',
        'TailwindCSS',
        'Zod',
        'React Query',
        'Auth0',
        'Vercel',
        'Framer Motion',
        'Headless UI'
      ],
      backend: ['NestJS', 'Docker', 'PostgreSQL', 'Railway']
    },
    links: [{ label: 'Visit site', href: 'https://abcdle.app' }]
  },
  plmboxd: {
    intro:
      'A full-stack web app inspired by Letterboxd, built for Argentine streaming content — letting users discover shows, track watched episodes, and explore talent across the different streaming platforms.',
    role: 'Fullstack Engineer',
    highlights: [
      'Architected a full-stack web app for Argentine streaming content, enabling users to discover shows, track watched episodes, and explore talent across different streaming platforms.',
      'Engineered a comprehensive search and discovery system to browse by cast and crew (hosts, guests, panelists), view their full participation history, and filter by role across hundreds of episodes.',
      'Implemented social features — authentication, episode reviews and ratings, personalized watchlists, and a user-following system — with real-time notifications.',
      'Integrated the YouTube Data API for automated content synchronization, keeping the catalog up to date.'
    ],
    stack: {
      frontend: [
        'React',
        'Next.js',
        'TypeScript',
        'TailwindCSS',
        'Zod',
        'React Query',
        'Auth0',
        'Vercel'
      ],
      backend: ['NestJS', 'Docker', 'PostgreSQL', 'Railway']
    },
    links: [{ label: 'Visit site', href: 'https://plmboxd.com' }]
  },
  'portfolio-v2': {
    intro:
      'A single-page personal portfolio built around scroll-driven storytelling — from a 3D avatar to a journey into space — obsessing over performance and premium, minimal motion.',
    role: 'Creative Developer & Designer',
    highlights: [
      'Crafted scroll-driven, scrubbed animations with GSAP + ScrollTrigger and Lenis smooth scroll, built on a sticky-scrub pattern instead of pinning to avoid dead screens.',
      'Rendered an interactive 3D avatar with React Three Fiber, baked and heavily optimized with meshopt compression + KHR_mesh_quantization to keep memory in check.',
      'Designed cinematic route transitions with shared-element morphs and warp effects via the View Transitions API.'
    ],
    stack: {
      frontend: [
        'Next.js',
        'React',
        'TypeScript',
        'TailwindCSS',
        'GSAP',
        'Lenis',
        'React Three Fiber',
        'Vercel'
      ],
      backend: []
    },
    links: [
      {
        label: 'View repository',
        href: 'https://github.com/darking98/portfolio'
      }
    ]
  }
}
