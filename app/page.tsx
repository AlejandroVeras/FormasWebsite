"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Home, Wrench, MapPin, Phone, Mail, ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-32 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-5 duration-700">
              <img 
                src="/img/formaslogo.png" 
                alt="Formas Logo" 
                className="w-12 h-12 transition-transform hover:scale-110"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary viner-hand">FORMAS</h1>
              </div>
            </div>
            {/* NavBar */}
            <nav className="flex items-center gap-6 animate-in fade-in slide-in-from-right-5 duration-700 delay-200">
            
              {/* Otros links normales */}
              <a
                href="#inicio"
                className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-semibold"
              >
                Inicio
              </a>
              <a
                href="#nosotros"
                className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-semibold"
              >
                Nosotros
              </a>
              <a
                href="#contacto"
                className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-semibold"
              >
                Contacto
              </a>
                {/* Botón EMPRESAS destacado */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-semibold shadow-md border-2 border-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 focus:outline-none"
                    style={{ boxShadow: "0 2px 10px rgba(0,128,0,0.08)" }}
                  >
                    Empresas
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  sideOffset={8}
                  className="bg-white border border-primary rounded-lg shadow-lg mt-2 p-2 min-w-[200px] z-50"
                >
                  <DropdownMenu.Item asChild>
                    <Link href="/estructuras-metalicas" className="block px-3 py-2 rounded hover:bg-primary/10 text-primary font-medium transition">
                      Estructuras Metálicas
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/inmobiliaria" className="block px-3 py-2 rounded hover:bg-primary/10 text-primary font-medium transition">
                      Inmobiliaria
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/constructora" className="block px-3 py-2 rounded hover:bg-primary/10 text-primary font-medium transition">
                      Constructora
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 bg-gradient-to-br from-background to-muted relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/industrial-construction-site-with-metal-structures.jpg')`,
          }}
        />
        <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 animate-in fade-in slide-in-from-top-5 duration-700">
            Grupo Empresarial desde 1995
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance animate-in fade-in slide-in-from-top-5 duration-700 delay-200">
            Grupo <span className="text-primary">FORMAS</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty animate-in fade-in slide-in-from-top-5 duration-700 delay-300">
            Tres empresas especializadas bajo un mismo grupo, ofreciendo soluciones integrales en construcción,
            estructuras metálicas e inmobiliaria en Santiago, República Dominicana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
            <Button size="lg" className="gap-2 hover:scale-105 transition-transform duration-300" asChild>
              <Link href="#empresas">
                Conocer Nuestras Empresas <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="hover:scale-105 transition-transform duration-300 bg-transparent"
              asChild
            >
              <Link href="#contacto">Contactar Ahora</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Empresas Section */}
      <section id="empresas" className="py-20">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-5 duration-700">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Nuestras Empresas</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tres empresas independientes que forman el Grupo Formas, cada una especializada en su área
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Estructuras Metálicas - Principal */}
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-left-5 duration-700 delay-200">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/steel-metal-structures--industrial-beams--welding-.jpg')`,
                }}
              />
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="default">Empresa Principal</Badge>
              </div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Formas Estructuras en Acero </CardTitle>
                <CardDescription>
                  Empresa especializada en diseño, fabricación e instalación de estructuras en acero
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Naves industriales</li>
                  <li>• Estructuras comerciales</li>
                  <li>• Techos metálicos</li>
                  <li>• Escaleras y barandas</li>
                </ul>
                <Button className="w-full hover:scale-105 transition-transform duration-300" variant="default" asChild>
                  <Link href="/estructuras-metalicas">Visitar Empresa</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Constructora */}
            <Card className="hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/construction-site--buildings-under-construction--c.jpg')`,
                }}
              />
              <CardHeader className="pb-4 relative z-10">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Constructora Formas</CardTitle>
                <CardDescription>
                  Empresa de construcción integral para proyectos residenciales, comerciales e industriales
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Edificios residenciales</li>
                  <li>• Centros comerciales</li>
                  <li>• Obras civiles</li>
                  <li>• Remodelaciones</li>
                </ul>
                <Button
                  className="w-full bg-transparent hover:scale-105 transition-transform duration-300"
                  variant="outline"
                  asChild
                >
                  <Link href="/constructora">Visitar Empresa</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Inmobiliaria */}
            <Card className="hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-right-5 duration-700 delay-400 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/modern-houses--apartments--real-estate-properties-.jpg')`,
                }}
              />
              <CardHeader className="pb-4 relative z-10">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Informas</CardTitle>
                <CardDescription>
                  Empresa inmobiliaria especializada en desarrollo, venta y alquiler de propiedades
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Apartamentos y casas</li>
                  <li>• Locales comerciales</li>
                  <li>• Terrenos</li>
                  <li>• Asesoría inmobiliaria</li>
                </ul>
                <Button
                  className="w-full bg-transparent hover:scale-105 transition-transform duration-300"
                  variant="outline"
                  asChild
                >
                  <Link href="/inmobiliaria">Visitar Empresa</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-20 bg-muted/30">
        <div className="container mx-auto px-8 lg:px-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left-5 duration-700">
              <h3 className="text-3xl font-bold mb-6">Más de 25 años construyendo confianza</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                El Grupo Formas nació en Santiago con la visión de ser líder en el sector construcción de la República
                Dominicana. Nuestra empresa principal de estructuras metálicas es el corazón del grupo, complementada
                por nuestras empresas de construcción e inmobiliaria.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="hover:scale-105 transition-transform duration-300">
                  <h4 className="text-2xl font-bold text-primary mb-2">500+</h4>
                  <p className="text-sm text-muted-foreground">Proyectos Completados</p>
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <h4 className="text-2xl font-bold text-primary mb-2">25+</h4>
                  <p className="text-sm text-muted-foreground">Años de Experiencia</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-8 animate-in fade-in slide-in-from-right-5 duration-700 hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-xl font-semibold mb-4">¿Por qué elegir el Grupo Formas?</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Experiencia comprobada en el mercado dominicano</span>
                </li>
                <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Tres empresas especializadas trabajando en sinergia</span>
                </li>
                <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Compromiso con la calidad y los tiempos de entrega</span>
                </li>
                <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Equipo técnico altamente calificado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20">
        <div className="container mx-auto px-8 lg:px-32">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-5 duration-700">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h3>
            <p className="text-muted-foreground text-lg">Estamos listos para hacer realidad tu próximo proyecto</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-in fade-in slide-in-from-left-5 duration-700 delay-200">
              <h4 className="text-xl font-semibold mb-6">Información de Contacto</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Santiago, República Dominicana</span>
                </div>
                <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+1 (809) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@formas.com.do</span>
                </div>
              </div>

              <div className="mt-8">
                <h5 className="font-semibold mb-4">Horarios de Atención</h5>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
                  <p>Sábados: 8:00 AM - 12:00 PM</p>
                  <p>Domingos: Cerrado</p>
                </div>
              </div>
            </div>

            <Card className="animate-in fade-in slide-in-from-right-5 duration-700 delay-300 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Solicita una Cotización</CardTitle>
                <CardDescription>Cuéntanos sobre tu proyecto y te contactaremos pronto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="Tu teléfono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">División de Interés</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                    <option>Estructuras Metálicas</option>
                    <option>Constructora</option>
                    <option>Inmobiliaria</option>
                    <option>Múltiples Divisiones</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mensaje</label>
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-md bg-background h-24 resize-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Describe tu proyecto..."
                  ></textarea>
                </div>
                <Button className="w-full hover:scale-105 transition-transform duration-300">Enviar Solicitud</Button>
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
                <img 
                  src="/img/formaslogo.png" 
                  alt="Formas Logo" 
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-primary viner-hand">FORMAS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Grupo empresarial construyendo el futuro de Santiago con calidad, experiencia y compromiso.
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
              <h6 className="font-semibold mb-3">Nuestras Empresas</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/estructuras-metalicas" className="hover:text-primary transition-colors duration-300">
                    Estructuras Metálicas
                  </Link>
                </li>
                <li>
                  <Link href="/constructora" className="hover:text-primary transition-colors duration-300">
                    Constructora
                  </Link>
                </li>
                <li>
                  <Link href="/inmobiliaria" className="hover:text-primary transition-colors duration-300">
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
