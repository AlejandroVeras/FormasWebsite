"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Building2, Plus, X, Upload, Trash2 } from "lucide-react"

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
}

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProperty, setIsLoadingProperty] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [property, setProperty] = useState<Property | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    area_m2: "",
    address: "",
    city: "Santiago",
    operation_type: "",
    status: "disponible",
  })

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      const supabase = createClient()
      
      try {
        const { data: property, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", params.id)
          .single()

        if (error) throw error
        if (!property) throw new Error("Propiedad no encontrada")

        setProperty(property)
        setFormData({
          title: property.title,
          description: property.description || "",
          price: property.price.toString(),
          property_type: property.property_type,
          bedrooms: property.bedrooms?.toString() || "",
          bathrooms: property.bathrooms?.toString() || "",
          area_m2: property.area_m2?.toString() || "",
          address: property.address,
          city: property.city,
          operation_type: property.operation_type,
          status: property.status,
        })
        setFeatures(property.features || [])
        setImages(property.images || [])
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Error al cargar la propiedad")
        router.push("/admin/properties")
      } finally {
        setIsLoadingProperty(false)
      }
    }

    loadProperty()
  }, [params.id, router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const supabase = createClient()
    const uploadedImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = `${Date.now()}_${file.name}`
      
      const { data, error } = await supabase.storage
        .from("properties-images")
        .upload(fileName, file)

      if (error) {
        alert("Error al subir imagen: " + error.message)
        continue
      }
      
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/properties-images/${fileName}`
      uploadedImages.push(imageUrl)
    }
    setImages([...images, ...uploadedImages])
  }

  const removeImage = (imageToRemove: string) => {
    setImages(images.filter(img => img !== imageToRemove))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        throw new Error("Usuario no autenticado")
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? Number.parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number.parseInt(formData.bathrooms) : null,
        area_m2: formData.area_m2 ? Number.parseFloat(formData.area_m2) : null,
        address: formData.address,
        city: formData.city,
        operation_type: formData.operation_type,
        status: formData.status,
        features: features,
        images: images,
      }

      const { error } = await supabase
        .from("properties")
        .update(propertyData)
        .eq("id", params.id)

      if (error) throw error

      router.push(`/admin/properties/${params.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al actualizar la propiedad")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href={`/admin/properties/${params.id}`} className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Editar Propiedad</h1>
                <p className="text-xs text-gray-500">Modificar información de la propiedad</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Propiedad</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ej: Casa Moderna en Piantini"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe las características principales de la propiedad..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Precio (DOP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="15500000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="operation_type">Tipo de Operación *</Label>
                  <Select
                    value={formData.operation_type}
                    onValueChange={(value) => handleInputChange("operation_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="alquiler">Alquiler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="property_type">Tipo de Propiedad *</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => handleInputChange("property_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="local">Local Comercial</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="alquilado">Alquilado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Detalles de la Propiedad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="bedrooms">Habitaciones</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                    placeholder="3"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    placeholder="2"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <Label htmlFor="area_m2">Área (m²)</Label>
                  <Input
                    id="area_m2"
                    type="number"
                    value={formData.area_m2}
                    onChange={(e) => handleInputChange("area_m2", e.target.value)}
                    placeholder="280.5"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle Principal #123"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Santiago"
                  />
                </div>
              </div>

              {/* Imágenes */}
              <div>
                <Label>Imágenes de la Propiedad</Label>
                <div className="mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Agregar Imágenes
                    </Label>
                  </div>
                </div>
              </div>

              {/* Características */}
              <div>
                <Label>Características</Label>
                <div className="flex gap-2 mt-2 mb-4">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ej: Piscina, Garaje, Jardín..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-2 hover:bg-gray-300 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/admin/properties/${params.id}`}>Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}