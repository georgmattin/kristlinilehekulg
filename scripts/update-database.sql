-- Add social media links table
CREATE TABLE IF NOT EXISTS social_media_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default social media links
INSERT INTO social_media_links (platform, url) VALUES 
('instagram', 'https://instagram.com'),
('youtube', 'https://youtube.com'),
('tiktok', 'https://tiktok.com'),
('x', 'https://x.com')
ON CONFLICT (platform) DO NOTHING;

-- Add newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

-- Add free product downloads table
CREATE TABLE IF NOT EXISTS free_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  download_link TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Add columns to products table for free products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS download_file_url TEXT;

-- Update existing products to be paid by default
UPDATE products SET is_free = false WHERE is_free IS NULL;
