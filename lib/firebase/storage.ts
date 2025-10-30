import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./config"

export async function uploadFile(bucket: string, fileName: string, file: File | Blob): Promise<{ data: { path: string } | null; error: any }> {
  try {
    const storageRef = ref(storage, `${bucket}/${fileName}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return { data: { path: url }, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message } }
  }
}

export async function getFileUrl(bucket: string, fileName: string): Promise<string> {
  const storageRef = ref(storage, `${bucket}/${fileName}`)
  return await getDownloadURL(storageRef)
}


