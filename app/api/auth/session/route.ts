import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    
    // Verify ID token and create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    
    const response = NextResponse.json({ success: true })
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("session")
  return response
}


