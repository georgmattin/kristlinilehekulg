-- Add some sample free products
INSERT INTO products (title, description, price, category, featured, rating, downloads, is_free, download_file_url, image_url) VALUES 
('Free Instagram Story Template', 'Beautiful free Instagram story template to get you started', 0.00, 'Templates', false, 4.7, 45, true, 'https://example.com/free-template.zip', '/placeholder.svg?height=300&width=300'),
('Free Content Planner', 'Simple weekly content planning template - completely free', 0.00, 'Planners', true, 4.8, 78, true, 'https://example.com/free-planner.pdf', '/placeholder.svg?height=300&width=300'),
('Free Color Palette Guide', 'Essential color combinations for your brand - free download', 0.00, 'Design', false, 4.6, 32, true, 'https://example.com/free-colors.pdf', '/placeholder.svg?height=300&width=300')
ON CONFLICT DO NOTHING;
