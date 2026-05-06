-- Add migration script here

-- Rename price to sell_price
ALTER TABLE products RENAME COLUMN price TO sell_price;
ALTER TABLE add_ons RENAME COLUMN price TO sell_price;
ALTER TABLE order_items RENAME COLUMN price TO sell_price;
ALTER TABLE order_item_add_ons RENAME COLUMN price TO sell_price;

-- Add cost_price
ALTER TABLE products ADD COLUMN cost_price BIGINT NOT NULL DEFAULT 0;
ALTER TABLE add_ons ADD COLUMN cost_price BIGINT NOT NULL DEFAULT 0;
ALTER TABLE order_items ADD COLUMN cost_price BIGINT NOT NULL DEFAULT 0;
ALTER TABLE order_item_add_ons ADD COLUMN cost_price BIGINT NOT NULL DEFAULT 0;

-- Rename amount to total_sell_price
ALTER TABLE payments RENAME COLUMN amount TO total_sell_price;