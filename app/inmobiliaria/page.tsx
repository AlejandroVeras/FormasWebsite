import "@/styles/formas-turquesa.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ContactForm from "@/components/contact-form"
import { Home, Building, MapPin, Phone, Mail, ArrowLeft, Search, Bed, Bath, Square, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createServerClient } from "@/lib/firebase/server"

export default async function InmobiliariaPage() {
  const firebase = await createServerClient()

  let properties: any[] = []

  try {
    // Get available properties (single query for both sections)
    const propertiesResult = await firebase
      .from("properties")
      .select("*")
      .eq("status", "disponible")
      .order("created_at", { ascending: false })
      .limit(6)

    if (propertiesResult?.error) {
      console.error("Error loading properties:", propertiesResult.error)
      properties = []
    } else {
      properties = propertiesResult?.data || []
    }
  } catch (error: any) {
    console.error("Error loading properties:", error)
    properties = []
  }

  const formatPrice = (price: number, operationType: string) => {
    const formattedPrice = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    }).format(price)

    return operationType === "alquiler" ? `${formattedPrice}/mes` : formattedPrice
  }

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "casa":
        return Home
      case "apartamento":
        return Building
      case "local":
        return Building
      case "oficina":
        return Building
      default:
        return Home
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-gradient-to-r from-white/98 via-white/96 to-white/98 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300 header-entrance">
        <div className="container mx-auto px-4 sm:px-6 lg:px-32 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-left-5 duration-700 group flex-shrink-0">
              <div className="hover:scale-105 transition-transform duration-300">
                <img
                  src="/img/formaslogotnombre.png"
                  alt="Formas"
                  className="h-8 sm:h-10 w-auto transition-transform hover:scale-110"
                />
                <p className="text-xs font-semibold inmobiliaria-verde/70 tracking-widest mt-1 hidden sm:block">INMOBILIARIA</p>
              </div>
            </div>
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="#propiedades" className="px-2 sm:px-4 py-2 text-gray-700 font-medium text-xs sm:text-sm hover:text-inmobiliaria-verde hover:bg-inmobiliaria-verde/5 rounded-lg transition-all duration-300 nav-link-green">
                Propiedades
              </a>
              <a href="#servicios" className="px-2 sm:px-4 py-2 text-gray-700 font-medium text-xs sm:text-sm hover:text-inmobiliaria-verde hover:bg-inmobiliaria-verde/5 rounded-lg transition-all duration-300 nav-link-green">
                Servicios
              </a>
              <a href="#contacto" className="px-2 sm:px-4 py-2 text-gray-700 font-medium text-xs sm:text-sm hover:text-inmobiliaria-verde hover:bg-inmobiliaria-verde/5 rounded-lg transition-all duration-300 nav-link-green">
                Contacto
              </a>
            </nav>
            {/* Actions */}
            <div className="flex items-center gap-2 animate-in slide-in-from-right-5 duration-700">
              <Button variant="ghost" size="sm" asChild className="hover:scale-105 transition-transform hidden sm:flex text-gray-700 hover:text-inmobiliaria-verde font-semibold text-xs sm:text-sm">
                <Link href="/admin/login" className="gap-2">
                  <Settings className="w-3 sm:w-4 h-3 sm:h-4" /> Admin
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:scale-105 transition-transform border-inmobiliaria-verde/30 hover:bg-inmobiliaria-verde/10 text-inmobiliaria-verde hover:text-inmobiliaria-verde font-semibold text-xs sm:text-sm"
              >
                <Link href="/" className="gap-1 sm:gap-2">
                  <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" /> <span className="hidden sm:inline">Volver al Grupo</span><span className="sm:hidden">Volver</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(61, 207, 150, 0.25) 50%, rgba(0, 0, 0, 0.65) 100%), url('/img/inmobiliaria.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-10 sm:p-14 md:p-16 shadow-2xl border border-white/20">
            <Badge
              variant="outline"
              className="mb-6 border-formas-turquesa/30 text-formas-turquesa bg-formas-turquesa/5 animate-in fade-in-50 duration-1000 delay-300 inline-block"
            >
              Parte de Formas
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance text-gray-900 animate-in slide-in-from-bottom-8 duration-1000 delay-500 leading-tight tracking-tight">
              Tu <span className="formas-turquesa viner-hand text-5xl sm:text-6xl md:text-7xl">Hogar Ideal</span> te Espera
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-3xl mx-auto text-pretty animate-in slide-in-from-bottom-8 duration-1000 delay-700 leading-relaxed font-medium">
              Encuentra la propiedad perfecta. Ofrecemos venta, alquiler y asesoría inmobiliaria con la confianza y experiencia de más de 35 años del Grupo Formas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-1000">
              <Button
                size="lg"
                className="gap-2 formas-turquesa-bg hover:scale-105 transition-transform font-semibold"
                asChild
              >
                <Link href="#propiedades">
                  <span className="formas-turquesa-bg">Ver Propiedades</span> <Search className="w-4 h-4 formas-turquesa" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform formas-turquesa formas-turquesa-border font-semibold hover:bg-formas-turquesa/10"
                asChild
              >
                <a href="#contacto" className="scroll-smooth formas-turquesa">
                  Vender mi Propiedad
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12 sm:mb-16 animate-in fade-in-50 duration-1000">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Soluciones inmobiliarias completas para todas tus necesidades, desde búsqueda hasta cierre
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Home,
                title: "Venta de Propiedades",
                desc: "Casas, apartamentos y locales comerciales en las mejores ubicaciones",
                features: [
                  "• Apartamentos nuevos y usados",
                  "• Casas residenciales",
                  "• Locales comerciales",
                  "• Terrenos para desarrollo",
                ],
                buttonText: "Ver Propiedades en Venta",
                href: "/inmobiliaria/propiedades?operation_type=venta",
                delay: "delay-200",
              },
              {
                icon: Building,
                title: "Alquiler",
                desc: "Propiedades en alquiler para residencia y negocios",
                features: [
                  "• Apartamentos amueblados",
                  "• Casas familiares",
                  "• Oficinas equipadas",
                  "• Espacios comerciales",
                ],
                buttonText: "Ver Propiedades en Alquiler",
                href: "/inmobiliaria/propiedades?operation_type=alquiler",
                delay: "delay-400",
              },
              {
                icon: Search,
                title: "Asesoría Inmobiliaria",
                desc: "Consultoría especializada para compradores y vendedores",
                features: [
                  "• Evaluación de propiedades",
                  "• Asesoría legal",
                  "• Financiamiento",
                  "• Gestión de documentos",
                ],
                buttonText: "Solicitar Asesoría",
                href: "#contacto",
                delay: "delay-600",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className={`text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 ${service.delay}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 formas-turquesa/10 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                    <service.icon className="w-6 h-6 formas-turquesa" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${index === 0 ? "formas-turquesa-bg hover:formas-turquesa-bg" : "bg-transparent"} hover:scale-105 transition-transform`}
                    variant={index === 0 ? "default" : "outline"}
                    asChild
                  >
                    <Link href={service.href}>{service.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section — Single unified section */}
      <section id="propiedades" className="py-20 bg-muted/30">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-16 animate-in fade-in-50 duration-1000">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Propiedades Disponibles</h3>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              {properties.length > 0
                ? "Explora nuestras mejores opciones disponibles, cuidadosamente seleccionadas para ti"
                : "Próximamente tendremos propiedades disponibles"}
            </p>
          </div>

          {properties && properties.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property: any, index: number) => {
                  const PropertyIcon = getPropertyIcon(property.property_type)
                  return (
                    <Card key={property.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 delay-${(index + 1) * 200}`}>
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                        {property.images && property.images[0] ? (
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform hover:scale-110"
                          />
                        ) : (
                          <PropertyIcon className="w-16 h-16 formas-turquesa/50" />
                        )}
                        <Badge
                          variant={property.operation_type === "venta" ? "secondary" : "outline"}
                          className="absolute top-2 right-2 capitalize"
                        >
                          {property.operation_type}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg line-clamp-1">{property.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.address}, {property.city}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          {property.bedrooms && (
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          {property.area_m2 && (
                            <div className="flex items-center gap-1">
                              <Square className="w-4 h-4" />
                              <span>{property.area_m2}m²</span>
                            </div>
                          )}
                        </div>
                        {property.features && property.features.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {property.features.slice(0, 3).map((feature: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {property.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{property.features.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold formas-turquesa">
                            {formatPrice(property.price, property.operation_type)}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:scale-105 transition-transform bg-transparent"
                            asChild
                          >
                            <Link href={`/inmobiliaria/propiedades/${property.id}`}>
                              Ver Detalles
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="formas-turquesa-bg hover:scale-105 transition-transform font-semibold gap-2"
                  asChild
                >
                  <Link href="/inmobiliaria/propiedades">
                    Ver Todas las Propiedades <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 animate-in fade-in-50 duration-1000">
              <Home className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-muted-foreground mb-2">Próximamente nuevas propiedades</h4>
              <p className="text-muted-foreground mb-6">
                Estamos preparando un excelente catálogo de propiedades para ti
              </p>
              <Button variant="outline" className="hover:scale-105 transition-transform bg-transparent" asChild>
                <a href="#contacto">Notificarme cuando estén disponibles</a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contacto" className="py-20">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 animate-in fade-in-50 duration-1000">
              <h3 className="text-4xl font-bold mb-4">¿Buscas una Propiedad?</h3>
              <p className="text-muted-foreground text-lg">Cuéntanos qué necesitas y te ayudaremos a encontrar tu hogar ideal</p>
            </div>

            <div className="animate-in slide-in-from-bottom-8 duration-1000 delay-300">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {[
              { icon: MapPin, text: "Santiago, República Dominicana", delay: "delay-300" },
              { icon: Phone, text: "+1 (809) 123-4569", delay: "delay-500" },
              { icon: Mail, text: "inmobiliaria@formas.com.do", delay: "delay-700" },
            ].map((contact, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-700 ${contact.delay} hover:scale-105 transition-transform`}
              >
                <contact.icon className="w-5 h-5 formas-turquesa" />
                <span>{contact.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
