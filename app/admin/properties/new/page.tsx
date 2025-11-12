"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Building2, Plus, X } from "lucide-react"
import { uploadImage } from "@/lib/storage"

export default function NewPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

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
const [images, setImages] = useState<string[]>([]);

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;
  let uploadedImages: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `${Date.now()}_${file.name}`;
    try {
      const { url } = await uploadImage(file, fileName)
      uploadedImages.push(url)
    } catch (e: any) {
      alert("Error al subir imagen: " + (e?.message || "desconocido"))
    }
  }
  setImages([...images, ...uploadedImages]);
};
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

    const firebase = createClient()

    try {
      const { data: user } = await firebase.auth.getUser()
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
        created_by: user.user.id,
      }

      const { error } = await firebase.from("properties").insert([propertyData])

      if (error) throw error

      router.push("/admin/properties")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al crear la propiedad")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin/properties" className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nueva Propiedad</h1>
                <p className="text-xs text-gray-500">Agregar propiedad al inventario</p>
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
                  />
                </div>

                <div>
                  <Label htmlFor="area_m2">Área (m²)</Label>
                  <Input
                    id="area_m2"
                    type="number"
                    step="0.01"
                    value={formData.area_m2}
                    onChange={(e) => handleInputChange("area_m2", e.target.value)}
                    placeholder="280.50"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle Principal #123, Piantini"
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
<div>
  <Label>Imágenes</Label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageUpload}
    className="block mt-2"
  />
  <div className="flex gap-2 mt-2">
    {images.map((url) => (
      <img key={url} src={url} alt="Preview" className="w-20 h-20 object-cover rounded" />
    ))}
  </div>
</div>
              {/* Características */}
              <div>
                <Label>Características</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ej: piscina, garaje, jardín..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button type="button" onClick={() => removeFeature(feature)} className="ml-1">
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
                  {isLoading ? "Guardando..." : "Guardar Propiedad"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/properties">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
