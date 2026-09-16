export const REMOVE_PRODUCT_CACHE_MIGRATION_VERSION = 3;

export const REMOVE_PRODUCT_CACHE_SCHEMA_SQL = `
DROP VIEW IF EXISTS inventory_valuation_view;

ALTER TABLE products DROP COLUMN current_stock;
ALTER TABLE products DROP COLUMN average_cost;
ALTER TABLE products DROP COLUMN last_cost;

CREATE VIEW IF NOT EXISTS last_cost_view AS
SELECT product_id, unit_cost AS last_cost
FROM (
    SELECT
        product_id,
        unit_cost,
        ROW_NUMBER() OVER (
            PARTITION BY product_id
            ORDER BY movement_date DESC, created_at DESC, id DESC
        ) AS rn
    FROM inventory_movements
    WHERE movement_type IN ('IN', 'ADJUSTMENT_IN')
        AND unit_cost IS NOT NULL
)
WHERE rn = 1;

CREATE VIEW IF NOT EXISTS average_cost_view AS
SELECT
    product_id,
    SUM(quantity * unit_cost) / SUM(quantity) AS average_cost
FROM inventory_movements
WHERE movement_type IN ('IN', 'ADJUSTMENT_IN')
    AND unit_cost IS NOT NULL
GROUP BY product_id;

CREATE VIEW IF NOT EXISTS inventory_valuation_view AS
SELECT
    p.id,
    p.name,
    COALESCE(csv.current_stock, 0) AS current_stock,
    COALESCE(acv.average_cost, 0) AS average_cost,
    (COALESCE(csv.current_stock, 0) * COALESCE(acv.average_cost, 0)) AS inventory_value
FROM products p
LEFT JOIN current_stock_view csv ON csv.product_id = p.id
LEFT JOIN average_cost_view acv ON acv.product_id = p.id;
`;