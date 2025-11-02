import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin
function getRequiredEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

if (!getApps().length) {
  try {
    const projectId = getRequiredEnvVar('FIREBASE_PROJECT_ID')
    const clientEmail = getRequiredEnvVar('FIREBASE_CLIENT_EMAIL')
    const privateKeyBase64 = getRequiredEnvVar('FIREBASE_PRIVATE_KEY')
    const storageBucket = getRequiredEnvVar('FIREBASE_STORAGE_BUCKET')

    // Decode and format private key
    const privateKey = Buffer.from(privateKeyBase64, 'base64')
      .toString('utf-8')
      .replace(/\\n/g, '\n')

    const credential = cert({
      projectId,
      clientEmail,
      privateKey,
    })

    initializeApp({
      credential,
      storageBucket,
    })

    console.log('Firebase Admin initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    throw error
  }
}

export const adminDb = getFirestore()
export const adminAuth = getAuth()
export const adminStorage = getStorage()

export default getApps()[0]

