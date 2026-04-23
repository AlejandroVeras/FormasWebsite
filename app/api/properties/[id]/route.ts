import { createServerClient } from "@/lib/firebase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebase = await createServerClient()
    const { data: property, error } = await firebase
      .from("properties")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error || !property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: property })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error al obtener la propiedad" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebase = await createServerClient()
    const { data: { user }, error: authError } = await firebase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Por favor, inicia sesión." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      property_type,
      bedrooms,
      bathrooms,
      area_m2,
      address,
      city,
      operation_type,
      status,
      features,
      images,
    } = body

    if (!title || !price || !property_type || !address || !operation_type) {
      return NextResponse.json(
        { error: "Los campos título, precio, tipo de propiedad, dirección y tipo de operación son requeridos" },
        { status: 400 }
      )
    }

    const propertyData = {
      title: title.trim(),
      description: description?.trim() || null,
      price: typeof price === "number" ? price : Number.parseFloat(price),
      property_type,
      bedrooms: bedrooms ? (typeof bedrooms === "number" ? bedrooms : Number.parseInt(bedrooms)) : null,
      bathrooms: bathrooms ? (typeof bathrooms === "number" ? bathrooms : Number.parseInt(bathrooms)) : null,
      area_m2: area_m2 ? (typeof area_m2 === "number" ? area_m2 : Number.parseFloat(area_m2)) : null,
      address: address.trim(),
      city: city?.trim() || "Santiago",
      country: "República Dominicana",
      operation_type,
      status: status || "disponible",
      features: features || [],
      images: images || [],
    }

    const { data, error } = await firebase
      .from("properties")
      .update(propertyData)
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Error al actualizar la propiedad" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data, message: "Propiedad actualizada exitosamente" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error in PUT /api/properties/[id]:", error)
    return NextResponse.json(
      { error: error?.message || "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebase = await createServerClient()
    const { data: { user }, error: authError } = await firebase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Por favor, inicia sesión." },
        { status: 401 }
      )
    }

    const { error } = await firebase
      .from("properties")
      .delete()
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Error al eliminar la propiedad" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Propiedad eliminada exitosamente" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error in DELETE /api/properties/[id]:", error)
    return NextResponse.json(
      { error: error?.message || "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
