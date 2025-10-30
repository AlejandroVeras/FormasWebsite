"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Building2, LogOut, Search, Mail, Phone, MapPin, Clock, Filter } from "lucide-react"

interface PropertyInquiry {
  id: string
  property_id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  created_at: string
  properties?: {
    title: string
    address: string
    price: number
  }
}

export default function QueriesPage() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        router.push("/admin/login")
        return
      }

      // 1) Cargar consultas (sin joins)
      const { data: inquiries, error } = await supabase
        .from("property_inquiries")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading inquiries:", error)
      } else {
        // 2) Para cada consulta, si tiene property_id, cargar datos básicos de la propiedad
        const withProperty = await Promise.all((inquiries || []).map(async (inq: any) => {
          if (!inq?.property_id) return inq
          const { data: prop } = await supabase
            .from("properties")
            .select("*")
            .eq("id", inq.property_id)
            .single()
          return {
            ...inq,
            properties: prop ? {
              title: prop.title,
              address: prop.address,
              price: prop.price,
            } : undefined,
          }
        }))
        setInquiries(withProperty)
      }
      setIsLoading(false)
    }

    loadData()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nuevo":
        return "bg-blue-100 text-blue-800"
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800"
      case "completado":
        return "bg-green-100 text-green-800"
      case "cerrado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "nuevo":
        return "Nuevo"
      case "en_proceso":
        return "En Proceso"
      case "completado":
        return "Completado"
      case "cerrado":
        return "Cerrado"
      default:
        return status
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-DO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.properties?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando consultas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center space-x-2 mr-6">
                <ArrowLeft className="w-5 h-5" />
                <div className="flex items-center space-x-2">
                  <Building2 className="w-8 h-8 text-green-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Consultas</h1>
                    <p className="text-xs text-gray-500">Gestión de Consultas</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
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
                  placeholder="Buscar por nombre, email, propiedad o mensaje..."
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
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
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
            {filteredInquiries.length} Consulta{filteredInquiries.length !== 1 ? "s" : ""}
          </h2>
          <p className="text-gray-600">Gestiona las consultas recibidas de propiedades</p>
        </div>

        {filteredInquiries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay consultas</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "No se encontraron consultas con los filtros aplicados."
                  : "No se han recibido consultas aún."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                        <Badge className={getStatusColor(inquiry.status)}>
                          {getStatusLabel(inquiry.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {inquiry.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(inquiry.created_at)}
                        </div>
                      </div>

                      {inquiry.properties && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <Building2 className="w-4 h-4" />
                            {inquiry.properties.title}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {inquiry.properties.address}
                            </div>
                            <div className="font-semibold text-green-600">
                              {formatPrice(inquiry.properties.price)}
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-gray-700 text-sm mb-4">{inquiry.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                        <Link href={`/admin/queries/${inquiry.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                      {inquiry.properties && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/properties/${inquiry.property_id}`}>
                            Ver Propiedad
                          </Link>
                        </Button>
                      )}
                    </div>
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