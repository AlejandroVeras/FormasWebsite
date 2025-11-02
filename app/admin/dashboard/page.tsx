import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Plus, Settings, LogOut, MessageSquare, Mail, Star } from "lucide-react"
import FeaturedPropertiesSection from "@/components/admin/featured-properties-section"

// Marcar esta página como dinámica para evitar la generación estática
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  try {
    // Obtener estadísticas
    const [propertiesResult, inquiriesResult] = await Promise.all([
      // Obtener propiedades
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/properties/stats`).then(res => res.json()),
      // Obtener consultas
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/inquiries/stats`).then(res => res.json())
    ])

    const {
      total: totalProperties = 0,
      available: availableProperties = 0,
      sold: soldProperties = 0
    } = propertiesResult

    const {
      total: totalInquiries = 0,
      new: newInquiries = 0,
      pending: pendingInquiries = 0
    } = inquiriesResult

  const handleSignOut = async () => {
    "use server"
    const supabase = await createServerClient()
    await supabase.auth.signOut()
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Formas Inmobiliaria</h1>
                  <p className="text-xs text-gray-500">Panel de Administración</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bienvenido, {profile?.full_name || data.user.email}</span>
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
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Gestiona las propiedades de la inmobiliaria</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Propiedades</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableProperties}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Nuevas</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{newInquiries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingInquiries}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Propiedades</CardTitle>
              <CardDescription>Administra el inventario de propiedades disponibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/admin/properties/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Nueva Propiedad
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/properties">Ver Todas las Propiedades</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consultas de Clientes</CardTitle>
              <CardDescription>Gestiona las consultas recibidas de propiedades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/queries">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ver Consultas
                </Link>
              </Button>
              <div className="text-sm text-gray-600">
                {newInquiries > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {newInquiries} nueva{newInquiries !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Configuraciones del sitio y perfil de usuario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-gray-600 hover:bg-gray-700">
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración del Sitio
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/profile">
                  Editar Perfil
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/inmobiliaria">Ver Página Pública</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Properties Management */}
        <FeaturedPropertiesSection />
      </main>
    </div>
  )
}
