import { notFound } from 'next/navigation'
import { projects, PROJECT_DETAILS } from '@/components/projects/data'
import { WorkPage } from '@/views/work/work.page'

// Pre-renderiza una ruta estática por cada proyecto (● SSG en el build).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const project = projects.find((p) => p.slug === slug)
  const detail = PROJECT_DETAILS[slug]
  if (!project || !detail) notFound()

  return <WorkPage project={project} detail={detail} />
}
