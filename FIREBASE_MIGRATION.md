# Migración de Supabase a Firebase

Esta plataforma ha sido migrada completamente de Supabase a Firebase. Este documento explica cómo configurar y usar Firebase.

## Configuración de Firebase

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita los siguientes servicios:
   - **Firestore Database** (para la base de datos)
   - **Authentication** (para la autenticación)
   - **Storage** (para almacenar imágenes)

### 2. Configurar Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Crea la base de datos en modo de producción
3. Establece las reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties collection - público para lectura de propiedades disponibles
    match /properties/{propertyId} {
      allow read: if request.resource.data.status == 'disponible';
      allow write: if request.auth != null;
    }
    
    // Property inquiries - solo lectura/escritura autenticada
    match /property_inquiries/{inquiryId} {
      allow read, write: if request.auth != null;
    }
    
    // Inquiry interactions - solo lectura/escritura autenticada
    match /inquiry_interactions/{interactionId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin profiles - solo el usuario propietario
    match /admin_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Site settings - solo lectura/escritura autenticada
    match /site_settings/{settingId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Configurar Authentication

1. En Firebase Console, ve a **Authentication**
2. Habilita el método de autenticación **Email/Password**
3. (Opcional) Configura dominios autorizados

### 4. Configurar Storage

1. En Firebase Console, ve a **Storage**
2. Crea un bucket de almacenamiento
3. Establece reglas de seguridad:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties-images/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 4.1. Habilitar Storage SIN tarjeta (Plan Spark)

Si al habilitar Storage te pide obligatoriamente pasar a Blaze, revisa esto:

1. Asegúrate de habilitarlo desde **Firebase Console** (Build → Storage → Get started), y no desde **Google Cloud Console**.
2. Verifica que el proyecto esté en **Plan Spark** (Project Settings → Usage and billing).
3. Evita cualquier feature que obliga Blaze:
   - Cloud Functions con triggers de Storage (`onFinalize`, `onUpload`).
   - Extensiones de Firebase (por ejemplo, Image Resize) que usan Cloud Functions.
   - Configuraciones avanzadas del bucket en Google Cloud (retención, versionado, lifecycle policies).
4. Si tu proyecto pertenece a una organización con políticas que exigen billing, crea un **proyecto Firebase personal** (Propietario individual) y habilita Storage desde ahí sin tarjeta.
5. Elige la ubicación del bucket desde Firebase Console (por ejemplo `us-central1` o `europe-west1`).

Reglas recomendadas (siguen válidas en Spark; restringen escritura a imágenes y no permiten listados):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties-images/{fileName} {
      allow read: if true; // lectura pública de imágenes
      allow write: if request.auth != null
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 5. Obtener credenciales

1. Ve a **Project Settings** > **General**
2. En "Your apps", haz clic en el ícono de web `</>`
3. Copia las credenciales de configuración

### 6. Configurar variables de entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin Config (para servidor)
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_CLIENT_EMAIL=tu_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
```

### 7. Obtener credenciales del Service Account (Admin SDK)

1. Ve a **Project Settings** > **Service Accounts**
2. Haz clic en **Generate New Private Key**
3. Guarda el archivo JSON
4. Extrae los valores necesarios:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (mantén las comillas y los `\n`)

## Estructura de Datos en Firestore

Las siguientes colecciones deben crearse en Firestore:

### 1. `properties`
```typescript
{
  id: string (document ID)
  title: string
  description: string | null
  price: number
  property_type: 'casa' | 'apartamento' | 'local' | 'terreno' | 'oficina'
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number | null
  address: string
  city: string
  country: string (default: 'República Dominicana')
  status: 'disponible' | 'vendido' | 'alquilado' | 'reservado'
  operation_type: 'venta' | 'alquiler'
  images: string[] (URLs de Firebase Storage)
  features: string[]
  created_at: Timestamp
  updated_at: Timestamp
  created_by: string | null (user ID)
  featured: boolean (opcional)
  featured_order: number | null (opcional)
}
```

### 2. `property_inquiries`
```typescript
{
  id: string (document ID)
  property_id: string | null
  name: string
  email: string
  phone: string | null
  message: string
  status: 'nuevo' | 'en_proceso' | 'completado' | 'cerrado'
  response: string | null
  responded_at: Timestamp | null
  responded_by: string | null (user ID)
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 3. `inquiry_interactions`
```typescript
{
  id: string (document ID)
  inquiry_id: string
  type: 'email_sent' | 'phone_call' | 'meeting' | 'note' | 'status_change'
  description: string
  details: object (JSON)
  created_by: string | null (user ID)
  created_at: Timestamp
}
```

### 4. `admin_profiles`
```typescript
{
  id: string (document ID = user ID)
  full_name: string | null
  role: 'admin' | 'super_admin'
  company: string (default: 'Formas Inmobiliaria')
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 5. `site_settings`
```typescript
{
  id: string (document ID)
  key: string (unique)
  value: string (JSON stringified)
  category: 'contact' | 'seo' | 'social' | 'general'
  description: string | null
  created_at: Timestamp
  updated_at: Timestamp
  updated_by: string | null (user ID)
}
```

## Migración de Datos

Si necesitas migrar datos existentes de Supabase a Firebase:

1. Exporta los datos de Supabase (puedes usar scripts SQL o la API)
2. Convierte los datos al formato de Firestore
3. Importa los datos usando la consola de Firebase o scripts de migración

## Notas Importantes

- **Timestamps**: Firestore usa Timestamp en lugar de strings ISO. El código maneja la conversión automáticamente.
- **IDs**: Firestore genera IDs automáticamente, pero puedes usar UUIDs si prefieres mantener consistencia.
- **Queries complejas**: Firestore tiene limitaciones en queries complejas comparado con SQL. Algunas consultas pueden necesitar ajustes.
- **Paginación**: Firestore usa `startAfter` en lugar de `offset` para paginación.

## Soporte

Para problemas o preguntas sobre la migración, revisa:
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Firestore](https://firebase.google.com/docs/firestore)
- [Authentication de Firebase](https://firebase.google.com/docs/auth)


## Notas sobre Storage en Spark

- Habilítalo siempre desde Firebase Console (Build → Storage → Get started).
- Mantén el proyecto en Plan Spark; evita Cloud Functions, Extensiones o configuraciones avanzadas del bucket.
- Usa las reglas incluidas arriba para permitir lectura pública de imágenes y escritura sólo autenticada.


