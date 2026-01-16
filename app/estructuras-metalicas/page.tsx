import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Wrench, MapPin, Phone, Mail, ArrowLeft, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import "@/styles/estructuras-rojo.css"

export default function EstructurasMetalicasPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-gradient-to-r from-white/98 via-white/96 to-white/98 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300 header-entrance">
        <div className="container mx-auto px-4 sm:px-6 lg:px-32 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 animate-in slide-in-from-left-5 duration-700 group flex-shrink-0">
              <div className="hover:scale-105 transition-transform duration-300">
                <img 
                  src="/img/formaslogotnombre.png" 
                  alt="Formas" 
                  className="h-8 sm:h-10 w-auto transition-transform hover:scale-110"
                />
                <p className="text-xs font-semibold estructuras-rojo/70 tracking-widest mt-1 hidden sm:block">ESTRUCTURAS METÁLICAS</p>
              </div>
            </div>
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="#servicios" className="px-2 sm:px-4 py-2 text-gray-700 font-medium text-xs sm:text-sm hover:text-estructuras-rojo hover:bg-estructuras-rojo/5 rounded-lg transition-all duration-300 nav-link-red">
                Servicios
              </a>
              <a href="#por-que" className="px-2 sm:px-4 py-2 text-gray-700 font-medium text-xs sm:text-sm hover:text-estructuras-rojo hover:bg-estructuras-rojo/5 rounded-lg transition-all duration-300 nav-link-red">
                Por qué elegirnos
              </a>
              <a href="#contacto" className="px-2 sm:px-4 py-2 text-gray-700 font-medium text-xs sm:text-sm hover:text-estructuras-rojo hover:bg-estructuras-rojo/5 rounded-lg transition-all duration-300 nav-link-red">
                Contacto
              </a>
            </nav>
            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="animate-in slide-in-from-right-5 duration-700 hover:scale-105 transition-transform border-estructuras-rojo/30 hover:bg-estructuras-rojo/10 text-estructuras-rojo hover:text-estructuras-rojo font-semibold text-xs sm:text-sm"
            >
              <Link href="/" className="gap-1 sm:gap-2">
                <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" /> <span className="hidden sm:inline">Volver al Grupo</span><span className="sm:hidden">Volver</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(254, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.65) 100%), url('/img/estructurasacero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-12 sm:p-16 shadow-2xl border border-white/20">
            <Badge
              variant="default"
              className="mb-6 animate-in fade-in-50 duration-1000 delay-300 estructuras-rojo-bg backdrop-blur-sm inline-block"
            >Parte de Formas
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance text-gray-900 animate-in slide-in-from-bottom-8 duration-1000 delay-500 leading-tight tracking-tight">
              Líderes en <span className="estructuras-rojo viner-hand text-5xl sm:text-6xl md:text-7xl">Estructuras Metálicas</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-3xl mx-auto text-pretty animate-in slide-in-from-bottom-8 duration-1000 delay-700 leading-relaxed font-medium">
              Más de 25 años de experiencia diseñando, fabricando e instalando estructuras metálicas de la más alta calidad
              para proyectos industriales y comerciales en toda la República Dominicana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-1000">
              <Button size="lg" className="gap-2 hover:scale-105 transition-transform estructuras-rojo-bg font-semibold">
                Ver Proyectos <Building2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform estructuras-rojo estructuras-rojo-border font-semibold hover:bg-estructuras-rojo/10"
              >
                Solicitar Cotización
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-16 animate-in fade-in-50 duration-1000">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h3>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Soluciones integrales en estructuras metálicas desde el diseño hasta la instalación con estándares internacionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2,
                title: "Naves Industriales",
                desc: "Estructuras completas para fábricas, almacenes y centros de distribución",
                delay: "delay-200",
              },
              {
                icon: Wrench,
                title: "Techos Metálicos",
                desc: "Sistemas de techado duraderos y eficientes para todo tipo de construcciones",
                delay: "delay-400",
              },
              {
                icon: CheckCircle,
                title: "Estructuras Comerciales",
                desc: "Marcos y estructuras para centros comerciales, oficinas y locales",
                delay: "delay-600",
              },
              {
                icon: Star,
                title: "Elementos Especiales",
                desc: "Escaleras, barandas, pasarelas y estructuras personalizadas",
                delay: "delay-800",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className={`text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 ${service.delay}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 estructuras-rojo-light-bg rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="py-20 bg-muted/30 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/industrial-construction-site-with-metal-structures.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-8 lg:px-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left-8 duration-1000">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">¿Por qué elegir Formas Estructuras Metálicas?</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Experiencia Comprobada",
                    desc: "Más de 500 proyectos completados exitosamente",
                    delay: "delay-200",
                  },
                  {
                    title: "Calidad Garantizada",
                    desc: "Materiales de primera calidad y procesos certificados",
                    delay: "delay-400",
                  },
                  {
                    title: "Equipo Especializado",
                    desc: "Ingenieros y técnicos altamente calificados",
                    delay: "delay-600",
                  },
                  {
                    title: "Servicio Integral",
                    desc: "Desde el diseño hasta la instalación completa",
                    delay: "delay-800",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 animate-in slide-in-from-left-5 duration-700 ${item.delay}`}
                  >
                    <CheckCircle className="w-5 h-5 estructuras-rojo mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-lg animate-in slide-in-from-right-8 duration-1000 hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-6">Solicita tu Cotización</h4>
              <div className="space-y-4">
                <div className="animate-in fade-in-50 duration-700 delay-300">
                  <label className="text-sm font-medium mb-2 block">Nombre de la Empresa</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background transition-all focus:ring-2 focus:ring-red-500/20"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <div className="animate-in fade-in-50 duration-700 delay-500">
                  <label className="text-sm font-medium mb-2 block">Tipo de Proyecto</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background transition-all focus:ring-2 focus:ring-red-500/20">
                    <option>Nave Industrial</option>
                    <option>Techo Metálico</option>
                    <option>Estructura Comercial</option>
                    <option>Proyecto Personalizado</option>
                  </select>
                </div>
                <div className="animate-in fade-in-50 duration-700 delay-700">
                  <label className="text-sm font-medium mb-2 block">Descripción del Proyecto</label>
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-md bg-background h-24 resize-none transition-all focus:ring-2 focus:ring-red-500/20"
                    placeholder="Describe tu proyecto..."
                  ></textarea>
                </div>
                <Button className="w-full animate-in fade-in-50 duration-700 delay-1000 hover:scale-105 transition-transform">
                  Solicitar Cotización
                </Button>
              </div>
            </div>
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
                  <Link href="/estructuras-metalicas" className="estructuras-rojo-hover transition-colors duration-300">
                    Estructuras Metálicas
                  </Link>
                </li>
                <li>
                  <Link href="/constructora" className="estructuras-rojo-hover transition-colors duration-300">
                    Constructora
                  </Link>
                </li>
                <li>
                  <Link href="/inmobiliaria" className="estructuras-rojo-hover transition-colors duration-300">
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
