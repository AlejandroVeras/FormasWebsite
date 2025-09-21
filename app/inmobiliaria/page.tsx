import "@/styles/inmobiliaria-verde.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ContactForm from "@/components/contact-form"
import { Home, Building, MapPin, Phone, Mail, ArrowLeft, Search, Bed, Bath, Square, Settings } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function InmobiliariaPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "disponible")
    .order("created_at", { ascending: false })
    .limit(6)

  // Get featured properties for the hero section
  // TODO: Enable this after running the database migration (006_add_featured_properties.sql)
  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "disponible")
    .order("created_at", { ascending: false })
    .limit(3)
  // Once migration is complete, use this query instead:
  // const { data: featuredProperties } = await supabase
  //   .from("properties")
  //   .select("*")
  //   .eq("featured", true)
  //   .eq("status", "disponible")
  //   .order("featured_order")
  //   .limit(3)

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
      <header className="border-b bg-white/30 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-32 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-5 duration-700">
              <img 
                src="/img/formaslogo.png" 
                alt="Formas Logo" 
                className="w-12 h-12 transition-transform hover:scale-110 bg-white rounded-full p-1 shadow inmobiliaria-verde-border"
              />
              <div>
                <h1 className="text-2xl font-bold inmobiliaria-verde viner-hand">FORMAS</h1>
                <p className="text-xs text-gray-700 hidden sm:block">Inmobiliaria</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 animate-in slide-in-from-right-5 duration-700">
              <Button variant="ghost" size="sm" asChild className="hover:scale-105 transition-transform hidden sm:flex">
                <Link href="/admin/login" className="gap-2">
                  <Settings className="w-4 h-4" /> Admin
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:scale-105 transition-transform bg-transparent"
              >
                <Link href="/" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver al Grupo</span><span className="sm:hidden">Volver</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 bg-gradient-to-br from-background to-inmobiliaria-verde/5 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/modern-houses--apartments--real-estate-properties-.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge
            variant="outline"
            className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm animate-in fade-in-50 duration-1000 delay-300"
          >
            Parte del Grupo Formas
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-balance text-white animate-in slide-in-from-bottom-8 duration-1000 delay-500">
            Tu <span className="inmobiliaria-verde">Hogar Ideal</span> te Espera
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto text-pretty animate-in slide-in-from-bottom-8 duration-1000 delay-700">
            Encuentra la propiedad perfecta en Santiago. Ofrecemos venta, alquiler y asesoría inmobiliaria con la
            confianza y experiencia del Grupo Formas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-1000">
            <Button
              size="lg"
              className="gap-2 inmobiliaria-verde-bg hover:scale-105 transition-transform"
              asChild
            >
              <Link href="#propiedades">
                <span className="inmobiliaria-verde-bg">Ver Propiedades</span> <Search className="w-4 h-4 inmobiliaria-verde" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="hover:scale-105 transition-transform inmobiliaria-verde inmobiliaria-verde-border"
              asChild
            >
              <a href="#contacto" className="scroll-smooth inmobiliaria-verde">
                Vender mi Propiedad
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12 sm:mb-16 animate-in fade-in-50 duration-1000">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Servicios inmobiliarios completos para todas tus necesidades
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
                delay: "delay-600",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className={`text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 ${service.delay}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 inmobiliaria-verde-light-bg rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                    <service.icon className="w-6 h-6 inmobiliaria-verde" />
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
                    className={`w-full ${index === 0 ? "inmobiliaria-verde-bg hover:inmobiliaria-verde-bg" : "bg-transparent"} hover:scale-105 transition-transform`}
                    variant={index === 0 ? "default" : "outline"}
                    asChild
                  >
                    {index === 0 ? (
                      <Link href="/inmobiliaria/propiedades?operation_type=venta">{service.buttonText}</Link>
                    ) : index === 1 ? (
                      <Link href="/inmobiliaria/propiedades?operation_type=alquiler">{service.buttonText}</Link>
                    ) : (
                      <a href="#contacto" className="scroll-smooth">{service.buttonText}</a>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-16 animate-in fade-in-50 duration-1000">
            <h3 className="text-3xl font-bold mb-4">Propiedades Destacadas</h3>
            <p className="text-muted-foreground text-lg">Algunas de nuestras mejores opciones disponibles</p>
          </div>

          {featuredProperties && featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => {
                const PropertyIcon = getPropertyIcon(property.property_type)
                return (
                  <Card key={property.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 delay-${(index + 1) * 200}`}>
                    <div className="h-48 bg-gradient-to-br from-inmobiliaria-verde/20 to-inmobiliaria-verde/5 flex items-center justify-center relative">
                      {property.images && property.images[0] ? (
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform hover:scale-110"
                        />
                      ) : (
                        <PropertyIcon className="w-16 h-16 inmobiliaria-verde/50" />
                      )}
                      <Badge
                        variant={property.operation_type === "venta" ? "secondary" : "outline"}
                        className="absolute top-2 right-2"
                      >
                        {property.operation_type}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{property.title}</h4>
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
                            {property.features.slice(0, 3).map((feature, idx) => (
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
                        <span className="text-xl font-bold inmobiliaria-verde">
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
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Fallback: Show sample cards when no featured properties */}
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
                <div className="h-48 bg-gradient-to-br from-inmobiliaria-verde/20 to-inmobiliaria-verde/5 flex items-center justify-center">
                  <Home className="w-16 h-16 inmobiliaria-verde/50" />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Apartamento Moderno</h4>
                    <Badge variant="secondary">Venta</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Bella Vista, Santiago</p>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>3</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>2</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>120m²</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold inmobiliaria-verde">$185,000</span>
                    <Button size="sm" variant="outline" className="hover:scale-105 transition-transform bg-transparent">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 delay-400">
                <div className="h-48 bg-gradient-to-br from-inmobiliaria-verde/20 to-inmobiliaria-verde/5 flex items-center justify-center">
                  <Building className="w-16 h-16 inmobiliaria-verde" />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Casa Familiar</h4>
                    <Badge variant="secondary">Venta</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Los Jardines, Santiago</p>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>4</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>3</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>250m²</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold inmobiliaria-verde">$320,000</span>
                    <Button size="sm" variant="outline" className="hover:scale-105 transition-transform bg-transparent">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 delay-600">
                <div className="h-48 bg-gradient-to-br from-inmobiliaria-verde/20 to-inmobiliaria-verde/5 flex items-center justify-center">
                  <Home className="w-16 h-16 inmobiliaria-verde/50" />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Local Comercial</h4>
                    <Badge variant="outline">Alquiler</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Centro de Santiago</p>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>80m²</span>
                    </div>
                    <span>Planta baja</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold inmobiliaria-verde">$1,200/mes</span>
                    <Button size="sm" variant="outline" className="hover:scale-105 transition-transform bg-transparent">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Propiedades Disponibles */}
      <section id="propiedades" className="py-20 bg-muted/30">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-16 animate-in fade-in-50 duration-1000">
            <h3 className="text-3xl font-bold mb-4">Propiedades Disponibles</h3>
            <p className="text-muted-foreground text-lg">
              {properties && properties.length > 0
                ? `Descubre nuestras ${properties.length} propiedades destacadas`
                : "Próximamente tendremos propiedades disponibles"}
            </p>
          </div>

          {properties && properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => {
                const PropertyIcon = getPropertyIcon(property.property_type)
                return (
                  <Card
                    key={property.id}
                    className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8 duration-1000 delay-${(index + 1) * 200}`}
                  >
                    <div className="h-48 bg-gradient-to-br from-inmobiliaria-verde/20 to-inmobiliaria-verde/5 flex items-center justify-center relative">
                      {property.images && property.images[0] ? (
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform hover:scale-110"
                        />
                      ) : (
                        <PropertyIcon className="w-16 h-16 inmobiliaria-verde" />
                      )}
                      <Badge
                        variant={property.operation_type === "venta" ? "secondary" : "outline"}
                        className="absolute top-2 right-2"
                      >
                        {property.operation_type}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{property.title}</h4>
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
                            {property.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
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
                        <span className="text-xl font-bold inmobiliaria-verde">
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
          ) : (
            <div className="text-center py-12 animate-in fade-in-50 duration-1000">
              <Home className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-muted-foreground mb-2">Próximamente nuevas propiedades</h4>
              <p className="text-muted-foreground mb-6">
                Estamos preparando un excelente catálogo de propiedades para ti
              </p>
              <Button variant="outline" className="hover:scale-105 transition-transform bg-transparent">
                Notificarme cuando estén disponibles
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
              <h3 className="text-3xl font-bold mb-4">¿Buscas una Propiedad?</h3>
              <p className="text-muted-foreground">Cuéntanos qué necesitas y te ayudaremos a encontrarla</p>
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
                <contact.icon className="w-5 h-5 inmobiliaria-verde" />
                <span>{contact.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
