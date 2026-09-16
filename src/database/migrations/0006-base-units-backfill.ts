export const BASE_UNITS_BACKFILL_MIGRATION_VERSION = 6;

export const BASE_UNITS_BACKFILL_SCHEMA_SQL = `
-- Todo producto debe tener su unidad base (1 elemento) desde su creación.
-- Esta migración cubre los productos existentes (demos y creados por el
-- usuario) que aún no tienen ninguna presentación registrada.
INSERT OR IGNORE INTO product_units (
    id,
    product_id,
    name,
    factor,
    is_base,
    created_at
)
SELECT
    'unit-base-' || p.id,
    p.id,
    'Unidad',
    1,
    1,
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_units u WHERE u.product_id = p.id
);
`;
