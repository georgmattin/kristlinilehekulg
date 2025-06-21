-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  image_url TEXT,
  stripe_price_id TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  rating DECIMAL(2,1) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add custom_link column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_link TEXT;

-- Create site_content table for managing all website content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site content
INSERT INTO site_content (section, content) VALUES 
('hero', '{
  "title": "Digital Tools For Your Brand",
  "subtitle": "Discover my handcrafted digital products that help you stand out on social media. All products are tested and used in my own videos and content creation!",
  "cta_primary": "Shop Products",
  "cta_secondary": "Watch Video"
}'),
('about', '{
  "title": "Hi, I''m Sarah! 👋",
  "description": "I''m a content creation enthusiast who loves helping others develop their brands. My digital products are born from years of experience in social media marketing and design.",
  "description2": "All my products are tested and used in my own videos and social media accounts. I believe that quality tools help you focus on what matters most - creating amazing content!",
  "badges": ["Instagram Expert", "Content Creator", "Digital Designer"]
}'),
('newsletter', '{
  "title": "Be First to Know About New Products! 💌",
  "description": "Join my newsletter and get free templates plus exclusive content"
}')
ON CONFLICT (section) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, price, original_price, category, featured, rating, downloads, stripe_price_id) VALUES 
('Instagram Story Templates', '25 beautiful Instagram story templates to help you stand out', 18.00, 30.00, 'Templates', true, 4.9, 234, 'price_1234567890'),
('Content Planning Kit', 'Complete planning toolkit for social media content creation', 35.00, null, 'Planners', true, 5.0, 156, 'price_1234567891'),
('Brand Colors Palette', 'Professional color palettes for your brand identity', 15.00, null, 'Design', false, 4.8, 89, 'price_1234567892'),
('Video Editing Presets', '20 beautiful video filters and effects for content creation', 28.00, null, 'Video', false, 4.9, 178, 'price_1234567893')
ON CONFLICT DO NOTHING;
