-- Crear tabla de perfiles de administradores
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  company TEXT NOT NULL DEFAULT 'Formas Inmobiliaria',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfiles de admin
CREATE POLICY "admin_profiles_select_own" 
  ON public.admin_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "admin_profiles_insert_own" 
  ON public.admin_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admin_profiles_update_own" 
  ON public.admin_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Función para crear perfil de admin automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'admin'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_admin_user_created ON auth.users;
CREATE TRIGGER on_auth_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin_user();

-- Trigger para actualizar updated_at en admin_profiles
CREATE TRIGGER update_admin_profiles_updated_at 
  BEFORE UPDATE ON public.admin_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
