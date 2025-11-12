import { NextResponse, type NextRequest } from "next/server"
import { verifySessionCookie } from "./edge-auth"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return response
  }

  // Skip auth check for login and register pages
  if (
    request.nextUrl.pathname.startsWith("/admin/login") ||
    request.nextUrl.pathname.startsWith("/admin/register") ||
    request.nextUrl.pathname.startsWith("/admin/register-success")
  ) {
    return response
  }

  const sessionCookie = request.cookies.get("session")?.value

  console.log("Middleware: Checking session for path:", request.nextUrl.pathname)
  console.log("Middleware: Session cookie exists:", !!sessionCookie)
  console.log("Middleware: FIREBASE_PROJECT_ID available:", !!process.env.FIREBASE_PROJECT_ID)

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    console.log("Middleware: No session cookie found, redirecting to login")
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // If FIREBASE_PROJECT_ID is not available in Edge Runtime, 
  // let the request through and let the server verify it
  // This can happen if env vars aren't available in Edge Runtime
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn("Middleware: FIREBASE_PROJECT_ID not available in Edge Runtime, allowing request to pass to server")
    console.warn("Middleware: Available env vars:", Object.keys(process.env).filter(k => k.includes('FIREBASE')))
    // Let the request pass - the server will verify it using Firebase Admin SDK
    return response
  }

  // Try to verify the session cookie in the middleware
  try {
    console.log("Middleware: Verifying session cookie with project ID:", process.env.FIREBASE_PROJECT_ID)
    const { valid, decodedClaims } = await verifySessionCookie(sessionCookie)
    
    console.log("Middleware: Session cookie verification result:", valid)
    
    if (!valid) {
      console.log("Middleware: Session cookie is invalid according to middleware verification")
      console.log("Middleware: Allowing request to pass to server for verification (server may have different env vars)")
      // Instead of redirecting immediately, let the server verify it
      // The server uses Firebase Admin SDK which may work even if Edge Runtime verification fails
      return response
    }
    
    console.log("Middleware: Session cookie is valid, allowing access")
    console.log("Middleware: User ID:", decodedClaims?.uid)
    return response
  } catch (error: any) {
    // Error verifying session cookie in middleware
    // Don't redirect immediately - let the server verify it instead
    console.warn("Middleware: Error verifying session in middleware:", error?.message || error)
    console.warn("Middleware: Allowing request to pass to server for verification")
    // Let the request pass to the server - it will verify and redirect if needed
    return response
  }
}


