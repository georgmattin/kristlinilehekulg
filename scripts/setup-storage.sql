-- Create storage bucket for product files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-files', 'product-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for product files
DROP POLICY IF EXISTS "Public can view product files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product files" ON storage.objects;

CREATE POLICY "Anyone can view product files" ON storage.objects
FOR SELECT USING (bucket_id = 'product-files');

CREATE POLICY "Anyone can upload product files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-files');

CREATE POLICY "Anyone can update product files" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-files');

CREATE POLICY "Anyone can delete product files" ON storage.objects
FOR DELETE USING (bucket_id = 'product-files');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for product images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
