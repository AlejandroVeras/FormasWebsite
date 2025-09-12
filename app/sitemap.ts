import { createClient } from "@/lib/supabase/server"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://formas.com.do"
  
  const supabase = await createClient()
  
  // Get all available properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, updated_at")
    .eq("status", "disponible")

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/inmobiliaria`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/inmobiliaria/propiedades`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/constructora`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/estructuras-metalicas`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  // Property pages
  const propertyPages = (properties || []).map((property) => ({
    url: `${baseUrl}/inmobiliaria/propiedades/${property.id}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...propertyPages]
}