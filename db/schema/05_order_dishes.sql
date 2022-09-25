-- Drop and recreate Order - Dishes table

DROP TABLE IF EXISTS order_dishes CASCADE;

CREATE TABLE order_dishes (
  id SERIAL PRIMARY KEY NOT NULL,
  dish_id INTEGER NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE
);
