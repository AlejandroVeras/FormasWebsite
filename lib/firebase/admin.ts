import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    // Check if we're in a server environment
    if (typeof window === 'undefined') {
      const projectId = process.env.FIREBASE_PROJECT_ID
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET

      if (projectId && clientEmail && privateKey && storageBucket) {
        // Decode and format private key if it's base64 encoded
        let formattedPrivateKey = privateKey
        if (!privateKey.includes('BEGIN PRIVATE KEY')) {
          try {
            formattedPrivateKey = Buffer.from(privateKey, 'base64')
              .toString('utf-8')
              .replace(/\\n/g, '\n')
          } catch (e) {
            // If it's not base64, use as is
            formattedPrivateKey = privateKey.replace(/\\n/g, '\n')
          }
        }

        const credential = cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        })

        initializeApp({
          credential,
          storageBucket,
        })

        console.log('Firebase Admin initialized successfully')
      } else {
        console.warn('Firebase Admin environment variables not set. Some features may not work.')
        console.warn('Missing:', {
          projectId: !projectId,
          clientEmail: !clientEmail,
          privateKey: !privateKey,
          storageBucket: !storageBucket
        })
      }
    } else {
      console.warn('Firebase Admin should only be used on the server')
    }
  } catch (error: any) {
    console.error('Failed to initialize Firebase Admin:', error?.message || error)
    // Don't throw - allow the app to continue but log the error
    // This prevents the entire app from crashing if Firebase Admin fails to initialize
  }
}

// Safely export admin services, handling initialization failures
let adminDb: any = null
let adminAuth: any = null
let adminStorage: any = null

try {
  if (getApps().length > 0) {
    adminDb = getFirestore()
    adminAuth = getAuth()
    adminStorage = getStorage()
  }
} catch (error: any) {
  console.error('Failed to get Firebase Admin services:', error?.message || error)
  // Services will be null, but the app can continue
}

export { adminDb, adminAuth, adminStorage }
export default getApps()[0] || null

