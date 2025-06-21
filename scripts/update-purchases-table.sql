-- Add payment intent ID column to track payments better
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Add index for payment intent lookups
CREATE INDEX IF NOT EXISTS idx_purchases_payment_intent ON purchases(stripe_payment_intent_id);

-- Update status enum to include new statuses
ALTER TABLE purchases ALTER COLUMN status TYPE TEXT;
