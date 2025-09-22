import { Button } from "@/components/ui/button"
import "@/styles/constructora-teal.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Home, MapPin, Phone, Mail, ArrowLeft, Users, Award } from "lucide-react"
import Link from "next/link"

export default function ConstructoraPage() {
  return (
  <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-32 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/img/formaslogo.png" 
                alt="Formas Logo" 
                className="w-12 h-12 transition-transform hover:scale-110 bg-white rounded-full p-1 shadow constructora-teal-border"
              />
              <div>
                <h1 className="text-2xl font-bold constructora-teal viner-hand">FORMAS</h1>
                <p className="text-xs text-gray-700">Constructora</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver al Grupo
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-constructora-teal/5">
        <div className="container mx-auto px-6 lg:px-8 text-center">
           <Badge
            variant="outline"
            className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm animate-in fade-in-50 duration-1000 delay-300"
          >
            Parte de Formas
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Construcción <span className="constructora-teal">Integral</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Especialistas en construcción de proyectos residenciales, comerciales e industriales. Transformamos ideas en
            realidades construidas con la más alta calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 constructora-teal-bg hover:constructora-teal-bg-hover">
              Ver Proyectos <Building2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="constructora-teal-border constructora-teal">
              Solicitar Presupuesto
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Construcción completa desde la planificación hasta la entrega final
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 constructora-teal-light-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Residencial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Casas, apartamentos y condominios de alta calidad</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 constructora-teal-light-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Comercial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Oficinas, centros comerciales y locales comerciales</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 constructora-teal-light-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Industrial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Plantas industriales y edificaciones especializadas</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 constructora-teal-light-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Remodelaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Renovaciones y ampliaciones de espacios existentes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Nuestro Proceso</h3>
            <p className="text-muted-foreground text-lg">Metodología probada para garantizar el éxito de tu proyecto</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 constructora-teal-bg rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h4 className="font-semibold mb-2">Consulta Inicial</h4>
              <p className="text-sm text-muted-foreground">
                Evaluamos tus necesidades y definimos el alcance del proyecto
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 constructora-teal-bg rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="font-semibold mb-2">Diseño y Planificación</h4>
              <p className="text-sm text-muted-foreground">Creamos planos detallados y cronograma de trabajo</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 constructora-teal-bg rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="font-semibold mb-2">Construcción</h4>
              <p className="text-sm text-muted-foreground">Ejecutamos el proyecto con supervisión constante</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 constructora-teal-bg rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h4 className="font-semibold mb-2">Entrega</h4>
              <p className="text-sm text-muted-foreground">Entregamos tu proyecto terminado y con garantía</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Solicita tu Presupuesto</h3>
              <p className="text-muted-foreground">Cuéntanos sobre tu proyecto de construcción</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Tu teléfono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Proyecto</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                    <option>Construcción Residencial</option>
                    <option>Construcción Comercial</option>
                    <option>Construcción Industrial</option>
                    <option>Remodelación</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ubicación del Proyecto</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="Ciudad o sector"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Descripción del Proyecto</label>
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-md bg-background h-32 resize-none"
                    placeholder="Describe tu proyecto de construcción..."
                  ></textarea>
                </div>
                <Button className="w-full constructora-teal-bg hover:constructora-teal-bg-hover">Solicitar Presupuesto</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-8 lg:px-32">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-in fade-in slide-in-from-left-5 duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 constructora-teal-bg rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold constructora-teal">FORMAS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Grupo empresarial construyendo el futuro de Santiago con calidad, experiencia y compromiso.
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
              <h6 className="font-semibold mb-3">Nuestras Empresas</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/estructuras-metalicas" className="constructora-teal-hover transition-colors duration-300">
                    Estructuras Metálicas
                  </Link>
                </li>
                <li>
                  <Link href="/constructora" className="constructora-teal-hover transition-colors duration-300">
                    Constructora
                  </Link>
                </li>
                <li>
                  <Link href="/inmobiliaria" className="constructora-teal-hover transition-colors duration-300">
                    Inmobiliaria
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              <h6 className="font-semibold mb-3">Servicios</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Naves Industriales</li>
                <li>Construcción Residencial</li>
                <li>Venta de Propiedades</li>
                <li>Asesoría Técnica</li>
              </ul>
            </div>

            <div className="animate-in fade-in slide-in-from-right-5 duration-700 delay-300">
              <h6 className="font-semibold mb-3">Contacto</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Santiago, RD</li>
                <li>+1 (809) 123-4567</li>
                <li>info@formas.com.do</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
            <p>&copy; 2024 Grupo Formas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

