import { createServerClient } from "@/lib/firebase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/inquiries — List all inquiries with property data
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

    // Fetch all inquiries
    const { data: inquiries, error } = await firebase
      .from("property_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Error al cargar consultas" },
        { status: 500 }
      )
    }

    // Enrich with property data
    const enrichedInquiries = await Promise.all(
      (inquiries || []).map(async (inq: any) => {
        if (!inq?.property_id) return inq

        try {
          const { data: prop } = await firebase
            .from("properties")
            .select("*")
            .eq("id", inq.property_id)
            .single()

          return {
            ...inq,
            properties: prop
              ? {
                  title: prop.title,
                  address: prop.address,
                  price: prop.price,
                  property_type: prop.property_type,
                  operation_type: prop.operation_type,
                }
              : undefined,
          }
        } catch {
          return inq
        }
      })
    )

    return NextResponse.json({ data: enrichedInquiries })
  } catch (error: any) {
    console.error("Error in GET /api/admin/inquiries:", error)
    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: 500 }
    )
  }
}
