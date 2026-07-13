import '../styles/globals.css'
import { ViewTransitions } from 'next-view-transitions'
import SmoothScroll from '@/components/layout/smooth-scroll'
import Background from '@/components/layout/background'
import StructuredData from '@/components/seo/structured-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://diegogabrielrodriguez.com'),
  title:
    'Diego Gabriel Rodriguez | Senior Frontend Developer | React & Next.js Expert',
  description:
    'Senior Frontend Developer from Buenos Aires with 5+ years building scalable Fintech & iGaming platforms. Expert in React, Next.js, TypeScript, and AI-First development. Specialized in clean architectures, performance optimization, and real-time systems.',
  verification: {
    google: '2oq6ibXxfUp5Zkqn3JD33AMpHvbNRh98s24BC8s3N7Y'
  },
  openGraph: {
    title:
      'Diego Gabriel Rodriguez | Senior Frontend Developer | React & Next.js Expert',
    description:
      'Senior Frontend Developer with 5+ years in Fintech & iGaming. Expert in React, Next.js, TypeScript, and AI-First development. Based in Buenos Aires, Argentina.',
    url: 'https://diegogabrielrodriguez.com',
    siteName: 'Diego Gabriel Rodriguez - Portfolio',
    locale: 'en_US',
    type: 'website'
    // images: las provee opengraph-image.tsx automáticamente (Next las inyecta)
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diego Gabriel Rodriguez | Senior Frontend Developer',
    description:
      'Senior Frontend Developer with 5+ years in Fintech & iGaming. Expert in React, Next.js, TypeScript, and AI-First development.'
    // images: idem — opengraph-image.tsx también cubre la card de Twitter
  },
  keywords: [
    'Diego Gabriel Rodriguez',
    'Diego Rodriguez',
    'Senior Frontend Developer',
    'Frontend Developer Buenos Aires',
    'Frontend Developer Argentina',
    'React Developer Argentina',
    'Next.js Developer',
    'TypeScript Expert',
    'React Expert',
    'Fintech Developer',
    'iGaming Developer',
    'Frontend Engineer',
    'React Native Developer',
    'Tailwind CSS',
    'Node.js',
    'Fullstack Developer',
    'AI-First Development',
    'LLM Integration',
    'Model Context Protocol',
    'MCP',
    'Web Performance',
    'Clean Architecture',
    'Real-time Systems',
    'High Concurrency',
    'Latin American Developer',
    'Argentinian Developer',
    'Buenos Aires Developer',
    'Remote Frontend Developer',
    'Cypress Testing',
    'UI/UX Development',
    'Desarrollador Frontend Argentina'
  ],
  creator: 'Diego Gabriel Rodriguez',
  authors: [{ name: 'Diego Gabriel Rodriguez' }],
  alternates: {
    canonical: 'https://diegogabrielrodriguez.com'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ViewTransitions>
      <html lang="en">
        <head>
          <StructuredData />
        </head>
        <body>
          {/* Bloquea el primer paint hasta que el Loader JS monte — evita flash del hero.
            Solo en el home ('/'): el Loader (que lo remueve) únicamente monta ahí. En rutas
            de detalle (F5 / entrada directa) no hay Loader, así que no instalamos el cover
            o quedaría tapando la página para siempre. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
          (function(){
            if (location.pathname !== '/') return;
            if (location.search.indexOf('nointro') !== -1) return;
            var d = document.createElement('div');
            d.id = '__loader_cover';
            d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#6B3040;pointer-events:none';
            document.documentElement.appendChild(d);
          })();
        `
            }}
          />
          <Background />
          <SmoothScroll>{children}</SmoothScroll>
        </body>
      </html>
    </ViewTransitions>
  )
}
