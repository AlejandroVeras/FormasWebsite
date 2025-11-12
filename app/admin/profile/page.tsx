"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/firebase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "",
    company: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del perfil al montar
  useEffect(() => {
    const fetchProfile = async () => {
      const firebase = createClient()
      const { data: user } = await firebase.auth.getUser()
      if (!user.user) return
      const { data, error } = await firebase
        .from("admin_profiles")
        .select("*")
        .eq("id", user.user.id)
        .single()
      if (data) setProfile(data)
      if (error) setError(error.message)
    }
    fetchProfile()
  }, [])

  // Editar perfil
  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const firebase = createClient()
    const { data: user } = await firebase.auth.getUser()
    if (!user.user) return setError("No autenticado")
    const { error } = await firebase
      .from("admin_profiles")
      .update({
        full_name: profile.full_name,
        company: profile.company,
        role: profile.role,
      })
      .eq("id", user.user.id)
    if (error) setError(error.message)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <CardDescription>Actualiza tus datos de usuario</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Input
                id="role"
                value={profile.role}
                onChange={(e) => handleChange("role", e.target.value)}
                disabled // Solo super_admin debería poder cambiar esto en producción
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}