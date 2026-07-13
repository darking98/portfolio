import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, PROJECT_DETAILS } from '@/components/projects/data'
import ProjectJsonLd from '@/components/seo/project-jsonld'
import { WorkPage } from '@/views/work/work.page'

// Pre-renderiza una ruta estática por cada proyecto (● SSG en el build).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

// SEO por proyecto: título/descripción propios + canonical. Sin esto cada
// detalle heredaría el metadata genérico del layout (mismo title que el home).
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  const detail = PROJECT_DETAILS[slug]
  if (!project) return {}

  const title = `${project.title} — ${project.kind} | Diego Gabriel Rodriguez`
  const description = detail?.intro ?? `${project.title} — ${project.kind}.`

  return {
    title,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title,
      description,
      url: `/work/${slug}`,
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

  const project = projects.find((p) => p.slug === slug)
  const detail = PROJECT_DETAILS[slug]
  if (!project || !detail) notFound()

  return (
    <>
      <ProjectJsonLd project={project} detail={detail} />
      <WorkPage project={project} detail={detail} />
    </>
  )
}
