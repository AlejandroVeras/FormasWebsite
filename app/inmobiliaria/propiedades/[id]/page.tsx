import "@/styles/inmobiliaria-verde.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ContactForm from "@/components/contact-form"
import { 
  Home, 
  Building, 
  MapPin, 
  ArrowLeft, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Heart,
  Share2,
  Phone,
  Mail,
  Car,
  Wifi,
  Tv,
  Wind,
  Zap,
  Shield,
  Camera
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface PropertyPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .eq("status", "disponible")
    .single()

  if (!property) {
    return {
      title: "Propiedad no encontrada - FORMAS Inmobiliaria",
    }
  }

  return {
    title: `${property.title} - FORMAS Inmobiliaria`,
    description: property.description || `${property.property_type} en ${property.address}, ${property.city}`,
    openGraph: {
      title: property.title,
      description: property.description || `${property.property_type} en ${property.address}, ${property.city}`,
      images: property.images ? [{ url: property.images[0] }] : [],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .eq("status", "disponible")
    .single()

  if (!property) {
    notFound()
  }

  const formatPrice = (price: number, operationType: string) => {
    const formattedPrice = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    }).format(price)

    return operationType === "alquiler" ? `${formattedPrice}/mes` : formattedPrice
  }

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "casa":
        return Home
      case "apartamento":
        return Building
      case "local":
        return Building
      case "oficina":
        return Building
      default:
        return Home
    }
  }

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase()
    if (lowerFeature.includes("garaje") || lowerFeature.includes("parking")) return Car
    if (lowerFeature.includes("wifi") || lowerFeature.includes("internet")) return Wifi
    if (lowerFeature.includes("tv") || lowerFeature.includes("cable")) return Tv
    if (lowerFeature.includes("aire") || lowerFeature.includes("clima")) return Wind
    if (lowerFeature.includes("luz") || lowerFeature.includes("electricidad")) return Zap
    if (lowerFeature.includes("seguridad") || lowerFeature.includes("vigilancia")) return Shield
    return Home
  }

  const PropertyIcon = getPropertyIcon(property.property_type)

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
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": property.price,
        "priceCurrency": "DOP"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressCountry": property.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": property.country
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area_m2,
      "unitCode": "MTK"
    },
    "datePosted": property.created_at,
    "category": property.operation_type,
    "amenityFeature": property.features?.map(feature => ({
      "@type": "LocationFeatureSpecification",
      "name": feature
    })) || []
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" asChild className="hover:scale-105 transition-transform shrink-0">
                <Link href="/inmobiliaria/propiedades" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver a Propiedades</span><span className="sm:hidden">Volver</span>
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold truncate">{property.title}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{property.address}, {property.city}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                <Heart className="w-4 h-4" />
              </Button>
              <Badge variant={property.operation_type === "venta" ? "default" : "secondary"} className="capitalize">
                {property.operation_type}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          {property.images && property.images.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-2 h-[500px]">
              <div className="md:col-span-3 relative overflow-hidden rounded-lg bg-muted">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4 gap-2 bg-background/90 hover:bg-background"
                >
                  <Camera className="w-4 h-4" />
                  Ver todas las fotos ({property.images.length})
                </Button>
              </div>
              <div className="hidden md:flex flex-col gap-2">
                {property.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="flex-1 relative overflow-hidden rounded-lg bg-muted">
                    <img
                      src={image}
                      alt={`${property.title} - Imagen ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {index === 3 && property.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">+{property.images.length - 5} más</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[500px] bg-gradient-to-br from-inmobiliaria-verde/20 to-inmobiliaria-verde/5 rounded-lg flex items-center justify-center">
              <PropertyIcon className="w-24 h-24 inmobiliaria-verde/50" />
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
                    <p className="text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4" />
                      {property.address}, {property.city}, {property.country}
                    </p>
                    <div className="text-3xl font-bold inmobiliaria-verde">
                      {formatPrice(property.price, property.operation_type)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2 capitalize">
                      {property.property_type}
                    </Badge>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Publicado {new Date(property.created_at).toLocaleDateString('es-DO')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mb-6">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.bedrooms}</span>
                      <span className="text-muted-foreground">Habitaciones</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.bathrooms}</span>
                      <span className="text-muted-foreground">Baños</span>
                    </div>
                  )}
                  {property.area_m2 && (
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.area_m2}m²</span>
                      <span className="text-muted-foreground">Área</span>
                    </div>
                  )}
                </div>

                {property.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Características y Comodidades</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => {
                      const FeatureIcon = getFeatureIcon(feature)
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <FeatureIcon className="w-5 h-5 inmobiliaria-verde" />
                          <span>{feature}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Map Placeholder */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ubicación</h3>
                <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Mapa interactivo próximamente</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.address}, {property.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <ContactForm 
              propertyId={property.id} 
              propertyTitle={property.title}
            />

            {/* Quick Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contacto Directo</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href="tel:+18095551234">
                      <Phone className="w-4 h-4" />
                      Llamar ahora
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href="mailto:inmobiliaria@formas.com.do">
                      <Mail className="w-4 h-4" />
                      Enviar email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Agente Inmobiliario</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 inmobiliaria-verde-light-bg rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">FORMAS Inmobiliaria</h4>
                    <p className="text-sm text-muted-foreground">Equipo de ventas</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Especialistas en propiedades en Santiago. Más de 10 años de experiencia en el mercado inmobiliario.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="w-3 h-3 mr-1" />
                    Llamar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}