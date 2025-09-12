import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "sonner"
import './globals.css'

export const metadata: Metadata = {
  title: 'FORMAS Inmobiliaria - Tu hogar ideal en Santiago',
  description: 'Encuentra la propiedad perfecta en Santiago. FORMAS Inmobiliaria ofrece casas, apartamentos y locales comerciales en venta y alquiler con la confianza del Grupo Formas.',
  keywords: 'inmobiliaria santiago, casas en venta santiago, apartamentos alquiler santiago, propiedades república dominicana, formas inmobiliaria',
  openGraph: {
    title: 'FORMAS Inmobiliaria - Tu hogar ideal en Santiago',
    description: 'Encuentra la propiedad perfecta en Santiago. Venta y alquiler de propiedades con la confianza del Grupo Formas.',
    type: 'website',
    locale: 'es_DO',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Toaster />
        <Sonner />
        <Analytics />
      </body>
    </html>
  )
}
