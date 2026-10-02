-- Insert default system categories
INSERT INTO categories (user_id, name, color, is_system) VALUES
(NULL, 'Food & Dining', '#FF6B6B', TRUE),
(NULL, 'Transportation', '#4ECDC4', TRUE),
(NULL, 'Shopping', '#45B7D1', TRUE),
(NULL, 'Entertainment', '#FFA07A', TRUE),
(NULL, 'Utilities', '#98D8C8', TRUE),
(NULL, 'Health & Fitness', '#F7DC6F', TRUE),
(NULL, 'Travel', '#BB8FCE', TRUE),
(NULL, 'Subscriptions', '#85C1E2', TRUE),
(NULL, 'Work', '#52C4A3', TRUE),
(NULL, 'Personal', '#FFB6C1', TRUE);

-- Insert default subcategories for Food & Dining
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Restaurants' FROM categories WHERE name = 'Food & Dining' AND is_system = TRUE LIMIT 1;
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Groceries' FROM categories WHERE name = 'Food & Dining' AND is_system = TRUE LIMIT 1;
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Coffee & Tea' FROM categories WHERE name = 'Food & Dining' AND is_system = TRUE LIMIT 1;

-- Insert default subcategories for Transportation
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Gas' FROM categories WHERE name = 'Transportation' AND is_system = TRUE LIMIT 1;
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Public Transit' FROM categories WHERE name = 'Transportation' AND is_system = TRUE LIMIT 1;
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Rideshare' FROM categories WHERE name = 'Transportation' AND is_system = TRUE LIMIT 1;

-- Insert default subcategories for Shopping
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Clothing' FROM categories WHERE name = 'Shopping' AND is_system = TRUE LIMIT 1;
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Electronics' FROM categories WHERE name = 'Shopping' AND is_system = TRUE LIMIT 1;
INSERT INTO subcategories (category_id, user_id, name)
SELECT id, NULL, 'Home & Garden' FROM categories WHERE name = 'Shopping' AND is_system = TRUE LIMIT 1;
