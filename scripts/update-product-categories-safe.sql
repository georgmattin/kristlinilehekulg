-- Safely update product categories
-- First, update existing products to use new categories where possible
UPDATE products SET category = 'Free guides' WHERE category = 'Templates' AND is_free = true;
UPDATE products SET category = 'Templates' WHERE category = 'Templates' AND is_free = false;
UPDATE products SET category = 'Planners' WHERE category = 'Planners';
UPDATE products SET category = 'Workbooks' WHERE category = 'Design';

-- Now safely delete existing products (this handles foreign key constraints)
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Insert new products with the requested categories
INSERT INTO products (title, description, price, original_price, category, featured, rating, downloads, is_free, download_file_url, image_url, stripe_price_id, status) VALUES 

-- Free guides
('Social Media Strategy Guide', 'Complete guide to building your social media presence from scratch', 0.00, null, 'Free guides', true, 4.9, 1247, true, 'https://example.com/social-media-guide.pdf', '/placeholder.svg?height=300&width=300', null, 'active'),
('Content Creation Basics', 'Learn the fundamentals of creating engaging content for your audience', 0.00, null, 'Free guides', false, 4.7, 892, true, 'https://example.com/content-basics.pdf', '/placeholder.svg?height=300&width=300', null, 'active'),
('Instagram Growth Secrets', 'Proven strategies to grow your Instagram following organically', 0.00, null, 'Free guides', true, 4.8, 1534, true, 'https://example.com/instagram-growth.pdf', '/placeholder.svg?height=300&width=300', null, 'active'),

-- Planners
('Content Calendar Planner', 'Monthly content planning template to organize your social media posts', 15.00, 25.00, 'Planners', true, 4.9, 456, false, null, '/placeholder.svg?height=300&width=300', 'price_content_planner', 'active'),
('Business Goal Tracker', 'Track and achieve your business goals with this comprehensive planner', 22.00, null, 'Planners', false, 4.8, 234, false, null, '/placeholder.svg?height=300&width=300', 'price_goal_tracker', 'active'),
('Social Media Audit Planner', 'Analyze and improve your social media performance with this detailed planner', 18.00, 30.00, 'Planners', false, 4.7, 189, false, null, '/placeholder.svg?height=300&width=300', 'price_audit_planner', 'active'),

-- Templates
('Instagram Story Templates Pack', '50 beautiful Instagram story templates for your brand', 35.00, 50.00, 'Templates', true, 4.9, 789, false, null, '/placeholder.svg?height=300&width=300', 'price_story_templates', 'active'),
('Social Media Post Templates', 'Ready-to-use templates for Facebook, Instagram, and LinkedIn posts', 28.00, null, 'Templates', true, 4.8, 567, false, null, '/placeholder.svg?height=300&width=300', 'price_post_templates', 'active'),
('Email Newsletter Templates', 'Professional email templates to engage your subscribers', 25.00, 40.00, 'Templates', false, 4.7, 345, false, null, '/placeholder.svg?height=300&width=300', 'price_email_templates', 'active'),
('Brand Identity Template Kit', 'Complete brand identity templates including logos, colors, and fonts', 45.00, null, 'Templates', false, 4.9, 234, false, null, '/placeholder.svg?height=300&width=300', 'price_brand_kit', 'active'),

-- Workbooks
('Social Media Marketing Workbook', 'Step-by-step workbook to master social media marketing', 32.00, 45.00, 'Workbooks', true, 4.8, 423, false, null, '/placeholder.svg?height=300&width=300', 'price_marketing_workbook', 'active'),
('Content Strategy Workbook', 'Develop your content strategy with exercises and templates', 28.00, null, 'Workbooks', false, 4.7, 312, false, null, '/placeholder.svg?height=300&width=300', 'price_strategy_workbook', 'active'),
('Brand Building Workbook', 'Build a strong personal or business brand with this comprehensive workbook', 38.00, 55.00, 'Workbooks', false, 4.9, 267, false, null, '/placeholder.svg?height=300&width=300', 'price_brand_workbook', 'active');
