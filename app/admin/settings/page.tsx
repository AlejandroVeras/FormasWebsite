"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { 
  ArrowLeft, 
  Building2, 
  LogOut, 
  Phone,
  Mail,
  MapPin,
  Globe,
  Search,
  Hash,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  Save
} from "lucide-react"

interface SiteSetting {
  id: string
  key: string
  value: any
  category: string
  description: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    // Contact
    company_name: "",
    company_phone: "",
    company_email: "",
    company_address: "",
    company_description: "",
    
    // SEO
    site_title: "",
    site_description: "",
    site_keywords: "",
    
    // Social
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",
    social_linkedin: "",
    social_whatsapp: "",
    
    // General
    featured_properties_limit: "6",
    currency: "DOP",
    timezone: "America/Santo_Domingo"
  })

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient()
      
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        router.push("/admin/login")
        return
      }

      const { data: settings, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("category", { ascending: true })

      if (error) {
        console.error("Error loading settings:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las configuraciones"
        })
      } else {
        setSettings(settings || [])
        
        // Populate form data
        const newFormData = { ...formData }
        settings?.forEach((setting) => {
          if (setting.key in newFormData) {
            newFormData[setting.key as keyof typeof newFormData] = 
              typeof setting.value === "string" ? setting.value.replace(/"/g, "") : setting.value
          }
        })
        setFormData(newFormData)
      }
      setIsLoading(false)
    }

    loadSettings()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Usuario no autenticado")

      // Prepare updates
      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_by: user.user.id
      }))

      // Update each setting
      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({
            ...update,
            category: getCategoryForKey(update.key),
            description: getDescriptionForKey(update.key)
          }, {
            onConflict: "key"
          })

        if (error) throw error
      }

      toast({
        variant: "success",
        title: "Configuración guardada",
        description: "Los cambios han sido guardados exitosamente"
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar las configuraciones"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getCategoryForKey = (key: string): string => {
    if (key.startsWith("company_")) return "contact"
    if (key.startsWith("site_")) return "seo"
    if (key.startsWith("social_")) return "social"
    return "general"
  }

  const getDescriptionForKey = (key: string): string => {
    const descriptions: Record<string, string> = {
      company_name: "Nombre de la empresa",
      company_phone: "Teléfono principal",
      company_email: "Email de contacto",
      company_address: "Dirección de la empresa",
      company_description: "Descripción breve",
      site_title: "Título del sitio web",
      site_description: "Descripción meta del sitio",
      site_keywords: "Palabras clave",
      social_facebook: "URL de Facebook",
      social_instagram: "URL de Instagram",
      social_twitter: "URL de Twitter",
      social_linkedin: "URL de LinkedIn",
      social_whatsapp: "Número de WhatsApp",
      featured_properties_limit: "Número de propiedades destacadas",
      currency: "Moneda principal",
      timezone: "Zona horaria"
    }
    return descriptions[key] || ""
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando configuraciones...</p>
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
                    <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
                    <p className="text-xs text-gray-500">Configuración del Sitio</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Configuración del Sitio</h2>
          <p className="text-gray-600">Gestiona la información y configuraciones generales del sitio web</p>
        </div>

        <Tabs defaultValue="contact" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          {/* Contact Settings */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Nombre de la Empresa</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange("company_name", e.target.value)}
                      placeholder="Formas Inmobiliaria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_phone" className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Teléfono
                    </Label>
                    <Input
                      id="company_phone"
                      value={formData.company_phone}
                      onChange={(e) => handleInputChange("company_phone", e.target.value)}
                      placeholder="+1 (809) 555-0123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_email" className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={formData.company_email}
                      onChange={(e) => handleInputChange("company_email", e.target.value)}
                      placeholder="info@formas.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_address" className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Dirección
                    </Label>
                    <Input
                      id="company_address"
                      value={formData.company_address}
                      onChange={(e) => handleInputChange("company_address", e.target.value)}
                      placeholder="Santiago, República Dominicana"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company_description">Descripción</Label>
                  <Textarea
                    id="company_description"
                    value={formData.company_description}
                    onChange={(e) => handleInputChange("company_description", e.target.value)}
                    placeholder="Tu socio de confianza en bienes raíces"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Configuración SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_title" className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Título del Sitio
                  </Label>
                  <Input
                    id="site_title"
                    value={formData.site_title}
                    onChange={(e) => handleInputChange("site_title", e.target.value)}
                    placeholder="Formas Inmobiliaria - Propiedades en Santiago"
                  />
                  <p className="text-sm text-gray-500 mt-1">Aparece en la pestaña del navegador y resultados de búsqueda</p>
                </div>
                <div>
                  <Label htmlFor="site_description">Descripción del Sitio</Label>
                  <Textarea
                    id="site_description"
                    value={formData.site_description}
                    onChange={(e) => handleInputChange("site_description", e.target.value)}
                    placeholder="Encuentra tu hogar ideal en Santiago. Venta y alquiler de casas, apartamentos y locales comerciales."
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">Descripción que aparece en los resultados de búsqueda</p>
                </div>
                <div>
                  <Label htmlFor="site_keywords" className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    Palabras Clave
                  </Label>
                  <Input
                    id="site_keywords"
                    value={formData.site_keywords}
                    onChange={(e) => handleInputChange("site_keywords", e.target.value)}
                    placeholder="inmobiliaria, propiedades, Santiago, República Dominicana"
                  />
                  <p className="text-sm text-gray-500 mt-1">Palabras clave separadas por comas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Settings */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Redes Sociales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="social_facebook" className="flex items-center gap-1">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Label>
                    <Input
                      id="social_facebook"
                      type="url"
                      value={formData.social_facebook}
                      onChange={(e) => handleInputChange("social_facebook", e.target.value)}
                      placeholder="https://facebook.com/formas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_instagram" className="flex items-center gap-1">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </Label>
                    <Input
                      id="social_instagram"
                      type="url"
                      value={formData.social_instagram}
                      onChange={(e) => handleInputChange("social_instagram", e.target.value)}
                      placeholder="https://instagram.com/formas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_twitter" className="flex items-center gap-1">
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </Label>
                    <Input
                      id="social_twitter"
                      type="url"
                      value={formData.social_twitter}
                      onChange={(e) => handleInputChange("social_twitter", e.target.value)}
                      placeholder="https://twitter.com/formas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_linkedin" className="flex items-center gap-1">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="social_linkedin"
                      type="url"
                      value={formData.social_linkedin}
                      onChange={(e) => handleInputChange("social_linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/formas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_whatsapp" className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Label>
                    <Input
                      id="social_whatsapp"
                      value={formData.social_whatsapp}
                      onChange={(e) => handleInputChange("social_whatsapp", e.target.value)}
                      placeholder="+1 (809) 555-0123"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="featured_properties_limit">Propiedades Destacadas</Label>
                    <Input
                      id="featured_properties_limit"
                      type="number"
                      min="1"
                      max="12"
                      value={formData.featured_properties_limit}
                      onChange={(e) => handleInputChange("featured_properties_limit", e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">Número a mostrar en la página principal</p>
                  </div>
                  <div>
                    <Label htmlFor="currency">Moneda</Label>
                    <Input
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      placeholder="DOP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Input
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => handleInputChange("timezone", e.target.value)}
                      placeholder="America/Santo_Domingo"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}