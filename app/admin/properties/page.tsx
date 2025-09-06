import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, Plus, Edit, Eye, LogOut } from "lucide-react"

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/admin/login")
  }

  // Obtener todas las propiedades
  const { data: properties } = await supabase.from("properties").select("*").order("created_at", { ascending: false })

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/admin/login")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Formas Inmobiliaria</h1>
                  <p className="text-xs text-gray-500">Gestión de Propiedades</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/properties/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Propiedad
                </Link>
              </Button>
              <form action={handleSignOut}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Propiedades</h2>
          <p className="text-gray-600">Gestiona el inventario completo de propiedades</p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property) => (
            <Card key={property.id} className="overflow-hidden">
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
                <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)}`}>{property.status}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{formatPrice(property.price)}</span>
                  <Badge variant="outline">{property.operation_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    {property.property_type} • {property.city}
                  </p>
                  {property.bedrooms && property.bathrooms && (
                    <p>
                      {property.bedrooms} hab • {property.bathrooms} baños
                    </p>
                  )}
                  {property.area_m2 && <p>{property.area_m2} m²</p>}
                </div>
                <div className="flex gap-2 mt-4">
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

        {(!properties || properties.length === 0) && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades</h3>
            <p className="text-gray-600 mb-4">Comienza agregando tu primera propiedad</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/admin/properties/new">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Propiedad
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
