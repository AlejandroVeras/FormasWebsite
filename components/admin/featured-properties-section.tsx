import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, StarOff, ArrowUp, ArrowDown } from "lucide-react"
import { createServerClient } from "@/lib/firebase/server"
import Link from "next/link"

interface FeaturedProperty {
  id: string
  title: string
  price: number
  operation_type: string
  featured_order: number | null
  images: string[]
}

async function toggleFeatured(propertyId: string, featured: boolean, order?: number) {
  "use server"
  
  const supabase = await createServerClient()
  
  if (featured) {
    // Get next order number if not provided
    if (order === undefined) {
      const { data: maxOrderProperty } = await supabase
        .from("properties")
        .select("featured_order")
        .eq("featured", true)
        .order("featured_order", { ascending: false })
        .limit(1)
        .single()
      
      order = (maxOrderProperty?.featured_order || 0) + 1
    }
    
    await supabase
      .from("properties")
      .update({ featured: true, featured_order: order })
      .eq("id", propertyId)
  } else {
    await supabase
      .from("properties")
      .update({ featured: false, featured_order: null })
      .eq("id", propertyId)
    
    // Reorder remaining featured properties
    const { data: featuredProperties } = await supabase
      .from("properties")
      .select("id, featured_order")
      .eq("featured", true)
      .order("featured_order")
    
    if (featuredProperties) {
      for (let i = 0; i < featuredProperties.length; i++) {
        await supabase
          .from("properties")
          .update({ featured_order: i + 1 })
          .eq("id", featuredProperties[i].id)
      }
    }
  }
}

async function reorderFeatured(propertyId: string, direction: "up" | "down") {
  "use server"
  
  const supabase = await createServerClient()
  
  // Get current property
  const { data: currentProperty } = await supabase
    .from("properties")
    .select("featured_order")
    .eq("id", propertyId)
    .single()
  
  if (!currentProperty?.featured_order) return
  
  const currentOrder = currentProperty.featured_order
  const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1
  
  // Get property to swap with
  const { data: swapProperty } = await supabase
    .from("properties")
    .select("id")
    .eq("featured", true)
    .eq("featured_order", newOrder)
    .single()
  
  if (swapProperty) {
    // Swap orders
    await supabase
      .from("properties")
      .update({ featured_order: newOrder })
      .eq("id", propertyId)
    
    await supabase
      .from("properties")
      .update({ featured_order: currentOrder })
      .eq("id", swapProperty.id)
  }
}

export default async function FeaturedPropertiesSection() {
  const supabase = await createServerClient()
  
  // TODO: Enable this after running the database migration (006_add_featured_properties.sql)
  // Get featured properties
  // const { data: featuredProperties } = await supabase
  //   .from("properties")
  //   .select("id, title, price, operation_type, featured_order, images")
  //   .eq("featured", true)
  //   .order("featured_order")
  
  // Temporary: Get recent properties until migration is run
  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("id, title, price, operation_type, images")
    .eq("status", "disponible")
    .order("created_at", { ascending: false })
    .limit(3)
  
  // Get available properties that are not featured
  const { data: availableProperties } = await supabase
    .from("properties")
    .select("id, title, price, operation_type, images")
    .eq("status", "disponible")
    .order("created_at", { ascending: false })
    .limit(10)
  
  const formatPrice = (price: number, operationType: string) => {
    const formattedPrice = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    }).format(price)
    return operationType === "alquiler" ? `${formattedPrice}/mes` : formattedPrice
  }
  
  return (
    <div className="space-y-6">
      {/* Featured Properties Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Propiedades Destacadas
          </CardTitle>
          <CardDescription>
            Gestiona las propiedades que aparecen en la sección destacada del sitio web
            <br />
            <Badge variant="outline" className="text-xs mt-2">
              ⚠️ Ejecuta el script 006_add_featured_properties.sql para habilitar esta funcionalidad
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuredProperties && featuredProperties.length > 0 ? (
            <div className="space-y-3">
              {featuredProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{property.title}</h4>
                      <p className="text-sm text-gray-600">
                        {formatPrice(property.price, property.operation_type)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        Temporal: {index + 1}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Migración pendiente
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/properties/${property.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay propiedades disponibles</p>
              <p className="text-sm">Ejecuta la migración de base de datos para habilitar propiedades destacadas</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Available Properties to Feature */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Disponibles</CardTitle>
          <CardDescription>
            Selecciona propiedades para destacar en el sitio web
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableProperties && availableProperties.length > 0 ? (
            <div className="grid gap-3">
              {availableProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{property.title}</h4>
                      <p className="text-sm text-gray-600">
                        {formatPrice(property.price, property.operation_type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="bg-yellow-500 hover:bg-yellow-600"
                      disabled
                      title="Disponible después de la migración de BD"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Destacar
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/properties/${property.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay propiedades disponibles para destacar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}