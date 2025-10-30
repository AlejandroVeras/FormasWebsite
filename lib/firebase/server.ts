import { cookies } from "next/headers"
import { adminAuth, adminDb } from "./admin"
import { getAdminCollection, getAdminDocument, createAdminDocument, updateAdminDocument, deleteAdminDocument } from "./helpers"

export async function createServerClient() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  let user = null
  if (sessionCookie) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
      user = {
        id: decodedClaims.uid,
        email: decodedClaims.email,
        ...decodedClaims,
      }
    } catch (error) {
      // Invalid session cookie
      console.error("Error verifying session cookie:", error)
    }
  }

  // Create a Supabase-like interface
  return {
    auth: {
      getUser: async () => ({
        data: { user },
        error: user ? null : { message: "Not authenticated" },
      }),
      signOut: async () => {
        // Clear session cookie in middleware
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
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }, { field: field2, operator: "==", value2 }],
                    fieldOrder,
                    options?.ascending ? "asc" : "desc",
                    num
                  )
                  return countMode ? { data: result.data, count: result.count, error: result.error } : { data: result.data, error: result.error }
                },
                range: async (start: number, end: number) => {
                  const limitCount = end - start + 1
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }, { field: field2, operator: "==", value2 }],
                    fieldOrder,
                    options?.ascending ? "asc" : "desc",
                    limitCount
                  )
                  const sliced = result.data.slice(0, limitCount)
                  return { data: sliced, count: result.count, error: result.error }
                },
                single: async () => {
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }, { field: field2, operator: "==", value2 }],
                    fieldOrder,
                    options?.ascending ? "asc" : "desc",
                    1
                  )
                  return { data: result.data[0] || null, error: result.error }
                },
              }),
              order: (fieldOrder: string, options?: { ascending?: boolean }) => ({
                limit: async (num: number) => {
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }],
                    fieldOrder,
                    options?.ascending ? "asc" : "desc",
                    num
                  )
                  return countMode ? { data: result.data, count: result.count, error: result.error } : { data: result.data, error: result.error }
                },
                range: async (start: number, end: number) => {
                  const limitCount = end - start + 1
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }],
                    fieldOrder,
                    options?.ascending ? "asc" : "desc",
                    limitCount
                  )
                  const sliced = result.data.slice(0, limitCount)
                  return { data: sliced, count: result.count, error: result.error }
                },
                single: async () => {
                  const result = await getAdminCollection(
                    table,
                    [{ field, operator: "==", value }],
                    fieldOrder,
                    options?.ascending ? "asc" : "desc",
                    1
                  )
                  return { data: result.data[0] || null, error: result.error }
                },
              }),
              limit: async (num: number) => {
                const result = await getAdminCollection(
                  table,
                  [{ field, operator: "==", value }],
                  undefined,
                  "desc",
                  num
                )
                return countMode ? { data: result.data, count: result.count, error: result.error } : { data: result.data, error: result.error }
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
                const sliced = result.data.slice(0, limitCount)
                return { data: sliced, count: result.count, error: result.error }
              },
              single: async () => {
                const result = await getAdminCollection(
                  table,
                  [{ field, operator: "==", value }],
                  undefined,
                  "desc",
                  1
                )
                return { data: result.data[0] || null, error: result.error }
              },
            }),
            order: (fieldOrder: string, options?: { ascending?: boolean }) => ({
              limit: async (num: number) => {
                const result = await getAdminCollection(
                  table,
                  [{ field, operator: "==", value }],
                  fieldOrder,
                  options?.ascending ? "asc" : "desc",
                  num
                )
                return countMode ? { data: result.data, count: result.count, error: result.error } : { data: result.data, error: result.error }
              },
              range: async (start: number, end: number) => {
                const limitCount = end - start + 1
                const result = await getAdminCollection(
                  table,
                  [{ field, operator: "==", value }],
                  fieldOrder,
                  options?.ascending ? "asc" : "desc",
                  limitCount
                )
                const sliced = result.data.slice(0, limitCount)
                return { data: sliced, count: result.count, error: result.error }
              },
              single: async () => {
                const result = await getAdminCollection(
                  table,
                  [{ field, operator: "==", value }],
                  fieldOrder,
                  options?.ascending ? "asc" : "desc",
                  1
                )
                return { data: result.data[0] || null, error: result.error }
              },
            }),
            limit: async (num: number) => {
              const result = await getAdminCollection(
                table,
                [{ field, operator: "==", value }],
                undefined,
                "desc",
                num
              )
              return countMode ? { data: result.data, count: result.count, error: result.error } : { data: result.data, error: result.error }
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
              const sliced = result.data.slice(0, limitCount)
              return { data: sliced, count: result.count, error: result.error }
            },
            single: async () => {
              const result = await getAdminCollection(
                table,
                [{ field, operator: "==", value }],
                undefined,
                "desc",
                1
              )
              return { data: result.data[0] || null, error: result.error }
            },
          }),
          order: (fieldOrder: string, options?: { ascending?: boolean }) => ({
            limit: async (num: number) => {
              const result = await getAdminCollection(
                table,
                [],
                fieldOrder,
                options?.ascending ? "asc" : "desc",
                num
              )
              return countMode ? { data: result.data, count: result.count, error: result.error } : { data: result.data, error: result.error }
            },
            range: async (start: number, end: number) => {
              const limitCount = end - start + 1
              const result = await getAdminCollection(
                table,
                [],
                fieldOrder,
                options?.ascending ? "asc" : "desc",
                limitCount
              )
              const sliced = result.data.slice(0, limitCount)
              return { data: sliced, count: result.count, error: result.error }
            },
            single: async () => {
              const result = await getAdminCollection(
                table,
                [],
                fieldOrder,
                options?.ascending ? "asc" : "desc",
                1
              )
              return { data: result.data[0] || null, error: result.error }
            },
          }),
          limit: async (num: number) => {
            const result = await getAdminCollection(table, [], undefined, "desc", num)
            return countMode ? { data: result.data, count: result.count, error: result.error } : { data: result.data, error: result.error }
          },
        },
      insert: (data: any[] | any) => ({
        select: () => ({
          single: async () => {
            const dataArray = Array.isArray(data) ? data : [data]
            const firstItem = dataArray[0]
            const result = await createAdminDocument(table, firstItem)
            return result
          },
        }),
      }),
      update: (updates: any) => ({
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
        },
      }),
      delete: () => ({
        eq: async (field: string, value: any) => {
          const result = await deleteAdminDocument(table, value)
          return result
        },
      }),
    }),
    getCurrentUser: () => user,
  }
}
