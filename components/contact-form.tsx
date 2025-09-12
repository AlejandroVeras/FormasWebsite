"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Phone, Mail, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ContactFormProps {
  propertyId?: string
  propertyTitle?: string
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: propertyTitle 
      ? `Estoy interesado en la propiedad "${propertyTitle}". Me gustaría obtener más información.`
      : "Me gustaría obtener más información sobre las propiedades disponibles."
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          property_id: propertyId || null,
        }),
      })

      if (response.ok) {
        toast.success("¡Consulta enviada exitosamente!", {
          description: "Te contactaremos en menos de 24 horas."
        })
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: propertyTitle 
            ? `Estoy interesado en la propiedad "${propertyTitle}". Me gustaría obtener más información.`
            : "Me gustaría obtener más información sobre las propiedades disponibles."
        })
      } else {
        throw new Error("Error al enviar la consulta")
      }
    } catch (error) {
      toast.error("Error al enviar la consulta", {
        description: "Por favor, intenta nuevamente o contactanos directamente."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {propertyId ? "¿Interesado en esta propiedad?" : "¿Buscas una propiedad?"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium mb-2 block">
              Nombre completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium mb-2 block">
              Teléfono *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Tu teléfono"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium mb-2 block">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium mb-2 block">
              Mensaje *
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full px-3 py-2 border border-input rounded-md bg-background h-24 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Cuéntanos qué necesitas..."
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar Consulta
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Respuesta en menos de 24 horas
          </p>
        </div>
      </CardContent>
    </Card>
  )
}