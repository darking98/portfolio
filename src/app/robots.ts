import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/'
      }
    ],
    sitemap: 'https://diegogabrielrodriguez.com/sitemap.xml',
    host: 'https://diegogabrielrodriguez.com'
  }
}