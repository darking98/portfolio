import type { Metadata } from 'next'

// El CV es un PDF embebido sin HTML propio → no aporta contenido indexable.
// noindex evita que compita en ranking con una página "vacía" para el crawler.
export const metadata: Metadata = {
  title: 'CV — Diego Gabriel Rodriguez',
  robots: { index: false, follow: true }
}

const CvPage = () => {
  return (
    <div className="absolute right-0 top-0 w-full">
      <iframe
        src="/cv.pdf"
        className="w-full h-screen"
        title="CV - Diego Gabriel Rodríguez"
      />
    </div>
  )
}

export default CvPage
