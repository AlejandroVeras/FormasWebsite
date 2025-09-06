import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">¡Registro Exitoso!</CardTitle>
            <CardDescription>
              Hemos enviado un enlace de confirmación a tu email. Por favor, revisa tu bandeja de entrada y confirma tu
              cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Una vez que confirmes tu email, podrás acceder al panel de administración.
              </p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/admin/login">Ir al Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
