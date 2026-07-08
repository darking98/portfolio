import { notFound } from 'next/navigation'
import { STATIONS, EXPERIENCE_DETAILS } from '@/components/about/data'
import { ExperiencePage } from '@/views/experience/experience.page'

// Pre-renderiza una ruta estática por cada experiencia (● SSG en el build).
export function generateStaticParams() {
  return STATIONS.map((s) => ({ slug: s.slug }))
}

// Slugs desconocidos → 404 (no se generan bajo demanda).
export const dynamicParams = false

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
