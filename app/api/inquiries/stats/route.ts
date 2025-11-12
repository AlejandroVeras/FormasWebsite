import { createServerClient } from "@/lib/firebase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const firebase = await createServerClient()

  try {
    // Verificar autenticación
    const { data: { user }, error: authError } = await firebase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener consultas
    const { data: inquiries = [] } = await firebase.from("property_inquiries").select("status")

    // Calcular estadísticas
    const total = inquiries.length
    const newCount = inquiries.filter((i: any) => i.status === "nuevo").length
    const pending = inquiries.filter((i: any) => i.status === "en_proceso").length

    return NextResponse.json({ 
      total,
      new: newCount,
      pending
    })
  } catch (error) {
    console.error("Error al obtener estadísticas de consultas:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}