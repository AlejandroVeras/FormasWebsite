import { jwtVerify, createRemoteJWKSet } from 'jose'

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID

const JWKS = createRemoteJWKSet(
  new URL(`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`)
)

export async function verifySessionCookie(sessionCookie: string) {
  try {
    const decoded = await jwtVerify(sessionCookie, JWKS, {
      issuer: `https://session.firebase.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    })
    
    return {
      valid: true,
      decodedClaims: decoded.payload,
    }
  } catch (error) {
    console.error('Failed to verify session cookie:', error)
    return {
      valid: false,
      decodedClaims: null,
    }
  }
}