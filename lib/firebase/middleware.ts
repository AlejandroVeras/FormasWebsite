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
    request.nextUrl.pathname.startsWith("/admin/register")
  ) {
    return response
  }

  const sessionCookie = request.cookies.get("session")?.value

  if (!sessionCookie) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  try {
    const { valid, decodedClaims } = await verifySessionCookie(sessionCookie)
    
    if (!valid) {
      throw new Error('Invalid session')
    }
    return response
  } catch (error) {
    // Invalid session cookie, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    response = NextResponse.redirect(url)
    response.cookies.delete("session")
    return response
  }
}


