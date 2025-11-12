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

    // Obtener propiedades
    const { data: properties = [] } = await firebase.from("properties").select("status")

    // Calcular estadísticas
    const total = properties.length
    const available = properties.filter((p: any) => p.status === "disponible").length
    const sold = properties.filter((p: any) => p.status === "vendido").length

    return NextResponse.json({ total, available, sold })
  } catch (error) {
    console.error("Error al obtener estadísticas de propiedades:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}