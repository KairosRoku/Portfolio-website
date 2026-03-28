-- 1. Add model_url column to live2d_models
ALTER TABLE live2d_models 
ADD COLUMN IF NOT EXISTS model_url TEXT;

-- 2. Create bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('live2d-models', 'live2d-models', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for live2d-models'
    ) THEN
        CREATE POLICY "Public Access for live2d-models" ON storage.objects
        FOR SELECT TO public USING (bucket_id = 'live2d-models');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Upload to live2d-models'
    ) THEN
        CREATE POLICY "Authenticated Upload to live2d-models" ON storage.objects
        FOR INSERT TO authenticated WITH CHECK (bucket_id = 'live2d-models');
    END IF;
END $$;

-- 4. Set default admin password if it doesn't exist
INSERT INTO site_settings (key, value)
VALUES ('admin_password', 'admin123')
ON CONFLICT (key) DO NOTHING;
