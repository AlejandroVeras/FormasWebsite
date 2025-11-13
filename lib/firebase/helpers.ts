import { collection, doc, query, where, orderBy, limit, getDocs, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, QueryConstraint, startAfter, QueryDocumentSnapshot } from "firebase/firestore"
import { FieldValue } from "firebase-admin/firestore"
import { db } from "./config"
import { adminDb } from "./admin"

// Client-side Firestore helpers
export async function getCollection(
  collectionName: string,
  filters: { field: string; operator: string; value: any }[] = [],
  orderByField?: string,
  orderDirection: "asc" | "desc" = "desc",
  count?: number,
  offset?: number
) {
  let q: any = collection(db, collectionName)

  const constraints: QueryConstraint[] = []

  // Apply filters
  filters.forEach(({ field, operator, value }) => {
    if (operator === "==") {
      constraints.push(where(field, "==", value))
    } else if (operator === "!=") {
      constraints.push(where(field, "!=", value))
    } else if (operator === ">") {
      constraints.push(where(field, ">", value))
    } else if (operator === "<") {
      constraints.push(where(field, "<", value))
    } else if (operator === ">=") {
      constraints.push(where(field, ">=", value))
    } else if (operator === "<=") {
      constraints.push(where(field, "<=", value))
    } else if (operator === "in") {
      constraints.push(where(field, "in", value))
    } else if (operator === "array-contains") {
      constraints.push(where(field, "array-contains", value))
    }
  })

  // Apply ordering
  if (orderByField) {
    constraints.push(orderBy(orderByField, orderDirection))
  }

  // Apply pagination (Firestore doesn't support offset, only startAfter)
  if (count) {
    constraints.push(limit(count))
  }

  q = query(q, ...constraints)
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
  }))

  return { data, error: null, count: snapshot.size }
}

