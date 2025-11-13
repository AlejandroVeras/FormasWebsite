import { createServerClient } from "@/lib/firebase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication using session cookie
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

    // Validate required fields
    if (!title || !price || !property_type || !address || !operation_type) {
      return NextResponse.json(
        { error: "Los campos título, precio, tipo de propiedad, dirección y tipo de operación son requeridos" },
        { status: 400 }
      )
    }

    // Create property data
    const propertyData = {
      title: title.trim(),
      description: description?.trim() || null,
      price: Number.parseFloat(price),
      property_type,
      bedrooms: bedrooms ? Number.parseInt(bedrooms) : null,
      bathrooms: bathrooms ? Number.parseInt(bathrooms) : null,
      area_m2: area_m2 ? Number.parseFloat(area_m2) : null,
      address: address.trim(),
      city: city?.trim() || "Santiago",
      country: "República Dominicana",
      operation_type,
      status: status || "disponible",
      features: features || [],
      images: images || [],
      created_by: user.id,
    }

    console.log("Creating property with data:", propertyData)
    console.log("Created by user:", user.id)

    // Insert property into Firestore
    const { data, error } = await firebase
      .from("properties")
      .insert([propertyData])
      .select()
      .single()

    if (error) {
      console.error("Error creating property:", error)
      return NextResponse.json(
        { error: error.message || "Error al crear la propiedad" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data, message: "Propiedad creada exitosamente" },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error in POST /api/properties:", error)
    return NextResponse.json(
      { error: error?.message || "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

