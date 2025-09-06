import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Building, MapPin, ArrowLeft, Bed, Bath, Square, Filter } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function PropiedadesPage() {
  const supabase = await createClient()

  // Obtener todas las propiedades disponibles
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "disponible")
    .order("created_at", { ascending: false })

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

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Input placeholder="Buscar por ubicación, tipo de propiedad..." className="bg-background" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder="Operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-background">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{properties?.length || 0} Propiedades Disponibles</h2>
            <p className="text-muted-foreground">Encuentra la propiedad perfecta para ti en Santiago</p>
          </div>

          {properties && properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => {
                const PropertyIcon = getPropertyIcon(property.property_type)
                return (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center relative">
                      {property.images && property.images[0] ? (
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PropertyIcon className="w-12 h-12 text-accent/50" />
                      )}
                      <Badge
                        variant={property.operation_type === "venta" ? "secondary" : "outline"}
                        className="absolute top-2 right-2"
                      >
                        {property.operation_type}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h4>
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
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Home className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No hay propiedades disponibles</h3>
              <p className="text-muted-foreground mb-6">Próximamente tendremos nuevas propiedades para ti</p>
              <Button variant="outline" asChild>
                <Link href="/inmobiliaria">Volver al inicio</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
