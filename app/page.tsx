"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Home, Wrench, MapPin, Phone, Mail, ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const backgroundImages = [
    '/img/estructurasacero.jpg',
    '/img/constructora.jpg',
    '/img/inmobiliaria.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval)
  }, [backgroundImages.length])
  return (
    <div className="min-h-screen bg-background">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-32 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-left-5 duration-700 flex-shrink-0">
              <div>
                <img 
                  src="/img/formaslogotnombre.png" 
                  alt="Formas" 
                  className="h-8 sm:h-10 w-auto transition-transform hover:scale-110"
                />
                <p className="text-xs text-primary/70 font-medium tracking-wider hidden sm:block">Grupo Empresarial</p>
              </div>
            </div>
            {/* NavBar */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 animate-in fade-in slide-in-from-right-5 duration-700 delay-200">
              {/* Otros links normales */}
              <a
                href="#inicio"
                className="hidden lg:inline text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-semibold text-sm"
              >
                Inicio
              </a>
              <a
                href="#nosotros"
                className="hidden lg:inline text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-semibold text-sm"
              >
                Nosotros
              </a>
              <a
                href="#contacto"
                className="hidden lg:inline text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-semibold text-sm"
              >
                Contacto
              </a>
                {/* Botón EMPRESAS destacado */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded-lg bg-primary text-white font-semibold shadow-md border-2 border-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 focus:outline-none text-sm sm:text-base"
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
      <section id="inicio" className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Fondo con imágenes que se cambian automáticamente */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.35)), url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
              }}
            />
          ))}
        </div>

        {/* Contenido */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 shadow-2xl border border-white/30">
            <Badge className="mb-4 sm:mb-6 bg-primary/20 text-primary border border-primary/40 animate-in fade-in-50 duration-1000 delay-300 inline-block text-xs sm:text-sm">
              Grupo Empresarial desde 1995
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance leading-tight text-gray-900 tracking-tight animate-in fade-in slide-in-from-top-5 duration-700">
              Grupo <img src="/img/formastext.png" alt="FORMAS" className="h-12 sm:h-16 lg:h-20 w-auto inline" />
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty leading-relaxed font-medium animate-in fade-in slide-in-from-top-5 duration-700 delay-200">
              Tres empresas especializadas bajo un mismo grupo, ofreciendo soluciones integrales en construcción,
              estructuras metálicas e inmobiliaria en Santiago, República Dominicana.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
              <Button size="sm" className="gap-2 hover:scale-105 transition-transform duration-300 bg-primary hover:bg-primary/90 font-semibold sm:size-lg" asChild>
                <Link href="#empresas">
                  Conocer Empresas <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform duration-300 border-primary/40 text-primary hover:bg-primary/10 font-semibold sm:size-lg"
                asChild
              >
                <Link href="#contacto">Contactar</Link>
              </Button>
            </div>

            {/* Indicadores de slide */}
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary w-6 sm:w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Empresas Section */}
      <section id="empresas" className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-top-5 duration-700">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Nuestras Empresas</h3>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
              Tres empresas especializadas e independientes que conforman el Grupo Formas, cada una un referente en su industria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Estructuras Metálicas - Principal */}
            <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-card to-primary/10 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-left-5 duration-700 delay-200">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/steel-metal-structures--industrial-beams--welding-.jpg')`,
                }}
              />
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="default" className="text-xs sm:text-sm">Empresa Principal</Badge>
              </div>
              <CardHeader className="pb-3 sm:pb-4 relative z-10">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-primary/15 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Wrench className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold mb-2">Formas Estructuras en Acero</CardTitle>
                <CardDescription>
                  Empresa especializada en diseño, fabricación e instalación de estructuras en acero
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Naves industriales</li>
                  <li>• Estructuras comerciales</li>
                  <li>• Techos metálicos</li>
                  <li className="text-xs sm:text-sm">• Escaleras y barandas</li>
                </ul>
                <Button className="w-full hover:scale-105 transition-transform duration-300 text-xs sm:text-sm" variant="default" asChild>
                  <Link href="/estructuras-metalicas">Visitar Empresa</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Constructora */}
            <Card className="relative overflow-hidden border-2 border-secondary/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/construction-site--buildings-under-construction--c.jpg')`,
                }}
              />
              <CardHeader className="pb-3 sm:pb-4 relative z-10">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-secondary/15 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Building2 className="w-6 sm:w-7 h-6 sm:h-7 text-secondary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold mb-2">Constructora Formas</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Empresa de construcción integral para proyectos residenciales, comerciales e industriales
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  <li>• Edificios residenciales</li>
                  <li>• Centros comerciales</li>
                  <li>• Obras civiles</li>
                  <li>• Remodelaciones</li>
                </ul>
                <Button
                  className="w-full bg-transparent hover:scale-105 transition-transform duration-300 text-xs sm:text-sm"
                  variant="outline"
                  asChild
                >
                  <Link href="/constructora">Visitar Empresa</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Inmobiliaria */}
            <Card className="relative overflow-hidden border-2 border-accent/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-right-5 duration-700 delay-400">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/modern-houses--apartments--real-estate-properties-.jpg')`,
                }}
              />
              <CardHeader className="pb-3 sm:pb-4 relative z-10">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-accent/15 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Home className="w-6 sm:w-7 h-6 sm:h-7 text-accent" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold mb-2">Formas Inmobiliaria</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Empresa inmobiliaria especializada en desarrollo, venta y alquiler de propiedades
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  <li>• Apartamentos y casas</li>
                  <li>• Locales comerciales</li>
                  <li>• Terrenos</li>
                  <li>• Asesoría inmobiliaria</li>
                </ul>
                <Button
                  className="w-full bg-transparent hover:scale-105 transition-transform duration-300 text-xs sm:text-sm"
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
      <section id="nosotros" className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-8 lg:px-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left-5 duration-700">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Más de 25 años construyendo confianza</h3>
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
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h3>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">Estamos listos para hacer realidad tu próximo proyecto y acompañarte en cada etapa</p>
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
                  src="/img/formaslogotnombre.png" 
                  alt="Formas" 
                  className="h-6 w-auto"
                />
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
