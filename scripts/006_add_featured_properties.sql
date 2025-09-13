-- Add featured column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add featured order column for ordering featured properties
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT NULL;

-- Create index for featured properties
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured, featured_order);

-- Update RLS policies to allow admin users to manage featured properties
-- Allow authenticated users to see all properties for admin purposes
CREATE POLICY "properties_admin_select" 
  ON public.properties FOR SELECT 
  USING (auth.uid() IS NOT NULL);