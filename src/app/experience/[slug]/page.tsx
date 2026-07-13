import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { STATIONS, EXPERIENCE_DETAILS } from '@/components/experience-skills/data'
import { ExperiencePage } from '@/views/experience/experience.page'

// Pre-renderiza una ruta estática por cada experiencia (● SSG en el build).
export function generateStaticParams() {
  return STATIONS.map((s) => ({ slug: s.slug }))
}

// Slugs desconocidos → 404 (no se generan bajo demanda).
export const dynamicParams = false

// SEO por experiencia: título/descripción propios + canonical. Sin esto cada
// detalle heredaría el metadata genérico del layout (mismo title que el home).
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const station = STATIONS.find((s) => s.slug === slug)
  const detail = EXPERIENCE_DETAILS[slug]
  if (!station) return {}

  const title = `${station.role} @ ${station.company} | Diego Gabriel Rodriguez`
  const description =
    detail?.intro ?? `${station.role} at ${station.company} (${station.years}).`

  return {
    title,
    description,
    alternates: { canonical: `/experience/${slug}` },
    openGraph: {
      title,
      description,
      url: `/experience/${slug}`,
      type: 'article'
    },
    twitter: { title, description }
  }
}

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // "Fetching": resolvemos la data de la experiencia en el server.
  const station = STATIONS.find((s) => s.slug === slug)
  const detail = EXPERIENCE_DETAILS[slug]
  if (!station || !detail) notFound()

  return <ExperiencePage station={station} detail={detail} />
}
