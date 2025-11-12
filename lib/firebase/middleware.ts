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
    // Let the request pass - the server will verify it
    return response
  }

  try {
    console.log("Middleware: Verifying session cookie...")
    const { valid, decodedClaims } = await verifySessionCookie(sessionCookie)
    
    console.log("Middleware: Session cookie verification result:", valid)
    
    if (!valid) {
      console.log("Middleware: Session cookie is invalid, redirecting to login")
      // Delete the invalid cookie
      response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("session")
      return response
    }
    
    console.log("Middleware: Session cookie is valid, allowing access")
    console.log("Middleware: User ID:", decodedClaims?.uid)
    return response
  } catch (error: any) {
    // Error verifying session cookie, redirect to login
    console.error("Middleware: Error verifying session:", error?.message || error)
    console.error("Middleware: Error stack:", error?.stack)
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    response = NextResponse.redirect(url)
    response.cookies.delete("session")
    return response
  }
}


