-- Remove fake/test Stripe Price IDs that don't exist in Stripe
-- These were created during testing and cause checkout failures

-- List of fake Price IDs to remove
UPDATE products 
SET stripe_price_id = NULL, updated_at = NOW()
WHERE stripe_price_id IN (
  'price_content_planner',
  'price_goal_tracker', 
  'price_audit_planner',
  'price_story_templates',
  'price_post_templates',
  'price_email_templates',
  'price_brand_kit',
  'price_marketing_workbook',
  'price_strategy_workbook',
  'price_brand_workbook',
  'price_1234567890',
  'price_1234567891',
  'price_1234567892',
  'price_1234567893'
);

-- Show updated products
SELECT id, title, price, stripe_price_id 
FROM products 
WHERE stripe_price_id IS NULL AND is_free = false
ORDER BY title; 