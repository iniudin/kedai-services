-- Add migration script here

ALTER TABLE orders ADD COLUMN amount_paid BIGINT NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN amount_change BIGINT NOT NULL DEFAULT 0;

UPDATE orders AS o
SET
  amount_paid = p.amount_paid,
  amount_change = p.amount_change
FROM (
  SELECT DISTINCT ON (order_id)
    order_id,
    amount_paid,
    amount_change
  FROM payments
  ORDER BY order_id, paid_at DESC
) AS p
WHERE o.id = p.order_id;

ALTER TABLE orders ALTER COLUMN amount_paid DROP DEFAULT;
ALTER TABLE orders ALTER COLUMN amount_change DROP DEFAULT;

DROP TABLE payments;