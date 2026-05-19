-- Create storage bucket for hotel booking payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('hotel-bookings', 'hotel-bookings', false)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow anyone to upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hotel-bookings');

-- Create policy to allow authenticated users to read their own files
CREATE POLICY "Allow users to read payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotel-bookings');
