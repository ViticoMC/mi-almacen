export const SEED_DEMO_PRODUCTS_MIGRATION_VERSION = 4;

export const SEED_DEMO_PRODUCTS_SCHEMA_SQL = `
INSERT OR IGNORE INTO products (
    id,
    name,
    description,
    active,
    created_at,
    updated_at
)
VALUES
  ('product-demo-1', 'Leche Entera 1L', 'Leche entera de vaca en envase de 1 litro.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-2', 'Pan Blanco Rebanado 680g', 'Pan de molde blanco rebanado, bolsa de 680 gramos.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-3', 'Huevo Blanco 12 piezas', 'Huevo blanco, carton de 12 piezas.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-4', 'Atun en Lata 140g', 'Atun en trozos envasado en aceite, lata de 140 gramos.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-5', 'Frijol Negro 900g', 'Bolsa de frijol negro seco, 900 gramos.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-6', 'Tortilla de Maiz 1kg', 'Tortillas de maiz nixtamalizado por kilo.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-7', 'Aceite Vegetal 946ml', 'Aceite vegetal comestible, botella de 946 mililitros.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-8', 'Azucar Morena 1kg', 'Azucar morena en bolsa de 1 kilogramo.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-9', 'Cafe Molido 250g', 'Cafe tostado y molido, empaque de 250 gramos.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z'),
  ('product-demo-10', 'Servilletas de Papel 100pz', 'Paquete de servilletas de papel, 100 piezas.', 1, '2026-09-15T00:00:00.000Z', '2026-09-15T00:00:00.000Z');

INSERT OR IGNORE INTO inventory_movements (
    id,
    product_id,
    movement_type,
    quantity,
    unit_cost,
    reference_type,
    reference_id,
    movement_date,
    notes,
    created_at
)
VALUES
  ('movement-demo-1a', 'product-demo-1', 'IN', 40, 18, 'MANUAL', 'seed-demo', '2026-09-15T08:00:00.000Z', 'Carga de prueba', '2026-09-15T08:00:00.000Z'),
  ('movement-demo-1b', 'product-demo-1', 'IN', 10, 20, 'MANUAL', 'seed-demo', '2026-09-15T09:00:00.000Z', 'Reabastecimiento de prueba', '2026-09-15T09:00:00.000Z'),
  ('movement-demo-2', 'product-demo-2', 'IN', 25, 32, 'MANUAL', 'seed-demo', '2026-09-15T08:00:00.000Z', 'Carga de prueba', '2026-09-15T08:00:00.000Z'),
  ('movement-demo-3', 'product-demo-3', 'IN', 30, 42, 'MANUAL', 'seed-demo', '2026-09-15T08:00:00.000Z', 'Carga de prueba', '2026-09-15T08:00:00.000Z'),
  ('movement-demo-4', 'product-demo-4', 'IN', 60, 22, 'MANUAL', 'seed-demo', '2026-09-15T08:00:00.000Z', 'Carga de prueba', '2026-09-15T08:00:00.000Z'),
  ('movement-demo-5', 'product-demo-5', 'IN', 20, 26, 'MANUAL', 'seed-demo', '2026-09-15T08:00:00.000Z', 'Carga de prueba', '2026-09-15T08:00:00.000Z'),
  ('movement-demo-7', 'product-demo-7', 'IN', 15, 45, 'MANUAL', 'seed-demo', '2026-09-15T08:00:00.000Z', 'Carga de prueba', '2026-09-15T08:00:00.000Z'),
  ('movement-demo-9', 'product-demo-9', 'IN', 12, 85, 'MANUAL', 'seed-demo', '2026-09-15T08:00:00.000Z', 'Carga de prueba', '2026-09-15T08:00:00.000Z');
`;