import "@/styles/inmobiliaria-verde.css"
import { createServerClient } from "@/lib/firebase/server"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import PropertyDetailClient from "@/components/property-detail-client"

interface PropertyPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const firebase = await createServerClient()
  const { data: property } = await firebase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!property) {
    return {
      title: "Propiedad no encontrada - Inmobiliaria Formas",
    }
  }

  return {
    title: `${property.title} - Inmobiliaria Formas`,
    description: property.description || `${property.property_type} en ${property.address}, ${property.city}`,
    openGraph: {
      title: property.title,
      description: property.description || `${property.property_type} en ${property.address}, ${property.city}`,
      images: property.images ? [{ url: property.images[0] }] : [],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const firebase = await createServerClient()

  const { data: property } = await firebase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!property) {
    notFound()
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://formas.com.do/inmobiliaria/propiedades/${property.id}`,
    "image": property.images?.[0] || "",
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "DOP",
      "availability": "https://schema.org/InStock",
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressCountry": property.country || "República Dominicana",
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area_m2,
      "unitCode": "MTK",
    },
    "datePosted": property.created_at,
    "category": property.operation_type,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PropertyDetailClient property={property} />
    </>
  )
}