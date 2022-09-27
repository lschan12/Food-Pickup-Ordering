-- SELECT * FROM users;
-- SELECT * FROM categories;

-- SELECT dishes.*, categories.name FROM dishes
-- JOIN categories ON category_id = categories.id;

-- SELECT * FROM orders;
-- SELECT * FROM order_dishes;

SELECT order_dishes.dish_id as dishID, dishes.name as name, dishes.price as price, dishes.prep_time, count(order_dishes.*) as qty
  FROM dishes
  JOIN order_dishes ON order_id = orders.id
  JOIN orders ON orders.id = order_id
  WHERE orders.id = 1
  GROUP BY dishID;
