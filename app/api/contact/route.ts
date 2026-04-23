import { createServerClient } from "@/lib/firebase/server"
import { NextRequest, NextResponse } from "next/server"

// Send WhatsApp notification via CallMeBot
async function sendWhatsAppNotification(data: {
  name: string
  phone: string
  email: string
  message: string
  propertyTitle?: string
}) {
  const whatsappNumber = process.env.CALLMEBOT_PHONE_NUMBER
  const apiKey = process.env.CALLMEBOT_API_KEY

  if (!whatsappNumber || !apiKey) {
    console.log("WhatsApp notification skipped: CALLMEBOT_PHONE_NUMBER or CALLMEBOT_API_KEY not configured")
    return
  }

  try {
    const propertyLine = data.propertyTitle
      ? `🏠 *Propiedad:* ${data.propertyTitle}`
      : "🏠 *Consulta general*"

    const text = [
      "📩 *Nueva Consulta Web - Inmobiliaria Formas*",
      "━━━━━━━━━━━━━━━━━━━",
      `👤 *Nombre:* ${data.name}`,
      `📱 *Teléfono:* ${data.phone}`,
      `📧 *Email:* ${data.email}`,
      propertyLine,
      "━━━━━━━━━━━━━━━━━━━",
      `💬 *Mensaje:*`,
      data.message,
      "━━━━━━━━━━━━━━━━━━━",
      `⏰ ${new Date().toLocaleString("es-DO", { timeZone: "America/Santo_Domingo" })}`,
    ].join("\n")

    const encodedText = encodeURIComponent(text)
    const url = `https://api.callmebot.com/whatsapp.php?phone=${whatsappNumber}&text=${encodedText}&apikey=${apiKey}`

    const response = await fetch(url, { method: "GET" })
    
    if (response.ok) {
      console.log("✅ WhatsApp notification sent successfully")
    } else {
      console.error("❌ WhatsApp notification failed:", response.status, await response.text())
    }
  } catch (error) {
    console.error("❌ WhatsApp notification error:", error)
    // Don't throw — notification failure shouldn't block the inquiry
  }
}

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

    const firebase = await createServerClient()

    // Check if Firebase is properly configured
    const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    if (!firebaseProjectId) {
      // Log the inquiry locally when Firebase is not configured
      console.log("=== CONTACT FORM SUBMISSION (Demo Mode) ===")
      console.log("Name:", name)
      console.log("Email:", email)
      console.log("Phone:", phone)
      console.log("Message:", message)
      console.log("Property ID:", property_id || "General inquiry")
      console.log("================================")

      return NextResponse.json(
        { 
          success: true, 
          message: "Consulta registrada (modo demo)",
          inquiry_id: "demo-" + Date.now()
        },
        { status: 201 }
      )
    }

    // Insert inquiry into database
    const { data, error } = await firebase
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

    // Get property title for WhatsApp notification
    let propertyTitle: string | undefined
    if (property_id) {
      try {
        const { data: prop } = await firebase
          .from("properties")
          .select("*")
          .eq("id", property_id)
          .single()
        
        if (prop) {
          propertyTitle = prop.title
        }
      } catch {}
    }

    // Send WhatsApp notification (non-blocking)
    sendWhatsAppNotification({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      propertyTitle,
    })

    // If inquiry is related to a specific property, create an interaction
    if (property_id && data) {
      try {
        await firebase
          .from("inquiry_interactions")
          .insert({
            inquiry_id: data.id,
            type: "note",
            description: `Consulta recibida desde el sitio web${propertyTitle ? ` para "${propertyTitle}"` : ""}`,
            details: {
              source: "website",
              property_id: property_id,
              user_agent: request.headers.get("user-agent"),
            }
          })
      } catch (interactionError) {
        console.error("Error creating interaction:", interactionError)
        // Non-blocking
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Consulta enviada exitosamente",
        inquiry_id: data?.id 
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