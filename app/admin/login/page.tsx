"use client"

import type React from "react"

import { createClient } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting login process...")
      const firebase = createClient()
      const result = await firebase.auth.signInWithPassword({ email, password })
      
      console.log("Login result:", result)
      
      if (result.error) {
        console.error("Login error:", result.error)
        setError(result.error.message || "Error al iniciar sesión")
        setIsLoading(false)
        return
      }

      if (!result.data?.user) {
        console.error("No user data returned")
        setError("Error al iniciar sesión: No se pudo obtener los datos del usuario")
        setIsLoading(false)
        return
      }

      console.log("Login successful, session cookie should be set")
      
      // Wait a moment to ensure the cookie is set in the browser
      // This gives the browser time to process the Set-Cookie header
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Successfully logged in and session cookie is created
      // Force a full page navigation to ensure middleware can verify the session
      // Using window.location.href ensures cookies are included in the request
      console.log("Redirecting to dashboard...")
      window.location.href = "/admin/dashboard"
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error?.message || "Error al iniciar sesión")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-green-600">Formas</h1>
            <p className="text-sm text-gray-600">Inmobiliaria</p>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Acceso Administrativo</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al panel de administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@formas.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/admin/register"
                  className="text-green-600 hover:text-green-700 underline underline-offset-4"
                >
                  Registrarse
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/inmobiliaria" className="text-sm text-gray-600 hover:text-gray-800">
            ← Volver a la página pública
          </Link>
        </div>
      </div>
    </div>
  )
}
