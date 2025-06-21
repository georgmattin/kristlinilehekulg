-- Create social media links table
CREATE TABLE IF NOT EXISTS social_media_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert social media links
INSERT INTO social_media_links (platform, url) VALUES
  ('instagram', 'https://instagram.com/fyzendigital'),
  ('youtube', 'https://youtube.com/@Fyzen-u2p'),
  ('tiktok', 'https://tiktok.com/@fyzendigital')
ON CONFLICT (platform) DO UPDATE SET
  url = EXCLUDED.url,
  updated_at = CURRENT_TIMESTAMP;

-- Enable RLS (Row Level Security)
ALTER TABLE social_media_links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON social_media_links
  FOR SELECT USING (true); 