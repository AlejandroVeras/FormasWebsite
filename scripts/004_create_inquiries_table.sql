-- Crear tabla de consultas/leads para la inmobiliaria
CREATE TABLE IF NOT EXISTS public.property_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'en_proceso', 'completado', 'cerrado')),
  response TEXT, -- Respuesta del agente
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de interacciones/historial para seguimiento de leads
CREATE TABLE IF NOT EXISTS public.inquiry_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES public.property_inquiries(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email_sent', 'phone_call', 'meeting', 'note', 'status_change')),
  description TEXT NOT NULL,
  details JSONB, -- Información adicional (email content, call duration, etc.)
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_interactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consultas de propiedades
-- Los usuarios autenticados pueden ver todas las consultas
CREATE POLICY "inquiries_authenticated_select" 
  ON public.property_inquiries FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Solo usuarios autenticados pueden insertar consultas (para formularios admin)
CREATE POLICY "inquiries_authenticated_insert" 
  ON public.property_inquiries FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Solo usuarios autenticados pueden actualizar consultas
CREATE POLICY "inquiries_authenticated_update" 
  ON public.property_inquiries FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para interacciones
CREATE POLICY "interactions_authenticated_all" 
  ON public.inquiry_interactions FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.property_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.property_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.property_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_interactions_inquiry_id ON public.inquiry_interactions(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON public.inquiry_interactions(type);

-- Trigger para actualizar updated_at en consultas
CREATE TRIGGER update_inquiries_updated_at 
  BEFORE UPDATE ON public.property_inquiries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear interacción automática cuando cambia el estado
CREATE OR REPLACE FUNCTION public.track_inquiry_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si el estado cambió, crear una interacción
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.inquiry_interactions (
      inquiry_id,
      type,
      description,
      details,
      created_by
    ) VALUES (
      NEW.id,
      'status_change',
      'Estado cambiado de "' || OLD.status || '" a "' || NEW.status || '"',
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      ),
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para rastrear cambios de estado
CREATE TRIGGER track_inquiry_status_changes
  AFTER UPDATE ON public.property_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.track_inquiry_status_change();