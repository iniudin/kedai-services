-- Add migration script here
ALTER TABLE order_items ADD COLUMN revenue numeric;
ALTER TABLE order_items ADD COLUMN net_profit numeric;

UPDATE order_items oi
SET
  revenue = (
    (oi.sell_price + COALESCE(
      (SELECT SUM(oia.sell_price) FROM order_item_add_ons oia WHERE oia.order_item_id = oi.id),
      0
    )) * oi.quantity
  ),
  net_profit = (
    ((oi.sell_price - oi.cost_price) + COALESCE(
      (SELECT SUM(oia.sell_price - oia.cost_price) FROM order_item_add_ons oia WHERE oia.order_item_id = oi.id),
      0
    )) * oi.quantity
  );

ALTER TABLE order_items ALTER COLUMN revenue SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN net_profit SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN revenue SET DEFAULT 0;
ALTER TABLE order_items ALTER COLUMN net_profit SET DEFAULT 0;