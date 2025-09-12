import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, property_id } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert inquiry into database
    const { data, error } = await supabase
      .from("property_inquiries")
      .insert({
        property_id: property_id || null,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        message: message.trim(),
        status: "nuevo"
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Error al procesar la consulta. Intenta nuevamente." },
        { status: 500 }
      )
    }

    // If inquiry is related to a specific property, create an interaction
    if (property_id && data) {
      await supabase
        .from("inquiry_interactions")
        .insert({
          inquiry_id: data.id,
          type: "note",
          description: `Consulta recibida desde el sitio web para la propiedad ${property_id}`,
          details: {
            source: "website",
            property_id: property_id,
            user_agent: request.headers.get("user-agent"),
            ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
          }
        })
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Consulta enviada exitosamente",
        inquiry_id: data.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}