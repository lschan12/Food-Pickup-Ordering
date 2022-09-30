-- Dishes table seeds

INSERT INTO dishes (name, category_id, photo_url, price, prep_time, description, rating) VALUES
-- Pizza
('Bacon Perogie', 1, 'https://i.imgur.com/65ui53D.png', 2299, 35, 'Sour cream, bacon, Ruby Gem Potatoes, pizza mozzarella, cheddar, green onions, and a dollop of sour cream.', 4.6),
('Smoked Thai Hawaiian', 1, 'https://i.imgur.com/7jfNAIa.png', 1899, 35, 'Sweet Thai honey garlic, Gouda, provolone, Parmesan, pizza mozzarella, red onions, smoked prosciutto, bacon, pineapple, and toasted sesame seeds.', 3.7),
('Pepperoni Recursion', 1, 'https://i.imgur.com/o2XV4UV.png', 1699, 30, 'Enough pepperoni to risk a stack overflow.  You''ve been warned.', 4.9),
('The Primagen', 1, 'https://i.imgur.com/s1Ze7Oj.png', 2199, 35, 'Signature pizza sauce, pizza mozzarella, pepperoni, smoked ham, green peppers, and fresh mushrooms.', 4.3),
('Bourbon BBQ Pulled Pork', 1, 'https://i.imgur.com/WpRWh7q.png', 2499, 35, 'House‑made Bourbon BBQ sauce on smoked pulled pork, balsamic‑roasted red onions, mozza, cheddar, and bacon.', 4.3),

-- Pasta
('Rocky Mountain Spaghetti & Meatballs', 2, 'https://i.imgur.com/t1cYAYr.png', 1649, 45, 'A mountainous serving of spaghetti smothered in Bolognese sauce, then topped with three meatballs, cheddar, and Parmesan.', 4.0),
('Parmesan Shrimp Rigatorie', 2, 'https://i.imgur.com/kWXbsSw.png', 1949, 45, 'Garlic sautéed shrimp tossed with spaghetti in a Parmesan white wine Alfredo sauce with fresh spinach and cherry tomatoes. Finished with Parmesan and a zest of lime.', 4.4),
('Full Stack Ravioli', 2, 'https://i.imgur.com/6mv0Dtu.png', 1449, 45, 'Ravioli stuffed with a full stack of cheeses: Parmesan, Emmental, ricotta, fontina, Romano, mozzarella and premium aged cheddar.', 3.8),
('Tuscan Shrimp Fettuccini', 2, 'https://i.imgur.com/Ht0n5zD.png', 2149, 45, 'Grilled chicken breast, shrimp, spicy Italian sausage, tomatoes, green peppers, green onions, Cajun seasoning, and marinara sauce.', 4.4),

-- Sandwiches
('Crunchy Chicken Noodle Wrap', 3, 'https://i.imgur.com/xZLq6pa.png', 1349, 25, 'Chicken breast, lettuce, red onions, carrots, cilantro, mayo, and crunchy Asian noodles, tossed in our custom J-to-the-Query sauce.', 4.4),
('Nested Bacon Burger', 3, 'https://i.imgur.com/9lNlxo5.png', 1649, 20, 'This burger may have a long runtime, but with two quarter-pound patties marinated in BBQ sauce, grilled to perfection and nested with loads of bacon, cheddar, lettuce, tomatoes, red onions, pickles, on a brioche bun - you won''t mind.', 4.9),
('Louisiana Chicken Sandwich', 3, 'https://i.imgur.com/vbEsjpV.png', 1549, 25, 'Buttermilk-breaded fried chicken breast tossed in Louisiana hot sauce, deep fried breaded jalapenos peppers, cheddar, bacon, ranch dressing, on a brioche bun.', 4.4),
('Lighthouse Signature Steak Sandwich', 3, 'https://i.imgur.com/IlTMQ63.png', 1849, 40, 'Today''s stretch goal: Enjoy 7 ounces of sliced, aged Canadian AAA New York seasoned steak, charbroiled to perfection. Served on a slice of garlic toast.', 4.4),
('MPJ''s Fun Fun Tacos', 3, 'https://i.imgur.com/Xo0qp7u.png', 1249, 30, 'Three soft tacos with a promise of perfection you''ll be sure to callback. Chicken, fish, or shrimp served with creamy lime coleslaw, tomatoes, mozza, ancho chipotle sauce, and cilantro.', 4.4),

-- Appetizers
('King Nachos', 4, 'https://i.imgur.com/4iORyQp.png', 1429, 15, 'Topped with cheddar, mozza, green peppers, olives, jalapeños, tomatoes, and green onions. Served with salsa, sour cream, and your choice of chicken or spicy ground beef.', 4.5),
('Thai Strips', 4, 'https://i.imgur.com/mKypOOO.png', 929, 12, 'Chicken strips tossed in sweet Thai chili sauce and served with crunchy Asian noodles, carrots, green onions, and sesame seeds.', 3.9),
('Rancheros Bread', 4, 'https://i.imgur.com/9gUEkxf.png', 829, 10, 'Pizza bread, Italian spices, pizza mozzarella, and freshly grated parmesan. Served with SantaFe ranch dip.', 3.6),
('Miami Jalepenos Dip', 4, 'https://i.imgur.com/2tISdX6.png', 1129, 10, 'Made with a blend of rich Canadian cheeses, jalapeño peppers, smoked bacon, onions, and garlic. Served with our signature Ruby Gem Potatoes.', 3.6),

-- Desserts
('npm Cheesecake', 5, 'https://i.imgur.com/8QnDAGc.png', 799, 10, 'Traditional ''Never Push to Master'' style cheesecake with a git cracker crust.', 4.0),
('Chocolate Cheesecake Explosion', 5, 'https://i.imgur.com/xgIM7oO.png', 899, 10, 'Creamy chocolate mousse with chunks of cheesecake, caramel, React, toffee, and pecans on a chocolate crust.', 5.0),
('Red Velvet Delight', 5, 'https://i.imgur.com/QNXjVGo.png', 999, 10, 'Silky smooth double decker red velvet cake, almost as lightweight and elegant as Andy or Nally''s code.', 4.0),

-- Drinks
('Ginger Ale', 6, 'https://i.imgur.com/p3vNYQP.png', 299, 10, 'Served in 2L or 600mL, a delicious carbonated drink made with real ginger.', 4.0),
('Root Beer', 6, 'https://i.imgur.com/15TxJdD.png', 299, 10, 'Served in 2L or 600mL, a delicious carbonated drink made with real sassafras (sass).', 4.0),
('Espresso Milkshake', 6, 'https://i.imgur.com/CSKFxu9.png', 1395, 10, 'Delicious creamy milkshake blended with 8 shots of fresh espresso. Perfect for a little coding focus boost.', 4.0);
