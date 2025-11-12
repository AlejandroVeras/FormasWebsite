import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
    if (!adminAuth) {
      console.error("Firebase Admin Auth is not initialized")
      return NextResponse.json(
        { error: "Authentication service is not available" },
        { status: 500 }
      )
    }

    const { idToken } = await request.json()
    
    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      )
    }
    
    // Verify ID token and create session cookie
    // expiresIn is in seconds (5 days = 432000 seconds)
    const expiresIn = 60 * 60 * 24 * 5 // 5 days in seconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    
    const response = NextResponse.json({ success: true })
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn, // Already in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    
    return response
  } catch (error: any) {
    console.error("Error creating session cookie:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create session" },
      { status: 401 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("session")
  return response
}


