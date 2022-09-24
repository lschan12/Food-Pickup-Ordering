-- Drop and recreate Menu Categories table

DROP TABLE IF EXISTS menu_categories CASCADE;

CREATE TABLE menu_categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);