export async function getDocument(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return { data: null, error: { message: "Document not found" } }
    }

    const data = {
      id: docSnap.id,
      ...docSnap.data(),
      created_at: docSnap.data()?.created_at?.toDate?.()?.toISOString() || docSnap.data()?.created_at,
      updated_at: docSnap.data()?.updated_at?.toDate?.()?.toISOString() || docSnap.data()?.updated_at,
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export async function createDocument(collectionName: string, data: any) {
  try {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      created_at: now,
      updated_at: now,
    })
    
    const newDoc = await getDoc(docRef)
    const result = {
      id: newDoc.id,
      ...newDoc.data(),
      created_at: newDoc.data()?.created_at?.toDate?.()?.toISOString() || newDoc.data()?.created_at,
      updated_at: newDoc.data()?.updated_at?.toDate?.()?.toISOString() || newDoc.data()?.updated_at,
    }

    return { data: result, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export async function updateDocument(collectionName: string, docId: string, updates: any) {
  try {
    const docRef = doc(db, collectionName, docId)
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
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export async function deleteDocument(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Server-side Firestore helpers (using Admin SDK)
export async function getAdminCollection(
  collectionName: string,
  filters: { field: string; operator: string; value: any }[] = [],
  orderByField?: string,
  orderDirection: "asc" | "desc" = "desc",
  count?: number
) {
  try {
    // Check if adminDb is initialized
    if (!adminDb) {
      console.warn('Firebase Admin DB is not initialized. Returning empty data.')
      return { data: [], error: { message: 'Firebase Admin not initialized. Please check environment variables.' }, count: 0 }
    }

    let q: any = adminDb.collection(collectionName)

    // Apply filters
    filters.forEach(({ field, operator, value }) => {
      if (operator === "==") {
        q = q.where(field, "==", value)
      } else if (operator === "!=") {
        q = q.where(field, "!=", value)
      } else if (operator === ">") {
        q = q.where(field, ">", value)
      } else if (operator === "<") {
        q = q.where(field, "<", value)
      } else if (operator === ">=") {
        q = q.where(field, ">=", value)
      } else if (operator === "<=") {
        q = q.where(field, "<=", value)
      } else if (operator === "in") {
        q = q.where(field, "in", value)
      } else if (operator === "array-contains") {
        q = q.where(field, "array-contains", value)
      }
    })

    // Try to apply ordering and limit in Firestore query
    // If this fails (e.g., missing index), we'll fetch all and sort in memory
    let snapshot: any
    try {
      // Apply ordering
      if (orderByField) {
        q = q.orderBy(orderByField, orderDirection)
      }

      // Apply limit
      if (count) {
        q = q.limit(count)
      }

      snapshot = await q.get()
    } catch (queryError: any) {
      // If query fails (likely due to missing composite index), try without ordering
      console.warn(`Query with orderBy failed, trying without orderBy:`, queryError?.message)
      
      // If it's an index error and we have filters + orderBy, try fetching all and sorting in memory
      if (orderByField && (queryError?.message?.includes("index") || queryError?.code === "failed-precondition" || queryError?.code === 9)) {
        console.warn(`⚠️ Firestore composite index missing. Fetching all documents and sorting in memory.`)
        console.warn(`This is a fallback. Please create a composite index in Firebase Console for better performance.`)
        
        try {
          if (!adminDb) {
            throw new Error('Firebase Admin DB is not initialized')
          }
          
          // Rebuild query without orderBy
          let fallbackQuery: any = adminDb.collection(collectionName)
          
          // Apply filters only
          filters.forEach(({ field, operator, value }) => {
            if (operator === "==") {
              fallbackQuery = fallbackQuery.where(field, "==", value)
            }
          })
          
          // Fetch all matching documents
          snapshot = await fallbackQuery.get()
          
          // Sort in memory
          let docs = snapshot.docs.map((doc: any) => {
            const docData = doc.data()
            return {
              id: doc.id,
              ...docData,
              created_at: docData.created_at?.toDate?.()?.toISOString() || docData.created_at,
              updated_at: docData.updated_at?.toDate?.()?.toISOString() || docData.updated_at,
            }
          })
          
          // Sort by orderByField
          if (orderByField) {
            docs.sort((a: any, b: any) => {
              const aValue = a[orderByField]
              const bValue = b[orderByField]
              
              if (aValue === undefined || aValue === null) return 1
              if (bValue === undefined || bValue === null) return -1
              
              // Handle date strings
              if (orderByField === "created_at" || orderByField === "updated_at") {
                const aDate = new Date(aValue).getTime()
                const bDate = new Date(bValue).getTime()
                return orderDirection === "asc" ? aDate - bDate : bDate - aDate
              }
              
              if (orderDirection === "asc") {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
              } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
              }
            })
          }
          
          // Apply limit
          if (count) {
            docs = docs.slice(0, count)
          }
          
          return { data: docs, error: null, count: docs.length }
        } catch (fallbackError: any) {
          // If fallback also fails, return empty data
          console.error(`Fallback query also failed:`, fallbackError?.message || fallbackError)
          return { data: [], error: { message: fallbackError?.message || 'Query failed' }, count: 0 }
        }
      } else {
        // If it's not an index error or we don't have orderBy, return error instead of throwing
        // This prevents the page from crashing
        console.error(`Query error (not index-related):`, queryError?.message || queryError)
        return { 
          data: [], 
          error: { 
            message: queryError?.message || 'Query failed', 
            code: queryError?.code || 'unknown'
          }, 
          count: 0 
        }
      }
    }

    // Process snapshot normally (only reached if query succeeded)
    if (!snapshot) {
      return { data: [], error: { message: 'No snapshot available' }, count: 0 }
    }

    const data = snapshot.docs.map((doc: any) => {
      const docData = doc.data()
      return {
        id: doc.id,
        ...docData,
        created_at: docData.created_at?.toDate?.()?.toISOString() || docData.created_at,
        updated_at: docData.updated_at?.toDate?.()?.toISOString() || docData.updated_at,
      }
    })

    return { data, error: null, count: snapshot.size }
  } catch (error: any) {
    console.error(`Error getting collection ${collectionName}:`, error?.message || error)
    console.error(`Error code:`, error?.code)
    console.error(`Error stack:`, error?.stack)
    
    // If it's an index error, log it clearly
    if (error?.message?.includes("index") || error?.code === "failed-precondition" || error?.code === 9) {
      console.error(`⚠️ Firestore composite index required!`)
      console.error(`Collection: ${collectionName}`)
      console.error(`Filters:`, JSON.stringify(filters, null, 2))
      console.error(`OrderBy: ${orderByField} (${orderDirection})`)
      console.error(`Please create a composite index in Firebase Console:`)
      console.error(`- Collection: ${collectionName}`)
      if (filters.length > 0 && orderByField) {
        console.error(`- Fields: ${filters.map(f => `${f.field} (Ascending)`).join(', ')}, ${orderByField} (${orderDirection === 'asc' ? 'Ascending' : 'Descending'})`)
      }
    }
    
    // Return empty data instead of throwing to prevent page crash
    return { 
      data: [], 
      error: { 
        message: error?.message || 'Unknown error', 
        code: error?.code || 'unknown',
        details: error?.details || null
      }, 
      count: 0 
    }
  }
}

export async function getAdminDocument(collectionName: string, docId: string) {
  try {
    if (!adminDb) {
      return { data: null, error: { message: 'Firebase Admin not initialized' } }
    }
    const docRef = adminDb.collection(collectionName).doc(docId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return { data: null, error: { message: "Document not found" } }
    }

    const docData = docSnap.data()
    const data = {
      id: docSnap.id,
      ...docData,
      created_at: docData?.created_at?.toDate?.()?.toISOString() || docData?.created_at,
      updated_at: docData?.updated_at?.toDate?.()?.toISOString() || docData?.updated_at,
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export async function createAdminDocument(collectionName: string, data: any) {
  try {
    if (!adminDb) {
      return { data: null, error: { message: 'Firebase Admin not initialized' } }
    }
    // Use FieldValue.serverTimestamp() for server-side timestamps
    const now = FieldValue.serverTimestamp()
    const docRef = adminDb.collection(collectionName).doc()
    
    await docRef.set({
      ...data,
      created_at: now,
      updated_at: now,
    })

    const newDoc = await docRef.get()
    const docData = newDoc.data()
    const result = {
      id: newDoc.id,
      ...docData,
      created_at: docData?.created_at?.toDate?.()?.toISOString() || docData?.created_at,
      updated_at: docData?.updated_at?.toDate?.()?.toISOString() || docData?.updated_at,
    }

    return { data: result, error: null }
  } catch (error: any) {
    console.error("Error creating admin document:", error)
    return { data: null, error: { message: error?.message || 'Unknown error' } }
  }
}

export async function updateAdminDocument(collectionName: string, docId: string, updates: any) {
  try {
    if (!adminDb) {
      return { data: null, error: { message: 'Firebase Admin not initialized' } }
    }
    const docRef = adminDb.collection(collectionName).doc(docId)
    await docRef.update({
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    })

    const updatedDoc = await docRef.get()
    const docData = updatedDoc.data()
    const result = {
      id: updatedDoc.id,
      ...docData,
      created_at: docData?.created_at?.toDate?.()?.toISOString() || docData?.created_at,
      updated_at: docData?.updated_at?.toDate?.()?.toISOString() || docData?.updated_at,
    }

    return { data: result, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export async function deleteAdminDocument(collectionName: string, docId: string) {
  try {
    if (!adminDb) {
      return { error: { message: 'Firebase Admin not initialized' } }
    }
    const docRef = adminDb.collection(collectionName).doc(docId)
    await docRef.delete()
    return { error: null }
  } catch (error: any) {
    return { error: { message: error?.message || 'Unknown error' } }
  }
}

