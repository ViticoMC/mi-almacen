export const UNITS_HARDENING_MIGRATION_VERSION = 5;

export const UNITS_HARDENING_SCHEMA_SQL = `
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_units_product_name
ON product_units(product_id, name);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase
ON purchase_items(purchase_id);

CREATE INDEX IF NOT EXISTS idx_purchase_items_product
ON purchase_items(product_id);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale
ON sale_items(sale_id);

CREATE INDEX IF NOT EXISTS idx_sale_items_product
ON sale_items(product_id);
`;
