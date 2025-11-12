import { cookies } from "next/headers"
import { adminAuth } from "./admin"
import { getAdminCollection, createAdminDocument, updateAdminDocument, deleteAdminDocument } from "./helpers"

export async function createServerClient() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  console.log("createServerClient: sessionCookie exists:", !!sessionCookie)
  console.log("createServerClient: adminAuth exists:", !!adminAuth)

  let user = null
  if (sessionCookie && adminAuth) {
    try {
      console.log("Verifying session cookie...")
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
      console.log("Session cookie verified successfully, uid:", decodedClaims.uid)
      user = {
        id: decodedClaims.uid,
        email: decodedClaims.email,
        ...decodedClaims,
      }
    } catch (error: any) {
      // Invalid session cookie
      console.error("Error verifying session cookie:", error?.message || error)
      console.error("Session cookie verification failed, error details:", error)
    }
  } else if (sessionCookie && !adminAuth) {
    console.warn("Session cookie found but Firebase Admin Auth is not initialized")
  } else if (!sessionCookie) {
    console.warn("No session cookie found")
  }

  // Create a Firebase client with Supabase-like interface for compatibility
  return {
    auth: {
      getUser: async () => ({
        data: { user },
        error: user ? null : { message: "Not authenticated" },
      }),
      signOut: async () => {
        // Clear session cookie
        const cookieStore = await cookies()
        cookieStore.delete("session")
        return { error: null }
      },
    },
    from: (table: string) => {
      return {
        select: (columns?: string, options?: { count?: "exact" }) => {
          const countMode = options?.count === "exact"
          
          // Create a thenable object that can be used directly or with filters
          const selectQuery = {
            // Make it thenable for direct await: await firebase.from("table").select()
            then: async (resolve: any, reject: any) => {
              try {
                const result = await getAdminCollection(
                  table,
                  [],
                  undefined,
                  "desc",
                  undefined
                )
                const resolved = countMode 
                  ? { data: result.data, count: result.count, error: result.error }
                  : { data: result.data, error: result.error }
                resolve(resolved)
                return resolved
              } catch (error) {
                reject(error)
                throw error
              }
            },
            // Support for filters: .eq().limit() or .eq().single() or .eq().order().limit()
            eq: (field: string, value: any) => {
              return {
                single: async () => {
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }],
                    undefined,
                    "desc",
                    1
                  )
                  if (result.data.length === 0) {
                    return { data: null, error: { message: "Document not found" } }
                  }
                  return { data: result.data[0], error: result.error }
                },
                order: (orderField: string, options?: { ascending?: boolean }) => {
                  return {
                    limit: async (num: number) => {
                      const result = await getAdminCollection(
                        table,
                        [{ field, operator: "==", value }],
                        orderField,
                        options?.ascending ? "asc" : "desc",
                        num
                      )
                      return countMode 
                        ? { data: result.data, count: result.count, error: result.error }
                        : { data: result.data, error: result.error }
                    },
                    range: async (start: number, end: number) => {
                      const limitCount = end - start + 1
                      const result = await getAdminCollection(
                        table,
                        [{ field, operator: "==", value }],
                        orderField,
                        options?.ascending ? "asc" : "desc",
                        limitCount
                      )
                      const slicedData = result.data.slice(start, end + 1)
                      return countMode 
                        ? { data: slicedData, count: result.count, error: result.error }
                        : { data: slicedData, error: result.error }
                    }
                  }
                },
                limit: async (num: number) => {
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }],
                    undefined,
                    "desc",
                    num
                  )
                  return countMode 
                    ? { data: result.data, count: result.count, error: result.error }
                    : { data: result.data, error: result.error }
                },
                range: async (start: number, end: number) => {
                  const limitCount = end - start + 1
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }],
                    undefined,
                    "desc",
                    limitCount
                  )
                  const slicedData = result.data.slice(start, end + 1)
                  return countMode 
                    ? { data: slicedData, count: result.count, error: result.error }
                    : { data: slicedData, error: result.error }
                }
              }
            },
            // Support for .order().limit() without filters
            order: (orderField: string, options?: { ascending?: boolean }) => {
              return {
                limit: async (num: number) => {
                  const result = await getAdminCollection(
                    table,
                    [],
                    orderField,
                    options?.ascending ? "asc" : "desc",
                    num
                  )
                  return countMode 
                    ? { data: result.data, count: result.count, error: result.error }
                    : { data: result.data, error: result.error }
                },
                range: async (start: number, end: number) => {
                  const limitCount = end - start + 1
                  const result = await getAdminCollection(
                    table,
                    [],
                    orderField,
                    options?.ascending ? "asc" : "desc",
                    limitCount
                  )
                  const slicedData = result.data.slice(start, end + 1)
                  return countMode 
                    ? { data: slicedData, count: result.count, error: result.error }
                    : { data: slicedData, error: result.error }
                }
              }
            },
            // Support for .limit() without filters
            limit: async (num: number) => {
              const result = await getAdminCollection(
                table,
                [],
                undefined,
                "desc",
                num
              )
              return countMode 
                ? { data: result.data, count: result.count, error: result.error }
                : { data: result.data, error: result.error }
            }
          }
          
          return selectQuery as any
        },
        insert: (data: any[] | any) => {
          return {
            select: () => ({
              single: async () => {
                const dataArray = Array.isArray(data) ? data : [data]
                const firstItem = dataArray[0]
                const result = await createAdminDocument(table, firstItem)
                return result
              }
            })
          }
        },
        update: (updates: any) => {
          return {
            eq: async (field: string, value: any) => {
              // In Firestore, we need the document ID to update
              // If field is "id", use value directly as document ID
              if (field === "id") {
                const result = await updateAdminDocument(table, value, updates)
                return result
              }
              // Otherwise, find the document first
              const result = await getAdminCollection(
                table,
                [{ field, operator: "==", value }],
                undefined,
                "desc",
                1
              )
              if (result.data.length === 0) {
                return { data: null, error: { message: "Document not found" } }
              }
              const docId = result.data[0].id
              return await updateAdminDocument(table, docId, updates)
            }
          }
        },
        remove: () => {
          return {
            eq: async (field: string, value: any) => {
              const result = await deleteAdminDocument(table, value)
              return result
            }
          }
        }
      }
    },
    getCurrentUser: () => user
  }
}