-- Product Number Sequence
CREATE SEQUENCE IF NOT EXISTS product_number_seq
  START WITH 1 INCREMENT BY 1
  MINVALUE 1 MAXVALUE 999999999999 NO CYCLE;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku TEXT NOT NULL DEFAULT 'SKU-' || LPAD(nextval('product_number_seq')::text, 6, '0'),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add-ons
CREATE TABLE IF NOT EXISTS add_ons (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'topping' CHECK (type IN ('topping', 'size')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Add-ons (Junction)
CREATE TABLE IF NOT EXISTS product_add_ons (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  add_on_id INTEGER NOT NULL REFERENCES add_ons(id) ON DELETE CASCADE,
  CONSTRAINT uq_product_add_ons UNIQUE (product_id, add_on_id)
);

-- Order Number Sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq
  START WITH 1 INCREMENT BY 1
  MINVALUE 1 MAXVALUE 999999999999 NO CYCLE;

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT NOT NULL DEFAULT 'ORD-' || LPAD(nextval('order_number_seq')::text, 6, '0'),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Order Item Add-ons
CREATE TABLE IF NOT EXISTS order_item_add_ons (
  id SERIAL PRIMARY KEY,
  order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  add_on_id INTEGER NOT NULL REFERENCES add_ons(id) ON DELETE CASCADE,
  add_on_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method TEXT NOT NULL DEFAULT 'cash' CHECK (method IN ('cash')),
  amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0,
  amount_change DECIMAL(10, 2) NOT NULL DEFAULT 0,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_item_add_ons_order_item_id ON order_item_add_ons(order_item_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_product_add_ons_product_id ON product_add_ons(product_id);
CREATE INDEX IF NOT EXISTS idx_product_add_ons_add_on_id ON product_add_ons(add_on_id);