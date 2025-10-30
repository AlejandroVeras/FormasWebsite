import { collection, doc, query, where, orderBy, limit, getDocs, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, QueryConstraint, startAfter, QueryDocumentSnapshot } from "firebase/firestore"
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

    // Apply ordering
    if (orderByField) {
      q = q.orderBy(orderByField, orderDirection)
    }

    // Apply limit
    if (count) {
      q = q.limit(count)
    }

    const snapshot = await q.get()
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
    return { data: [], error: { message: error.message }, count: 0 }
  }
}

export async function getAdminDocument(collectionName: string, docId: string) {
  try {
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
    const now = adminDb.serverTimestamp()
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
    return { data: null, error: { message: error.message } }
  }
}

export async function updateAdminDocument(collectionName: string, docId: string, updates: any) {
  try {
    const docRef = adminDb.collection(collectionName).doc(docId)
    await docRef.update({
      ...updates,
      updated_at: adminDb.serverTimestamp(),
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
    const docRef = adminDb.collection(collectionName).doc(docId)
    await docRef.delete()
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

