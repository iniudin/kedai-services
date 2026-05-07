-- Add migration script here

ALTER TABLE orders DROP COLUMN status;

ALTER TABLE orders ADD COLUMN total_revenue BIGINT NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN total_net_profit BIGINT NOT NULL DEFAULT 0;

UPDATE orders AS o
SET
  total_revenue = COALESCE(sub.revenue, 0),
  total_net_profit = COALESCE(sub.net_profit, 0)
FROM (
  SELECT
    oi.order_id,
    SUM(oi.sell_price * oi.quantity) + COALESCE(SUM(oia.sell_price), 0) AS revenue,
    SUM((oi.sell_price - oi.cost_price) * oi.quantity) + COALESCE(SUM(oia.sell_price - oia.cost_price), 0) AS net_profit
  FROM order_items AS oi
  LEFT JOIN order_item_add_ons AS oia
    ON oia.order_item_id = oi.id
  GROUP BY
    oi.order_id
) AS sub
WHERE
  o.id = sub.order_id;

ALTER TABLE orders ALTER COLUMN total_revenue    DROP DEFAULT;
ALTER TABLE orders ALTER COLUMN total_net_profit DROP DEFAULT;