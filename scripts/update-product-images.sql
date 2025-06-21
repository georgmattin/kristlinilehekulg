-- Update products with proper image URLs
UPDATE products SET image_url = '/social-media-guide.jpg' WHERE title = 'Social Media Strategy Guide';
UPDATE products SET image_url = '/content-basics.jpg' WHERE title = 'Content Creation Basics';
UPDATE products SET image_url = '/instagram-growth.jpg' WHERE title = 'Instagram Growth Secrets';
UPDATE products SET image_url = '/content-planner.jpg' WHERE title = 'Content Calendar Planner';
UPDATE products SET image_url = '/goal-tracker.jpg' WHERE title = 'Business Goal Tracker';
UPDATE products SET image_url = '/audit-planner.jpg' WHERE title = 'Social Media Audit Planner';
UPDATE products SET image_url = '/story-templates.jpg' WHERE title = 'Instagram Story Templates Pack';
UPDATE products SET image_url = '/post-templates.jpg' WHERE title = 'Social Media Post Templates';
UPDATE products SET image_url = '/email-templates.jpg' WHERE title = 'Email Newsletter Templates';
UPDATE products SET image_url = '/brand-kit.jpg' WHERE title = 'Brand Identity Template Kit';
UPDATE products SET image_url = '/marketing-workbook.jpg' WHERE title = 'Social Media Marketing Workbook';
UPDATE products SET image_url = '/strategy-workbook.jpg' WHERE title = 'Content Strategy Workbook';
UPDATE products SET image_url = '/brand-workbook.jpg' WHERE title = 'Brand Building Workbook';

-- Remove featured status from all products
UPDATE products SET featured = false;
