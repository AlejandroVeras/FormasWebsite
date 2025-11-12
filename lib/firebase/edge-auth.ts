import { jwtVerify, createRemoteJWKSet } from 'jose'

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID

const JWKS = createRemoteJWKSet(
  new URL(`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`)
)

export async function verifySessionCookie(sessionCookie: string) {
  try {
    if (!FIREBASE_PROJECT_ID) {
      console.error('FIREBASE_PROJECT_ID is not defined. Cannot verify session cookie.')
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('FIREBASE')))
      return {
        valid: false,
        decodedClaims: null,
      }
    }

    console.log('Verifying session cookie with project ID:', FIREBASE_PROJECT_ID)
    console.log('Session cookie length:', sessionCookie?.length || 0)
    
    const decoded = await jwtVerify(sessionCookie, JWKS, {
      issuer: `https://session.firebase.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    })
    
    console.log('Session cookie verified successfully')
    console.log('Decoded claims:', { uid: decoded.payload.uid, email: decoded.payload.email })
    
    return {
      valid: true,
      decodedClaims: decoded.payload,
    }
  } catch (error: any) {
    console.error('Failed to verify session cookie:', error?.message || error)
    console.error('Error code:', error?.code)
    console.error('Error name:', error?.name)
    if (error?.code === 'ERR_JWT_INVALID') {
      console.error('JWT is invalid - possible causes: expired, malformed, or wrong issuer/audience')
    }
    return {
      valid: false,
      decodedClaims: null,
    }
  }
}