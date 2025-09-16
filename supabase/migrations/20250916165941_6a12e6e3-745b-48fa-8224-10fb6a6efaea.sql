-- Add featured flag to advertisements table
ALTER TABLE public.advertisements 
ADD COLUMN featured BOOLEAN NOT NULL DEFAULT false;

-- Create index for better performance when filtering featured ads
CREATE INDEX idx_advertisements_featured ON public.advertisements(featured) WHERE featured = true;