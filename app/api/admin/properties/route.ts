import { createServerClient } from "@/lib/firebase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/properties — List all properties (no status filter, for admin panel)
export async function GET(request: NextRequest) {
  try {
    const firebase = await createServerClient()
    const { data: { user }, error: authError } = await firebase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { data: properties, error } = await firebase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Error al cargar propiedades" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: properties || [] })
  } catch (error: any) {
    console.error("Error in GET /api/admin/properties:", error)
    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: 500 }
    )
  }
}
