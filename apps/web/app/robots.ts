import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fulcra.app"

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/jobs", "/jobs/*", "/how-scoring-works", "/what-fulcra-is"],
      disallow: ["/api/*", "/candidate/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
