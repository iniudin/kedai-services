-- Add migration script here
DROP TABLE IF EXISTS product_add_ons;
DROP INDEX IF EXISTS product_add_ons_product_id_idx;
DROP INDEX IF EXISTS product_add_ons_add_on_id_idx;