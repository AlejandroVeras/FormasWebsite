import { cookies } from "next/headers"
import { adminAuth } from "./admin"
import { getAdminCollection, getAdminDocument, createAdminDocument, updateAdminDocument, deleteAdminDocument } from "./helpers"

export async function createServerClient() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  let user = null
  if (sessionCookie && adminAuth) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
      user = {
        id: decodedClaims.uid,
        email: decodedClaims.email,
        ...decodedClaims,
      }
    } catch (error: any) {
      console.error("Error verifying session cookie:", error?.message || error)
    }
  }

  // Create a Firebase client with Supabase-like interface for compatibility
  return {
    auth: {
      getUser: async () => ({
        data: { user },
        error: user ? null : { message: "Not authenticated" },
      }),
      signOut: async () => {
        const cookieStore = await cookies()
        cookieStore.delete("session")
        return { error: null }
      },
    },
    from: (table: string) => {
      return {
        select: (columns?: string, options?: { count?: "exact" }) => {
          const countMode = options?.count === "exact"

          // Build a chainable query builder that accumulates filters
          function createQueryBuilder(
            filters: { field: string; operator: string; value: any }[] = []
          ) {
            const builder: any = {
              // Chain another .eq() filter
              eq: (field: string, value: any) => {
                return createQueryBuilder([
                  ...filters,
                  { field, operator: "==", value },
                ])
              },
              // Greater than or equal
              gte: (field: string, value: any) => {
                return createQueryBuilder([
                  ...filters,
                  { field, operator: ">=", value },
                ])
              },
              // Less than or equal
              lte: (field: string, value: any) => {
                return createQueryBuilder([
                  ...filters,
                  { field, operator: "<=", value },
                ])
              },
              // Text search (case-insensitive like) - Firestore doesn't support this natively
              // We'll handle it in memory after fetching
              ilike: (field: string, pattern: string) => {
                return createQueryBuilder([
                  ...filters,
                  { field, operator: "ilike", value: pattern },
                ])
              },
              // Single result
              single: async () => {
                // Special case: if we have an id filter, use direct document fetch
                const idFilter = filters.find(f => f.field === "id" && f.operator === "==")
                if (idFilter) {
                  const result = await getAdminDocument(table, idFilter.value)
                  if (result.error || !result.data) {
                    return { data: null, error: result.error || { message: "Document not found" } }
                  }
                  return { data: result.data, error: null }
                }

                const result = await getAdminCollection(
                  table,
                  filters.filter(f => f.operator !== "ilike"),
                  undefined,
                  "desc",
                  undefined
                )
                
                let data = result.data
                // Apply ilike filters in memory
                const ilikeFilters = filters.filter(f => f.operator === "ilike")
                if (ilikeFilters.length > 0) {
                  data = applyIlikeFilters(data, ilikeFilters)
                }

                if (data.length === 0) {
                  return { data: null, error: { message: "Document not found" } }
                }
                return { data: data[0], error: result.error }
              },
              // Order results
              order: (orderField: string, orderOptions?: { ascending?: boolean }) => {
                const direction = orderOptions?.ascending ? "asc" as const : "desc" as const
                return {
                  limit: async (num: number) => {
                    // Separate Firestore-compatible filters from ilike
                    const firestoreFilters = filters.filter(f => f.operator !== "ilike")
                    const ilikeFilters = filters.filter(f => f.operator === "ilike")
                    
                    // If we have ilike filters, fetch more and filter in memory
                    const fetchLimit = ilikeFilters.length > 0 ? undefined : num
                    
                    const result = await getAdminCollection(
                      table,
                      firestoreFilters,
                      orderField,
                      direction,
                      fetchLimit
                    )
                    
                    let data = result.data
                    if (ilikeFilters.length > 0) {
                      data = applyIlikeFilters(data, ilikeFilters)
                      data = data.slice(0, num)
                    }
                    
                    return countMode
                      ? { data, count: ilikeFilters.length > 0 ? data.length : result.count, error: result.error }
                      : { data, error: result.error }
                  },
                  range: async (start: number, end: number) => {
                    // Separate Firestore-compatible filters from ilike
                    const firestoreFilters = filters.filter(f => f.operator !== "ilike")
                    const ilikeFilters = filters.filter(f => f.operator === "ilike")
                    
                    // For proper pagination, we need ALL matching docs to get total count
                    // and then slice the correct page
                    const result = await getAdminCollection(
                      table,
                      firestoreFilters,
                      orderField,
                      direction,
                      undefined // Fetch all to get real count
                    )
                    
                    let allData = result.data
                    if (ilikeFilters.length > 0) {
                      allData = applyIlikeFilters(allData, ilikeFilters)
                    }
                    
                    const totalCount = allData.length
                    const slicedData = allData.slice(start, end + 1)
                    
                    return countMode
                      ? { data: slicedData, count: totalCount, error: result.error }
                      : { data: slicedData, error: result.error }
                  },
                }
              },
              // Limit without ordering
              limit: async (num: number) => {
                const firestoreFilters = filters.filter(f => f.operator !== "ilike")
                const ilikeFilters = filters.filter(f => f.operator === "ilike")
                const fetchLimit = ilikeFilters.length > 0 ? undefined : num
                
                const result = await getAdminCollection(
                  table,
                  firestoreFilters,
                  undefined,
                  "desc",
                  fetchLimit
                )
                
                let data = result.data
                if (ilikeFilters.length > 0) {
                  data = applyIlikeFilters(data, ilikeFilters)
                  data = data.slice(0, num)
                }
                
                return countMode
                  ? { data, count: result.count, error: result.error }
                  : { data, error: result.error }
              },
              // Range without ordering
              range: async (start: number, end: number) => {
                const firestoreFilters = filters.filter(f => f.operator !== "ilike")
                const ilikeFilters = filters.filter(f => f.operator === "ilike")
                
                const result = await getAdminCollection(
                  table,
                  firestoreFilters,
                  undefined,
                  "desc",
                  undefined
                )
                
                let allData = result.data
                if (ilikeFilters.length > 0) {
                  allData = applyIlikeFilters(allData, ilikeFilters)
                }
                
                const totalCount = allData.length
                const slicedData = allData.slice(start, end + 1)
                
                return countMode
                  ? { data: slicedData, count: totalCount, error: result.error }
                  : { data: slicedData, error: result.error }
              },
              // Make it thenable for direct await
              then: async (resolve: any, reject: any) => {
                try {
                  const firestoreFilters = filters.filter(f => f.operator !== "ilike")
                  const ilikeFilters = filters.filter(f => f.operator === "ilike")
                  
                  const result = await getAdminCollection(
                    table,
                    firestoreFilters,
                    undefined,
                    "desc",
                    undefined
                  )
                  
                  let data = result.data
                  if (ilikeFilters.length > 0) {
                    data = applyIlikeFilters(data, ilikeFilters)
                  }
                  
                  const resolved = countMode
                    ? { data, count: data.length, error: result.error }
                    : { data, error: result.error }
                  resolve(resolved)
                  return resolved
                } catch (error) {
                  reject(error)
                  throw error
                }
              },
            }
            return builder
          }

          // Start with empty filters — .select() returns the builder
          const rootBuilder = createQueryBuilder([])
          return rootBuilder as any
        },
        insert: (data: any[] | any) => {
          return {
            select: () => ({
              single: async () => {
                const dataArray = Array.isArray(data) ? data : [data]
                const firstItem = dataArray[0]
                const result = await createAdminDocument(table, firstItem)
                return result
              },
            }),
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
            },
          }
        },
        remove: () => {
          return {
            eq: async (field: string, value: any) => {
              const result = await deleteAdminDocument(table, value)
              return result
            },
          }
        },
        delete: () => {
          return {
            eq: async (field: string, value: any) => {
              if (field === "id") {
                return await deleteAdminDocument(table, value)
              }
              // Find the document first
              const result = await getAdminCollection(
                table,
                [{ field, operator: "==", value }],
                undefined,
                "desc",
                1
              )
              if (result.data.length === 0) {
                return { error: { message: "Document not found" } }
              }
              return await deleteAdminDocument(table, result.data[0].id)
            },
          }
        },
      }
    },
    getCurrentUser: () => user,
  }
}

// Helper to apply ilike (case-insensitive text search) filters in memory
function applyIlikeFilters(
  data: any[],
  ilikeFilters: { field: string; operator: string; value: string }[]
): any[] {
  return data.filter((item) => {
    return ilikeFilters.every((filter) => {
      const fieldValue = item[filter.field]
      if (!fieldValue) return false

      // Convert ilike pattern to simple contains check
      // Supabase ilike uses % as wildcard
      const searchTerm = filter.value
        .replace(/%/g, "")
        .toLowerCase()

      return String(fieldValue).toLowerCase().includes(searchTerm)
    })
  })
}