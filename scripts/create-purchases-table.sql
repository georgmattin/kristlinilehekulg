-- Create purchases table to track all purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  download_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_purchases_session ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product_id);

-- Add download_file_url to products table for paid products
ALTER TABLE products ADD COLUMN IF NOT EXISTS download_file_url_paid TEXT;
