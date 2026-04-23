import { createServerClient } from "@/lib/firebase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/inquiries/[id] — Get inquiry detail + property + interactions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebase = await createServerClient()
    const { data: { user }, error: authError } = await firebase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Fetch inquiry
    const { data: inquiry, error } = await firebase
      .from("property_inquiries")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error || !inquiry) {
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      )
    }

    // Fetch property if linked
    let properties = undefined
    if (inquiry.property_id) {
      try {
        const { data: prop } = await firebase
          .from("properties")
          .select("*")
          .eq("id", inquiry.property_id)
          .single()

        if (prop) {
          properties = {
            title: prop.title,
            address: prop.address,
            price: prop.price,
            property_type: prop.property_type,
            operation_type: prop.operation_type,
          }
        }
      } catch {}
    }

    // Fetch interactions
    let interactions: any[] = []
    try {
      const { data: interactionsData } = await firebase
        .from("inquiry_interactions")
        .select("*")
        .eq("inquiry_id", params.id)
        .order("created_at", { ascending: false })
        .limit(100)

      interactions = interactionsData || []
    } catch {}

    return NextResponse.json({
      data: {
        ...inquiry,
        properties,
      },
      interactions,
    })
  } catch (error: any) {
    console.error("Error in GET /api/admin/inquiries/[id]:", error)
    return NextResponse.json(
      { error: error?.message || "Error interno" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/inquiries/[id] — Update status, response, etc.
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebase = await createServerClient()
    const { data: { user }, error: authError } = await firebase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { status, response, responded_at, responded_by } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (response !== undefined) updateData.response = response
    if (responded_at) updateData.responded_at = responded_at
    if (responded_by) updateData.responded_by = responded_by

    const { error } = await firebase
      .from("property_inquiries")
      .update(updateData)
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Error al actualizar" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in PUT /api/admin/inquiries/[id]:", error)
    return NextResponse.json(
      { error: error?.message || "Error interno" },
      { status: 500 }
    )
  }
}

// POST /api/admin/inquiries/[id] — Add interaction/note
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebase = await createServerClient()
    const { data: { user }, error: authError } = await firebase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { type, description, details } = body

    if (!type || !description) {
      return NextResponse.json(
        { error: "type y description son requeridos" },
        { status: 400 }
      )
    }

    const { data, error } = await firebase
      .from("inquiry_interactions")
      .insert({
        inquiry_id: params.id,
        type,
        description,
        details: details || {},
        created_by: user.id || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message || "Error al agregar interacción" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/admin/inquiries/[id]:", error)
    return NextResponse.json(
      { error: error?.message || "Error interno" },
      { status: 500 }
    )
  }
}
