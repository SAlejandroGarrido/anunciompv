-- Create public storage bucket for advertisements and policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'advertisements') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('advertisements', 'advertisements', true);
  END IF;
END $$;

-- Public read access for the advertisements bucket
DROP POLICY IF EXISTS "Public read for advertisements" ON storage.objects;
CREATE POLICY "Public read for advertisements"
ON storage.objects
FOR SELECT
USING (bucket_id = 'advertisements');

-- Authenticated users can upload to their own folder (top-level folder = user id)
DROP POLICY IF EXISTS "Users can upload to own folder (advertisements)" ON storage.objects;
CREATE POLICY "Users can upload to own folder (advertisements)"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'advertisements'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Authenticated users can update their own files
DROP POLICY IF EXISTS "Users can update own files (advertisements)" ON storage.objects;
CREATE POLICY "Users can update own files (advertisements)"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'advertisements'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Authenticated users can delete their own files
DROP POLICY IF EXISTS "Users can delete own files (advertisements)" ON storage.objects;
CREATE POLICY "Users can delete own files (advertisements)"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'advertisements'
  AND auth.uid()::text = (storage.foldername(name))[1]
);