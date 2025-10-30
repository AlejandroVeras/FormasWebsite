export async function uploadImage(file: File | Blob, fileName?: string): Promise<{ url: string }>
{
  const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER || "cloudinary"

  if (provider === "cloudinary") {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      // Fallback to base64 if cloudinary not configured
      return await uploadAsBase64(file)
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)
    if (fileName) formData.append("public_id", fileName)
    formData.append("folder", "properties-images")

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      // Fallback to base64 on error as last resort
      return await uploadAsBase64(file)
    }
    const data = await res.json()
    return { url: data.secure_url as string }
  }

  // Default/fallback: base64 data URL (not recommended for many/large images)
  return await uploadAsBase64(file)
}

async function uploadAsBase64(file: File | Blob): Promise<{ url: string }>
{
  const toDataURL = (blob: File | Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob as Blob)
    })

  const url = await toDataURL(file)
  return { url }
}




