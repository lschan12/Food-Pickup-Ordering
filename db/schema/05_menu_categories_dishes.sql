-- Drop and recreate Menu Categories - Dishes table

DROP TABLE IF EXISTS menu_categories_dishes CASCADE;

CREATE TABLE menu_categories_dishes (
  id SERIAL PRIMARY KEY NOT NULL,
  menu_category_id INTEGER NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  dish_id INTEGER NOT NULL REFERENCES dishes(id) ON DELETE CASCADE
);
