-- 1. Create Tables
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live2d_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client TEXT,
    type TEXT,
    image_url TEXT NOT NULL,
    video_url TEXT,
    model_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    rating INTEGER DEFAULT 5,
    year TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    genre TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    tech JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'In Development',
    year TEXT,
    players TEXT DEFAULT 'Single Player',
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photo_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    material TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add model_url if missing (for existing tables)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='live2d_models' AND column_name='model_url') THEN
        ALTER TABLE live2d_models ADD COLUMN model_url TEXT;
    END IF;
END $$;

-- 3. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('photos', 'photos', true),
  ('live2d-images', 'live2d-images', true),
  ('live2d-videos', 'live2d-videos', true),
  ('live2d-models', 'live2d-models', true),
  ('games', 'games', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE live2d_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Public Read)
DO $$
BEGIN
    -- Photos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for photos') THEN
        CREATE POLICY "Public Access for photos" ON photos FOR SELECT TO public USING (true);
    END IF;
    -- Live2D
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for live2d_models') THEN
        CREATE POLICY "Public Access for live2d_models" ON live2d_models FOR SELECT TO public USING (true);
    END IF;
    -- Games
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for games') THEN
        CREATE POLICY "Public Access for games" ON games FOR SELECT TO public USING (true);
    END IF;
    -- Settings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for site_settings') THEN
        CREATE POLICY "Public Access for site_settings" ON site_settings FOR SELECT TO public USING (true);
    END IF;
    -- Inventory
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for photo_inventory') THEN
        CREATE POLICY "Public Access for photo_inventory" ON photo_inventory FOR SELECT TO public USING (true);
    END IF;
    -- Orders
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for orders') THEN
        CREATE POLICY "Public Access for orders" ON orders FOR SELECT TO public USING (true);
    END IF;
END $$;

-- 6. Storage Policies (Public Read)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for photos bucket') THEN
        CREATE POLICY "Public Access for photos bucket" ON storage.objects FOR SELECT TO public USING (bucket_id = 'photos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for live2d-images bucket') THEN
        CREATE POLICY "Public Access for live2d-images bucket" ON storage.objects FOR SELECT TO public USING (bucket_id = 'live2d-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for live2d-videos bucket') THEN
        CREATE POLICY "Public Access for live2d-videos bucket" ON storage.objects FOR SELECT TO public USING (bucket_id = 'live2d-videos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for live2d-models bucket') THEN
        CREATE POLICY "Public Access for live2d-models bucket" ON storage.objects FOR SELECT TO public USING (bucket_id = 'live2d-models');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for games bucket') THEN
        CREATE POLICY "Public Access for games bucket" ON storage.objects FOR SELECT TO public USING (bucket_id = 'games');
    END IF;
END $$;

-- 7. Insert Default Settings
INSERT INTO site_settings (key, value)
VALUES 
  ('admin_password', 'admin123'),
  ('gamedev_enabled', 'true')
ON CONFLICT (key) DO NOTHING;
