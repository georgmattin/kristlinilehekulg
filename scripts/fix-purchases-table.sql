-- Add missing stripe_payment_intent_id column to purchases table
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_purchases_payment_intent ON purchases(stripe_payment_intent_id);

-- Update the table comment for documentation
COMMENT ON TABLE purchases IS 'Tracks all customer purchases with Stripe integration';
COMMENT ON COLUMN purchases.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for tracking payment status'; 