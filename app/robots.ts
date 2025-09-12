import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/_next/", "/tmp/"],
    },
    sitemap: "https://formas.com.do/sitemap.xml",
  }
}