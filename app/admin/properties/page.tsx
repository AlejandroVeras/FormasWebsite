"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/firebase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Building2, Plus, Edit, Eye, LogOut, Search, Filter, ArrowLeft } from "lucide-react"

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

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [operationFilter, setOperationFilter] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      const firebase = createClient()
      
      const { data: userData, error: authError } = await firebase.auth.getUser()
      if (authError || !userData?.user) {
        router.push("/admin/login")
        return
      }

      const { data: properties, error } = await firebase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading properties:", error)
      } else {
        setProperties(properties || [])
      }
      setIsLoading(false)
    }

    loadData()
  }, [router])

  const handleSignOut = async () => {
    const firebase = createClient()
    await firebase.auth.signOut()
    router.push("/admin/login")
  }

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

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    const matchesType = typeFilter === "all" || property.property_type === typeFilter
    const matchesOperation = operationFilter === "all" || property.operation_type === operationFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesOperation
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Propiedades</h1>
                  <p className="text-xs text-gray-500">Gestión de Propiedades</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/properties/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Propiedad
                </Link>
              </Button>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título, dirección, ciudad o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alquilado">Alquilado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                </SelectContent>
              </Select>
              <Select value={operationFilter} onValueChange={setOperationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {filteredProperties.length} Propiedad{filteredProperties.length !== 1 ? "es" : ""} 
            {searchTerm || statusFilter !== "all" || typeFilter !== "all" || operationFilter !== "all" 
              ? " encontrada" + (filteredProperties.length !== 1 ? "s" : "")
              : ""
            }
          </h2>
          <p className="text-gray-600">Gestiona el inventario completo de propiedades</p>
        </div>

        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {properties.length === 0 ? "No hay propiedades" : "No se encontraron propiedades"}
              </h3>
              <p className="text-gray-600 mb-4">
                {properties.length === 0 
                  ? "Comienza agregando tu primera propiedad"
                  : "Intenta ajustar los filtros de búsqueda"
                }
              </p>
              {properties.length === 0 && (
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/admin/properties/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Primera Propiedad
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {property.images && property.images[0] ? (
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{formatPrice(property.price)}</span>
                    <Badge variant="outline">
                      {property.operation_type.charAt(0).toUpperCase() + property.operation_type.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="line-clamp-1">
                      {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)} • {property.address}
                    </p>
                    <div className="flex items-center gap-4">
                      {property.bedrooms && (
                        <span>{property.bedrooms} hab</span>
                      )}
                      {property.bathrooms && (
                        <span>{property.bathrooms} baños</span>
                      )}
                      {property.area_m2 && (
                        <span>{property.area_m2} m²</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/admin/properties/${property.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/admin/properties/${property.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
