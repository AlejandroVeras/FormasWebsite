import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
    console.log("Session API: Creating session cookie...")
    
    if (!adminAuth) {
      console.error("Firebase Admin Auth is not initialized")
      return NextResponse.json(
        { error: "Authentication service is not available" },
        { status: 500 }
      )
    }

    const { idToken } = await request.json()
    
    if (!idToken) {
      console.error("Session API: No ID token provided")
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      )
    }
    
    console.log("Session API: Creating session cookie with idToken...")
    
    // Verify ID token and create session cookie
    // expiresIn is in seconds (5 days = 432000 seconds)
    const expiresIn = 60 * 60 * 24 * 5 // 5 days in seconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    
    console.log("Session API: Session cookie created successfully")
    
    // In Vercel, always use secure cookies for HTTPS
    // Check if we're in a production environment or if the request is HTTPS
    const url = request.nextUrl
    const isHttps = url.protocol === "https:" || url.hostname.includes("vercel.app") || url.hostname.includes("vercel.com")
    const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"
    const useSecureCookie = isHttps || isProduction
    
    console.log("Session API: Cookie settings - isHttps:", isHttps, "isProduction:", isProduction, "useSecure:", useSecureCookie)
    console.log("Session API: URL protocol:", url.protocol, "hostname:", url.hostname)
    
    const response = NextResponse.json({ success: true })
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn, // Already in seconds
      httpOnly: true,
      secure: useSecureCookie, // Always secure in production/HTTPS
      sameSite: "lax",
      path: "/",
      // Don't set domain to allow subdomains to work
    })
    
    console.log("Session API: Cookie set successfully with secure:", useSecureCookie)
    
    return response
  } catch (error: any) {
    console.error("Error creating session cookie:", error)
    console.error("Error details:", error?.message, error?.stack)
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


