import type { Project, ProjectDetail } from '@/components/projects/data'

const BASE_URL = 'https://diegogabrielrodriguez.com'
const AUTHOR = {
  '@type': 'Person',
  name: 'Diego Gabriel Rodriguez',
  url: BASE_URL
}

/**
 * JSON-LD `CreativeWork` por proyecto para rich results. Se renderiza en el
 * server component del detalle (HTML estático / SSG), no en la view client.
 * El `Person` global del layout ya cubre el sitio; esto describe cada obra.
 */
export default function ProjectJsonLd({
  project,
  detail
}: {
  project: Project
  detail: ProjectDetail
}) {
  const url = `${BASE_URL}/work/${project.slug}`
  const stack = [...detail.stack.frontend, ...detail.stack.backend]
  // Primer asset de imagen (no video) de la galería, absoluto.
  const firstImage = project.gallery?.find((a) => !a.endsWith('.webm'))

  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: `${project.title} — ${project.kind}`,
    description: detail.intro,
    url,
    author: AUTHOR,
    creator: AUTHOR,
    dateCreated: project.year,
    genre: project.kind,
    keywords: stack.join(', '),
    ...(firstImage ? { image: `${BASE_URL}${firstImage}` } : {}),
    ...(detail.links?.length
      ? { sameAs: detail.links.map((l) => l.href) }
      : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
