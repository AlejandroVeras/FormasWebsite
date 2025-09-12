-- Crear tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para configuración del sitio
-- Solo usuarios autenticados pueden ver y modificar configuraciones
CREATE POLICY "settings_authenticated_all" 
  ON public.site_settings FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.site_settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON public.site_settings(category);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON public.site_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuraciones por defecto
INSERT INTO public.site_settings (key, value, category, description) VALUES
  ('company_name', '"Formas Inmobiliaria"', 'contact', 'Nombre de la empresa'),
  ('company_phone', '"+1 (809) 555-0123"', 'contact', 'Teléfono principal'),
  ('company_email', '"info@formas.com"', 'contact', 'Email de contacto'),
  ('company_address', '"Santiago, República Dominicana"', 'contact', 'Dirección de la empresa'),
  ('company_description', '"Tu socio de confianza en bienes raíces"', 'contact', 'Descripción breve'),
  
  -- SEO
  ('site_title', '"Formas Inmobiliaria - Propiedades en Santiago"', 'seo', 'Título del sitio web'),
  ('site_description', '"Encuentra tu hogar ideal en Santiago. Venta y alquiler de casas, apartamentos y locales comerciales."', 'seo', 'Descripción meta del sitio'),
  ('site_keywords', '"inmobiliaria, propiedades, Santiago, República Dominicana, casas, apartamentos"', 'seo', 'Palabras clave'),
  
  -- Redes sociales
  ('social_facebook', '""', 'social', 'URL de Facebook'),
  ('social_instagram', '""', 'social', 'URL de Instagram'),
  ('social_twitter', '""', 'social', 'URL de Twitter'),
  ('social_linkedin', '""', 'social', 'URL de LinkedIn'),
  ('social_whatsapp', '"+1 (809) 555-0123"', 'social', 'Número de WhatsApp'),
  
  -- Configuraciones generales
  ('featured_properties_limit', '6', 'general', 'Número de propiedades destacadas a mostrar'),
  ('currency', '"DOP"', 'general', 'Moneda principal'),
  ('timezone', '"America/Santo_Domingo"', 'general', 'Zona horaria')
ON CONFLICT (key) DO NOTHING;