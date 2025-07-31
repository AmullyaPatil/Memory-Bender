-- Create storage bucket for memory images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memory-images', 'memory-images', true);

-- Create storage policies for memory images
CREATE POLICY "Users can view memory images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'memory-images');

CREATE POLICY "Users can upload their own memory images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'memory-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own memory images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'memory-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own memory images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'memory-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);