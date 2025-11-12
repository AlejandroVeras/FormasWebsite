"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/firebase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DeletePropertyDialog } from "@/components/admin/delete-property-dialog"
import Link from "next/link"
import { ArrowLeft, Building2, Edit, MapPin, Calendar, User } from "lucide-react"

interface Property {
  id: string
  title: string
  description: string | null
  price: number
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number | null
  address: string
  city: string
  operation_type: string
  status: string
  features: string[]
  images: string[]
  created_at: string
}

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProperty = async () => {
      const firebase = createClient()
      
      const { data: userData, error: authError } = await firebase.auth.getUser()
      if (authError || !userData?.user) {
        router.push("/admin/login")
        return
      }

      const { data: property, error } = await firebase
        .from("properties")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error || !property) {
        router.push("/admin/properties")
        return
      }

      setProperty(property)
      setIsLoading(false)
    }

    loadProperty()
  }, [params.id, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponible":
        return "bg-green-100 text-green-800"
      case "vendido":
        return "bg-blue-100 text-blue-800"
      case "alquilado":
        return "bg-purple-100 text-purple-800"
      case "reservado":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-DO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/properties" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Detalles de Propiedad</h1>
                  <p className="text-xs text-gray-500">Información completa</p>
                </div>
              </div>
            </div>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={`/admin/properties/${property.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen Principal */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 relative rounded-t-lg overflow-hidden">
                  {property.images && property.images[0] ? (
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <Badge className={`absolute top-4 right-4 ${getStatusColor(property.status)}`}>
                    {property.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Información Básica */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{property.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {property.address}, {property.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{formatPrice(property.price)}</div>
                    <Badge variant="outline" className="mt-1">
                      {property.operation_type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {property.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* Características de la Propiedad */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg">{property.property_type}</div>
                    <div className="text-sm text-gray-600">Tipo</div>
                  </div>
                  {property.bedrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Habitaciones</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Baños</div>
                    </div>
                  )}
                  {property.area_m2 && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{property.area_m2}</div>
                      <div className="text-sm text-gray-600">m²</div>
                    </div>
                  )}
                </div>

                {/* Características Adicionales */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Características</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <div className="space-y-6">
            {/* Información del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium">Creado</div>
                    <div className="text-gray-600">{formatDate(property.created_at)}</div>
                  </div>
                </div>
                {property.updated_at !== property.created_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Actualizado</div>
                      <div className="text-gray-600">{formatDate(property.updated_at)}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium">ID de Propiedad</div>
                    <div className="text-gray-600 font-mono text-xs">{property.id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href={`/admin/properties/${property.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Propiedad
                  </Link>
                </Button>
                <DeletePropertyDialog 
                  propertyId={property.id}
                  propertyTitle={property.title}
                  variant="destructive"
                  className="w-full"
                />
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/admin/properties">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Lista
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
