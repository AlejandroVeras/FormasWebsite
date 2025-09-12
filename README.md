# FORMAS Website

Sitio web corporativo del Grupo Formas con módulos de Inmobiliaria, Constructora y Estructuras Metálicas.

## Características

### 🏠 Módulo Inmobiliario
- **Páginas individuales de propiedades** con diseño profesional
- **Sistema de búsqueda y filtrado avanzado** por tipo, precio, ubicación, etc.
- **Formularios de contacto integrados** que se conectan con el sistema de leads
- **Gestión completa de propiedades** a través del panel administrativo
- **SEO optimizado** con metadata dinámica y datos estructurados

### 🏗️ Módulo Constructora
- Portafolio de proyectos de construcción
- Información de servicios especializados

### 🔧 Módulo Estructuras Metálicas
- Catálogo de productos y servicios
- Proyectos especializados en estructuras metálicas

## Tecnologías

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Supabase** para base de datos y autenticación
- **Radix UI** para componentes accesibles
- **Lucide React** para iconografía

## Configuración del Proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ejecuta los scripts SQL en la carpeta `scripts/` para crear las tablas:
   - `001_create_properties_table.sql`
   - `002_create_admin_profiles.sql`
   - `003_seed_sample_properties.sql`
   - `004_create_inquiries_table.sql`
   - `005_create_site_settings.sql`

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Construir para producción

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
├── app/                    # Rutas de la aplicación (App Router)
│   ├── inmobiliaria/      # Módulo inmobiliario
│   │   ├── propiedades/   # Listado y páginas individuales
│   │   └── page.tsx       # Página principal inmobiliaria
│   ├── admin/             # Panel administrativo
│   ├── api/               # API routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   └── contact-form.tsx  # Formulario de contacto
├── lib/                  # Utilidades y configuraciones
│   └── supabase/         # Cliente Supabase
├── scripts/              # Scripts SQL para base de datos
└── public/               # Archivos estáticos
```

## Funcionalidades Principales

### Panel Administrativo

Accede a `/admin/login` para gestionar:
- **Propiedades**: Crear, editar y eliminar propiedades
- **Consultas**: Gestionar leads y comunicación con clientes
- **Configuración**: Ajustes del sitio web

### Búsqueda Avanzada

El sistema permite filtrar propiedades por:
- Tipo de propiedad (casa, apartamento, local, etc.)
- Tipo de operación (venta, alquiler)
- Rango de precios
- Número de habitaciones y baños
- Ubicación
- Búsqueda por texto libre

### SEO y Performance

- **Metadata dinámica** para cada propiedad
- **Datos estructurados** (JSON-LD) para mejor indexación
- **Sitemap automático** generado dinámicamente
- **Optimización de imágenes** con Next.js Image
- **Estados de carga** para mejor UX

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto es propiedad del Grupo Formas.