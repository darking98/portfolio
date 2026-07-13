import { MetadataRoute } from 'next'
import { projects } from '@/components/projects/data'
import { STATIONS } from '@/components/experience-skills/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://diegogabrielrodriguez.com'
  const currentDate = new Date()

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: currentDate,
    priority: 0.7
  }))

  const experienceRoutes: MetadataRoute.Sitemap = STATIONS.map((s) => ({
    url: `${baseUrl}/experience/${s.slug}`,
    lastModified: currentDate,
    priority: 0.6
  }))

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      priority: 1
    },
    ...projectRoutes,
    ...experienceRoutes
  ]
}
