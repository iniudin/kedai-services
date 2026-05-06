-- To avoid precision issue, since we used Rupiah as currency, we will use BIGINT instead of DECIMAL

ALTER TABLE products
  ALTER COLUMN price TYPE BIGINT USING price::BIGINT;

ALTER TABLE add_ons
  ALTER COLUMN price TYPE BIGINT USING price::BIGINT;

ALTER TABLE order_items
  ALTER COLUMN price TYPE BIGINT USING price::BIGINT;

ALTER TABLE order_item_add_ons
  ALTER COLUMN price TYPE BIGINT USING price::BIGINT;

ALTER TABLE payments
  ALTER COLUMN amount TYPE BIGINT USING amount::BIGINT,
  ALTER COLUMN amount_paid TYPE BIGINT USING amount_paid::BIGINT,
  ALTER COLUMN amount_change TYPE BIGINT USING amount_change::BIGINT;