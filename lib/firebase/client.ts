import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword, User } from "firebase/auth"
import { auth, db, storage } from "./config"
import { collection, query, where, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, orderBy, limit, Timestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export function createClient() {
  return {
    auth: {
      getUser: async () => {
        const user = auth.currentUser || await getCurrentUser()
        return {
          data: { user },
          error: user ? null : { message: "Not authenticated" },
        }
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        try {
          console.log("signInWithPassword: Starting authentication...")
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          console.log("signInWithPassword: Firebase Auth successful, getting ID token...")
          
          // Create session cookie (handled by API route)
          const idToken = await userCredential.user.getIdToken()
          console.log("signInWithPassword: Got ID token, creating session cookie...")
          
          const response = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
            credentials: "include", // Important: include credentials to ensure cookie is set
          })
          
          console.log("signInWithPassword: Session API response status:", response.status)
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Failed to create session" }))
            console.error("signInWithPassword: Session API error:", errorData)
            throw new Error(errorData.error || `Failed to create session: ${response.status}`)
          }
          
          const responseData = await response.json()
          console.log("signInWithPassword: Session cookie created successfully:", responseData)
          
          // Verify that the response indicates success
          if (!responseData.success) {
            throw new Error("Failed to create session: Unexpected response")
          }
          
          console.log("signInWithPassword: Authentication complete")
          return { data: { user: userCredential.user }, error: null }
        } catch (error: any) {
          console.error("Sign in error:", error)
          return { data: { user: null }, error: { message: error.message || "Error al iniciar sesión" } }
        }
      },
      signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          // Create session cookie
          const idToken = await userCredential.user.getIdToken()
          const response = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          })
          if (!response.ok) throw new Error("Failed to create session")
          
          return { data: { user: userCredential.user }, error: null }
        } catch (error: any) {
          return { data: { user: null }, error: { message: error.message } }
        }
      },
      signOut: async () => {
        await firebaseSignOut(auth)
        await fetch("/api/auth/session", { method: "DELETE" })
        return { error: null }
      },
    },
    from: (table: string) => ({
      select: (columns?: string, options?: { count?: "exact" }) => {
        const countMode = options?.count === "exact"
        return {
          eq: (field: string, value: any) => ({
            eq: (field2: string, value2: any) => ({
              order: (fieldOrder: string, options?: { ascending?: boolean }) => ({
                limit: async (num: number) => {
                  const q = query(
                    collection(db, table),
                    where(field, "==", value),
                    where(field2, "==", value2),
                    orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                    limit(num)
                  )
                  const snapshot = await getDocs(q)
                  const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                  }))
                  return countMode ? { data, count: snapshot.size, error: null } : { data, error: null }
                },
                single: async () => {
                  const q = query(
                    collection(db, table),
                    where(field, "==", value),
                    where(field2, "==", value2),
                    orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                    limit(1)
                  )
                  const snapshot = await getDocs(q)
                  if (snapshot.empty) return { data: null, error: { message: "Document not found" } }
                  const doc = snapshot.docs[0]
                  const data = {
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                  }
                  return { data, error: null }
                },
              }),
              order: (fieldOrder: string, options?: { ascending?: boolean }) => ({
                limit: async (num: number) => {
                  const q = query(
                    collection(db, table),
                    where(field, "==", value),
                    orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                    limit(num)
                  )
                  const snapshot = await getDocs(q)
                  const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                  }))
                  return countMode ? { data, count: snapshot.size, error: null } : { data, error: null }
                },
                single: async () => {
                  const q = query(
                    collection(db, table),
                    where(field, "==", value),
                    orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                    limit(1)
                  )
                  const snapshot = await getDocs(q)
                  if (snapshot.empty) return { data: null, error: { message: "Document not found" } }
                  const doc = snapshot.docs[0]
                  const data = {
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                  }
                  return { data, error: null }
                },
              }),
              limit: async (num: number) => {
                const q = query(
                  collection(db, table),
                  where(field, "==", value),
                  orderBy("created_at", "desc"),
                  limit(num)
                )
                const snapshot = await getDocs(q)
                const data = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                  updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                }))
                return countMode ? { data, count: snapshot.size, error: null } : { data, error: null }
              },
              single: async () => {
                const q = query(
                  collection(db, table),
                  where(field, "==", value),
                  limit(1)
                )
                const snapshot = await getDocs(q)
                if (snapshot.empty) return { data: null, error: { message: "Document not found" } }
                const doc = snapshot.docs[0]
                const data = {
                  id: doc.id,
                  ...doc.data(),
                  created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                  updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                }
                return { data, error: null }
              },
            }),
            order: (fieldOrder: string, options?: { ascending?: boolean }) => ({
              limit: async (num: number) => {
                const q = query(
                  collection(db, table),
                  where(field, "==", value),
                  orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                  limit(num)
                )
                const snapshot = await getDocs(q)
                const data = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                  updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                }))
                return countMode ? { data, count: snapshot.size, error: null } : { data, error: null }
              },
              range: async (start: number, end: number) => {
                const limitCount = end - start + 1
                const q = query(
                  collection(db, table),
                  where(field, "==", value),
                  orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                  limit(limitCount)
                )
                const snapshot = await getDocs(q)
                const data = snapshot.docs.slice(start, end + 1).map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                  updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                }))
                return { data, count: snapshot.size, error: null }
              },
              single: async () => {
                const q = query(
                  collection(db, table),
                  where(field, "==", value),
                  orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                  limit(1)
                )
                const snapshot = await getDocs(q)
                if (snapshot.empty) return { data: null, error: { message: "Document not found" } }
                const doc = snapshot.docs[0]
                const data = {
                  id: doc.id,
                  ...doc.data(),
                  created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                  updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
                }
                return { data, error: null }
              },
            }),
            limit: async (num: number) => {
              const q = query(
                collection(db, table),
                where(field, "==", value),
                orderBy("created_at", "desc"),
                limit(num)
              )
              const snapshot = await getDocs(q)
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
              }))
              return countMode ? { data, count: snapshot.size, error: null } : { data, error: null }
            },
            single: async () => {
              const q = query(
                collection(db, table),
                where(field, "==", value),
                limit(1)
              )
              const snapshot = await getDocs(q)
              if (snapshot.empty) return { data: null, error: { message: "Document not found" } }
              const doc = snapshot.docs[0]
              const data = {
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
              }
              return { data, error: null }
            },
          }),
          order: (fieldOrder: string, options?: { ascending?: boolean }) => ({
            limit: async (num: number) => {
              const q = query(
                collection(db, table),
                orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                limit(num)
              )
              const snapshot = await getDocs(q)
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
              }))
              return countMode ? { data, count: snapshot.size, error: null } : { data, error: null }
            },
            range: async (start: number, end: number) => {
              const limitCount = end - start + 1
              const q = query(
                collection(db, table),
                orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                limit(limitCount)
              )
              const snapshot = await getDocs(q)
              const data = snapshot.docs.slice(start, end + 1).map((doc) => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
              }))
              return { data, count: snapshot.size, error: null }
            },
            single: async () => {
              const q = query(
                collection(db, table),
                orderBy(fieldOrder, options?.ascending ? "asc" : "desc"),
                limit(1)
              )
              const snapshot = await getDocs(q)
              if (snapshot.empty) return { data: null, error: { message: "Document not found" } }
              const doc = snapshot.docs[0]
              const data = {
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
                updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
              }
              return { data, error: null }
            },
          }),
          limit: async (num: number) => {
            const q = query(
              collection(db, table),
              orderBy("created_at", "desc"),
              limit(num)
            )
            const snapshot = await getDocs(q)
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
              updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
            }))
            return countMode ? { data, count: snapshot.size, error: null } : { data, error: null }
          },
        }
      },
      insert: (data: any[] | any) => ({
        select: () => ({
          single: async () => {
            const dataArray = Array.isArray(data) ? data : [data]
            const firstItem = dataArray[0]
            const now = Timestamp.now()
            const docRef = await addDoc(collection(db, table), {
              ...firstItem,
              created_at: now,
              updated_at: now,
            })
            const docSnap = await getDoc(docRef)
            const result = {
              id: docSnap.id,
              ...docSnap.data(),
              created_at: docSnap.data()?.created_at?.toDate?.()?.toISOString() || docSnap.data()?.created_at,
              updated_at: docSnap.data()?.updated_at?.toDate?.()?.toISOString() || docSnap.data()?.updated_at,
            }
            return { data: result, error: null }
          },
        }),
      }),
      update: (updates: any) => ({
        eq: async (field: string, value: any) => {
          if (field === "id") {
            const docRef = doc(db, table, value)
            await updateDoc(docRef, {
              ...updates,
              updated_at: Timestamp.now(),
            })
            const updatedDoc = await getDoc(docRef)
            const result = {
              id: updatedDoc.id,
              ...updatedDoc.data(),
              created_at: updatedDoc.data()?.created_at?.toDate?.()?.toISOString() || updatedDoc.data()?.created_at,
              updated_at: updatedDoc.data()?.updated_at?.toDate?.()?.toISOString() || updatedDoc.data()?.updated_at,
            }
            return { data: result, error: null }
          }
          // Find by field
          const q = query(collection(db, table), where(field, "==", value), limit(1))
          const snapshot = await getDocs(q)
          if (snapshot.empty) return { data: null, error: { message: "Document not found" } }
          const docRef = doc(db, table, snapshot.docs[0].id)
          await updateDoc(docRef, {
            ...updates,
            updated_at: Timestamp.now(),
          })
          const updatedDoc = await getDoc(docRef)
          const result = {
            id: updatedDoc.id,
            ...updatedDoc.data(),
            created_at: updatedDoc.data()?.created_at?.toDate?.()?.toISOString() || updatedDoc.data()?.created_at,
            updated_at: updatedDoc.data()?.updated_at?.toDate?.()?.toISOString() || updatedDoc.data()?.updated_at,
          }
          return { data: result, error: null }
        },
      }),
      delete: () => ({
        eq: async (field: string, value: any) => {
          if (field === "id") {
            await deleteDoc(doc(db, table, value))
            return { error: null }
          }
          const q = query(collection(db, table), where(field, "==", value), limit(1))
          const snapshot = await getDocs(q)
          if (snapshot.empty) return { error: { message: "Document not found" } }
          await deleteDoc(doc(db, table, snapshot.docs[0].id))
          return { error: null }
        },
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (fileName: string, file: File | Blob) => {
          try {
            const storageRef = ref(storage, `${bucket}/${fileName}`)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            return { data: { path: url }, error: null }
          } catch (error: any) {
            return { data: null, error: { message: error.message } }
          }
        },
      }),
    },
  }
}
