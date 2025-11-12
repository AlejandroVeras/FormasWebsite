"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  MessageSquare,
  Send,
  History
} from "lucide-react"

interface PropertyInquiry {
  id: string
  property_id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  response: string | null
  responded_at: string | null
  created_at: string
  properties?: {
    title: string
    address: string
    price: number
    property_type: string
    operation_type: string
  }
}

interface Interaction {
  id: string
  type: string
  description: string
  details: any
  created_at: string
  created_by: string | null
}

interface QueryDetailPageProps {
  params: {
    id: string
  }
}

export default function QueryDetailPage({ params }: QueryDetailPageProps) {
  const router = useRouter()
  const [inquiry, setInquiry] = useState<PropertyInquiry | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [response, setResponse] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [newInteraction, setNewInteraction] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const firebase = createClient()
      
      const { data: userData, error: authError } = await firebase.auth.getUser()
      if (authError || !userData?.user) {
        router.push("/admin/login")
        return
      }

      // 1) Cargar la consulta (sin joins)
      const { data: inquiry, error: inquiryError } = await firebase
        .from("property_inquiries")
        .select("*")
        .eq("id", params.id)
        .single()

      if (inquiryError || !inquiry) {
        router.push("/admin/queries")
        return
      }

      // 2) Si tiene propiedad asociada, cargar datos de la propiedad
      let attachedInquiry = inquiry
      if (inquiry.property_id) {
        const { data: prop } = await firebase
          .from("properties")
          .select("*")
          .eq("id", inquiry.property_id)
          .single()
        if (prop) {
          attachedInquiry = {
            ...inquiry,
            properties: {
              title: prop.title,
              address: prop.address,
              price: prop.price,
              property_type: prop.property_type,
              operation_type: prop.operation_type,
            },
          }
        }
      }

      setInquiry(attachedInquiry)
      setNewStatus(inquiry.status)
      setResponse(inquiry.response || "")

      // 3) Cargar interacciones
      const { data: interactions, error: interactionsError } = await firebase
        .from("inquiry_interactions")
        .select("*")
        .eq("inquiry_id", params.id)
        .order("created_at", { ascending: false })

      if (!interactionsError) {
        setInteractions(interactions || [])
      }

      setIsLoading(false)
    }

    loadData()
  }, [params.id, router])

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

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "email_sent":
        return <Mail className="w-4 h-4 text-blue-500" />
      case "phone_call":
        return <Phone className="w-4 h-4 text-green-500" />
      case "meeting":
        return <User className="w-4 h-4 text-purple-500" />
      case "note":
        return <MessageSquare className="w-4 h-4 text-gray-500" />
      case "status_change":
        return <History className="w-4 h-4 text-orange-500" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />
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

  const handleUpdateStatus = async () => {
    if (!inquiry) return

    setIsUpdating(true)
    const firebase = createClient()

    try {
      const { error } = await firebase
        .from("property_inquiries")
        .update({ status: newStatus })
        .eq("id", inquiry.id)

      if (error) throw error

      setInquiry({ ...inquiry, status: newStatus })
      
      // Reload interactions to show the status change
      const { data: updatedInteractions } = await firebase
        .from("inquiry_interactions")
        .select("*")
        .eq("inquiry_id", params.id)
        .order("created_at", { ascending: false })

      if (updatedInteractions) {
        setInteractions(updatedInteractions)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error al actualizar el estado")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendResponse = async () => {
    if (!inquiry || !response.trim()) return

    setIsUpdating(true)
    const firebase = createClient()

    try {
      const { data: user } = await firebase.auth.getUser()
      if (!user.user) throw new Error("Usuario no autenticado")

      // Update inquiry with response
      const { error: updateError } = await firebase
        .from("property_inquiries")
        .update({
          response: response,
          responded_at: new Date().toISOString(),
          responded_by: user.user.id,
          status: newStatus === "nuevo" ? "en_proceso" : newStatus
        })
        .eq("id", inquiry.id)

      if (updateError) throw updateError

      // Create interaction record
      const { error: interactionError } = await firebase
        .from("inquiry_interactions")
        .insert({
          inquiry_id: inquiry.id,
          type: "email_sent",
          description: "Respuesta enviada por email",
          details: {
            response: response,
            email_to: inquiry.email
          },
          created_by: user.user.id
        })

      if (interactionError) throw interactionError

      // Here you would typically send the actual email
      // For now, we'll just simulate it
      alert("Respuesta guardada. En una implementación real, se enviaría el email automáticamente.")

      // Update local state
      setInquiry({
        ...inquiry,
        response: response,
        responded_at: new Date().toISOString(),
        status: newStatus === "nuevo" ? "en_proceso" : newStatus
      })

      // Reload interactions
      const { data: updatedInteractions } = await firebase
        .from("inquiry_interactions")
        .select("*")
        .eq("inquiry_id", params.id)
        .order("created_at", { ascending: false })

      if (updatedInteractions) {
        setInteractions(updatedInteractions)
      }

      setNewStatus(newStatus === "nuevo" ? "en_proceso" : newStatus)
    } catch (error) {
      console.error("Error sending response:", error)
      alert("Error al enviar la respuesta")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddInteraction = async () => {
    if (!inquiry || !newInteraction.trim()) return

    const firebase = createClient()

    try {
      const { data: user } = await firebase.auth.getUser()
      if (!user.user) throw new Error("Usuario no autenticado")

      const { error } = await firebase
        .from("inquiry_interactions")
        .insert({
          inquiry_id: inquiry.id,
          type: "note",
          description: newInteraction,
          created_by: user.user.id
        })

      if (error) throw error

      // Reload interactions
      const { data: updatedInteractions } = await firebase
        .from("inquiry_interactions")
        .select("*")
        .eq("inquiry_id", params.id)
        .order("created_at", { ascending: false })

      if (updatedInteractions) {
        setInteractions(updatedInteractions)
      }

      setNewInteraction("")
    } catch (error) {
      console.error("Error adding interaction:", error)
      alert("Error al agregar la nota")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando consulta...</p>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin/queries" className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Detalle de Consulta</h1>
                <p className="text-xs text-gray-500">Gestión de consulta</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inquiry Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inquiry Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Información del Contacto</CardTitle>
                  <Badge className={getStatusColor(inquiry.status)}>
                    {getStatusLabel(inquiry.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nombre</Label>
                    <p className="text-sm font-semibold">{inquiry.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-sm">{inquiry.email}</p>
                  </div>
                  {inquiry.phone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Teléfono</Label>
                      <p className="text-sm">{inquiry.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Fecha</Label>
                    <p className="text-sm">{formatDate(inquiry.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Mensaje</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{inquiry.message}</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            {inquiry.properties && (
              <Card>
                <CardHeader>
                  <CardTitle>Propiedad de Interés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{inquiry.properties.title}</h3>
                      <p className="text-gray-600 flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" />
                        {inquiry.properties.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">
                          {inquiry.properties.property_type.charAt(0).toUpperCase() + inquiry.properties.property_type.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {inquiry.properties.operation_type.charAt(0).toUpperCase() + inquiry.properties.operation_type.slice(1)}
                        </Badge>
                        <span className="font-semibold text-green-600">
                          {formatPrice(inquiry.properties.price)}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/admin/properties/${inquiry.property_id}`}>
                        Ver Propiedad
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Response */}
            <Card>
              <CardHeader>
                <CardTitle>Respuesta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="response">Mensaje de Respuesta</Label>
                  <Textarea
                    id="response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Escribe tu respuesta al cliente..."
                    rows={6}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleSendResponse}
                    disabled={isUpdating || !response.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isUpdating ? "Enviando..." : "Enviar Respuesta"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & History */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Cambiar Estado</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newStatus !== inquiry.status && (
                  <Button 
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="w-full"
                    variant="outline"
                  >
                    {isUpdating ? "Actualizando..." : "Actualizar Estado"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Add Note */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agregar Nota</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={newInteraction}
                  onChange={(e) => setNewInteraction(e.target.value)}
                  placeholder="Agregar nota interna..."
                  rows={3}
                />
                <Button 
                  onClick={handleAddInteraction}
                  disabled={!newInteraction.trim()}
                  className="w-full"
                  variant="outline"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Agregar Nota
                </Button>
              </CardContent>
            </Card>

            {/* Interaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {interactions.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No hay interacciones registradas</p>
                  ) : (
                    interactions.map((interaction) => (
                      <div key={interaction.id} className="flex gap-3 pb-3 border-b last:border-b-0">
                        <div className="flex-shrink-0 mt-1">
                          {getInteractionIcon(interaction.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{interaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(interaction.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}