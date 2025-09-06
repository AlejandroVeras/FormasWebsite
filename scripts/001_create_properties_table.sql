-- Crear tabla de propiedades para la inmobiliaria
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('casa', 'apartamento', 'local', 'terreno', 'oficina')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_m2 DECIMAL(8,2),
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Santiago',
  country TEXT NOT NULL DEFAULT 'República Dominicana',
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'vendido', 'alquilado', 'reservado')),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('venta', 'alquiler')),
  images TEXT[], -- Array de URLs de imágenes
  features TEXT[], -- Array de características (piscina, garaje, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para propiedades
-- Cualquiera puede ver propiedades disponibles (para la página pública)
CREATE POLICY "properties_public_select" 
  ON public.properties FOR SELECT 
  USING (status = 'disponible');

-- Solo usuarios autenticados pueden insertar propiedades
CREATE POLICY "properties_authenticated_insert" 
  ON public.properties FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Solo el creador puede actualizar sus propiedades
CREATE POLICY "properties_owner_update" 
  ON public.properties FOR UPDATE 
  USING (auth.uid() = created_by);

-- Solo el creador puede eliminar sus propiedades
CREATE POLICY "properties_owner_delete" 
  ON public.properties FOR DELETE 
  USING (auth.uid() = created_by);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_operation ON public.properties(operation_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON public.properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
