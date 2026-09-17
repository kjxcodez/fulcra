import { MetadataRoute } from "next"
import { JOB_FIXTURES } from "@/lib/jobs/jobs-fixtures"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fulcra.app"

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-scoring-works`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/what-fulcra-is`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Dynamic job detail routes
  const jobRoutes: MetadataRoute.Sitemap = JOB_FIXTURES.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug || job.id}`,
    lastModified: new Date(job.updatedAt || job.postedAt),
    changeFrequency: "daily",
    priority: 0.8,
  }))

  return [...staticRoutes, ...jobRoutes]
}
