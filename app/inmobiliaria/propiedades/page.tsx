import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Home, Building, MapPin, ArrowLeft, Bed, Bath, Square, Filter, Search, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"

interface SearchParams {
  search?: string
  property_type?: string
  operation_type?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  bathrooms?: string
  city?: string
  page?: string
}

interface PropiedadesPageProps {
  searchParams: SearchParams
}

async function PropertyList({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()

  // Pagination settings
  const ITEMS_PER_PAGE = 12
  const currentPage = parseInt(searchParams.page || "1")
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // Build dynamic query based on search parameters
  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("status", "disponible")

  // Apply filters
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,address.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  if (searchParams.property_type && searchParams.property_type !== "all") {
    query = query.eq("property_type", searchParams.property_type)
  }

  if (searchParams.operation_type && searchParams.operation_type !== "all") {
    query = query.eq("operation_type", searchParams.operation_type)
  }

  if (searchParams.min_price) {
    query = query.gte("price", parseInt(searchParams.min_price))
  }

  if (searchParams.max_price) {
    query = query.lte("price", parseInt(searchParams.max_price))
  }

  if (searchParams.bedrooms && searchParams.bedrooms !== "all") {
    query = query.eq("bedrooms", parseInt(searchParams.bedrooms))
  }

  if (searchParams.bathrooms && searchParams.bathrooms !== "all") {
    query = query.eq("bathrooms", parseInt(searchParams.bathrooms))
  }

  if (searchParams.city && searchParams.city !== "all") {
    query = query.eq("city", searchParams.city)
  }

  const { data: properties, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

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

  // Generate pagination URLs
  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value)
      }
    })
    if (page > 1) {
      params.set("page", page.toString())
    }
    return `/inmobiliaria/propiedades?${params.toString()}`
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {count || 0} Propiedades Encontradas
        </h2>
        <p className="text-muted-foreground">
          {Object.keys(searchParams).length > 0 
            ? "Resultados filtrados según tus criterios de búsqueda"
            : "Encuentra la propiedad perfecta para ti en Santiago"
          }
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-muted-foreground mt-1">
            Página {currentPage} de {totalPages}
          </p>
        )}
      </div>

      {properties && properties.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => {
              const PropertyIcon = getPropertyIcon(property.property_type)
              return (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                  <Link href={`/inmobiliaria/propiedades/${property.id}`}>
                    <div className="h-48 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center relative overflow-hidden">
                      {property.images && property.images[0] ? (
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <PropertyIcon className="w-12 h-12 text-accent/50" />
                      )}
                      <Badge
                        variant={property.operation_type === "venta" ? "secondary" : "outline"}
                        className="absolute top-2 right-2 bg-background/90"
                      >
                        {property.operation_type}
                      </Badge>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/inmobiliaria/propiedades/${property.id}`}>
                      <h4 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors">
                        {property.title}
                      </h4>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">
                        {property.address}, {property.city}
                      </span>
                    </p>

                    <div className="flex gap-3 text-sm text-muted-foreground mb-3">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.area_m2 && (
                        <div className="flex items-center gap-1">
                          <Square className="w-3 h-3" />
                          <span>{property.area_m2}m²</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-accent">
                        {formatPrice(property.price, property.operation_type)}
                      </span>
                      <Button size="sm" variant="outline" asChild className="hover:scale-105 transition-transform">
                        <Link href={`/inmobiliaria/propiedades/${property.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={generatePageUrl(currentPage - 1)} />
                    </PaginationItem>
                  )}
                  
                  {/* Page numbers */}
                  {(() => {
                    const pages = []
                    const showPages = 5
                    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
                    let endPage = Math.min(totalPages, startPage + showPages - 1)
                    
                    if (endPage - startPage < showPages - 1) {
                      startPage = Math.max(1, endPage - showPages + 1)
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href={generatePageUrl(i)}
                            isActive={i === currentPage}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                    return pages
                  })()}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={generatePageUrl(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Home className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground mb-2">
            No se encontraron propiedades
          </h3>
          <p className="text-muted-foreground mb-6">
            Intenta ajustar tus filtros de búsqueda o explora todas nuestras propiedades
          </p>
          <Button variant="outline" asChild>
            <Link href="/inmobiliaria/propiedades">Ver todas las propiedades</Link>
          </Button>
        </div>
      )}
    </>
  )
}

export default async function PropiedadesPage({ searchParams }: PropiedadesPageProps) {
  const supabase = await createClient()

  // Get unique cities for the filter
  const { data: cities } = await supabase
    .from("properties")
    .select("city")
    .eq("status", "disponible")
    .order("city")

  const uniqueCities = [...new Set(cities?.map(c => c.city) || [])].filter(Boolean)

  // Check if any filters are active
  const hasActiveFilters = Object.keys(searchParams).length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-accent">Todas las Propiedades</h1>
                <p className="text-xs text-muted-foreground">Encuentra tu hogar ideal</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/inmobiliaria" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Search and Filters */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <form method="GET" className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  name="search"
                  placeholder="Buscar por ubicación, tipo de propiedad, características..." 
                  className="bg-background pl-10"
                  defaultValue={searchParams.search || ""}
                />
              </div>
              <Button type="submit" className="md:w-auto bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Select name="property_type" defaultValue={searchParams.property_type || "all"}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>

              <Select name="operation_type" defaultValue={searchParams.operation_type || "all"}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Venta y Alquiler</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>

              <Select name="city" defaultValue={searchParams.city || "all"}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select name="bedrooms" defaultValue={searchParams.bedrooms || "all"}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Habitaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier cantidad</SelectItem>
                  <SelectItem value="1">1+ habitación</SelectItem>
                  <SelectItem value="2">2+ habitaciones</SelectItem>
                  <SelectItem value="3">3+ habitaciones</SelectItem>
                  <SelectItem value="4">4+ habitaciones</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-1">
                <Input 
                  name="min_price"
                  type="number"
                  placeholder="Precio mín"
                  className="bg-background text-sm"
                  defaultValue={searchParams.min_price || ""}
                />
                <Input 
                  name="max_price"
                  type="number"
                  placeholder="Precio máx"
                  className="bg-background text-sm"
                  defaultValue={searchParams.max_price || ""}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="outline" className="bg-background flex-1">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                {hasActiveFilters && (
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <Link href="/inmobiliaria/propiedades">
                      <X className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-muted-foreground">Filtros activos:</span>
                {Object.entries(searchParams).map(([key, value]) => {
                  if (!value || value === "all") return null
                  
                  let displayValue = value
                  if (key === "property_type") displayValue = `Tipo: ${value}`
                  if (key === "operation_type") displayValue = `Operación: ${value}`
                  if (key === "min_price") displayValue = `Desde: $${parseInt(value).toLocaleString()}`
                  if (key === "max_price") displayValue = `Hasta: $${parseInt(value).toLocaleString()}`
                  if (key === "bedrooms") displayValue = `${value}+ hab.`
                  if (key === "city") displayValue = `Ciudad: ${value}`
                  if (key === "search") displayValue = `"${value}"`

                  return (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {displayValue}
                    </Badge>
                  )
                })}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }>
            <PropertyList searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
