export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Diego Gabriel Rodriguez',
    url: 'https://diegogabrielrodriguez.com',
    image: 'https://diegogabrielrodriguez.com/opengraph-image',
    jobTitle: 'Senior Frontend Developer',
    description:
      'Senior Frontend Developer with 5+ years building scalable Fintech & iGaming platforms. Expert in React, Next.js, TypeScript, and AI-First development.',
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Frontend Development',
      'React Native',
      'Node.js',
      'Tailwind CSS',
      'Web Performance',
      'Clean Architecture',
      'AI-First Development',
      'LLM Integration',
      'Model Context Protocol',
      'Fintech',
      'iGaming',
      'Real-time Systems',
      'High Concurrency',
      'UI/UX Development'
    ],
    sameAs: [
      'https://www.linkedin.com/in/diego-gabriel-rodriguez/',
      'https://github.com/darking98',
      'https://diegogabrielrodriguez.com'
    ],
    email: 'mailto:me@diegogabrielrodriguez.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Buenos Aires',
      addressCountry: 'AR'
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Universidad Argentina de la Empresa'
    },
    workLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressCountry: 'AR'
      }
    },
    mainEntityOfPage: {
      '@type': 'ProfilePage',
      '@id': 'https://diegogabrielrodriguez.com',
      name: 'Diego Gabriel Rodriguez - Senior Frontend Developer Portfolio',
      description:
        'Professional portfolio showcasing projects and experience in frontend development, specializing in React, Next.js, and modern web technologies.'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
