export const INITIAL_MIGRATION_VERSION = 1;

export const INITIAL_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    current_stock REAL NOT NULL DEFAULT 0,
    average_cost REAL NOT NULL DEFAULT 0,
    last_cost REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_name
ON products(name);

CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_units (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    factor REAL NOT NULL,
    is_base INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_units_product
ON product_units(product_id);

CREATE TABLE IF NOT EXISTS product_prices (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    price REAL NOT NULL,
    effective_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(product_id)
        REFERENCES products(id),
    FOREIGN KEY(unit_id)
        REFERENCES product_units(id)
);

CREATE INDEX IF NOT EXISTS idx_product_prices_product
ON product_prices(product_id);

CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    supplier_id TEXT,
    invoice_number TEXT,
    purchase_date TEXT NOT NULL,
    subtotal REAL NOT NULL,
    total REAL NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(supplier_id)
        REFERENCES suppliers(id)
);

CREATE INDEX IF NOT EXISTS idx_purchases_date
ON purchases(purchase_date);

CREATE TABLE IF NOT EXISTS purchase_items (
    id TEXT PRIMARY KEY,
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    quantity REAL NOT NULL,
    factor REAL NOT NULL,
    inventory_quantity REAL NOT NULL,
    unit_cost REAL NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY(purchase_id)
        REFERENCES purchases(id)
        ON DELETE CASCADE,
    FOREIGN KEY(product_id)
        REFERENCES products(id),
    FOREIGN KEY(unit_id)
        REFERENCES product_units(id)
);

CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    sale_date TEXT NOT NULL,
    subtotal REAL NOT NULL,
    total REAL NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_date
ON sales(sale_date);

CREATE TABLE IF NOT EXISTS sale_items (
    id TEXT PRIMARY KEY,
    sale_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    quantity REAL NOT NULL,
    factor REAL NOT NULL,
    inventory_quantity REAL NOT NULL,
    unit_price REAL NOT NULL,
    cost_at_sale REAL NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY(sale_id)
        REFERENCES sales(id)
        ON DELETE CASCADE,
    FOREIGN KEY(product_id)
        REFERENCES products(id),
    FOREIGN KEY(unit_id)
        REFERENCES product_units(id)
);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    movement_type TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit_cost REAL,
    reference_type TEXT NOT NULL,
    reference_id TEXT NOT NULL,
    movement_date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(product_id)
        REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_product
ON inventory_movements(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_date
ON inventory_movements(movement_date);

CREATE TABLE IF NOT EXISTS inventory_adjustments (
    id TEXT PRIMARY KEY,
    adjustment_date TEXT NOT NULL,
    reason TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_adjustment_items (
    id TEXT PRIMARY KEY,
    adjustment_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    expected_quantity REAL NOT NULL,
    actual_quantity REAL NOT NULL,
    difference_quantity REAL NOT NULL,
    FOREIGN KEY(adjustment_id)
        REFERENCES inventory_adjustments(id)
        ON DELETE CASCADE,
    FOREIGN KEY(product_id)
        REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    old_data TEXT,
    new_data TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_entity
ON audit_log(entity, entity_id);

CREATE VIEW IF NOT EXISTS current_stock_view AS
SELECT
    product_id,
    SUM(
        CASE
            WHEN movement_type IN ('IN', 'ADJUSTMENT_IN')
                THEN quantity
            WHEN movement_type IN ('OUT', 'ADJUSTMENT_OUT')
                THEN -quantity
            ELSE 0
        END
    ) AS current_stock
FROM inventory_movements
GROUP BY product_id;

CREATE VIEW IF NOT EXISTS inventory_valuation_view AS
SELECT
    p.id,
    p.name,
    p.current_stock,
    p.average_cost,
    (p.current_stock * p.average_cost) AS inventory_value
FROM products p;
`;

export const INITIAL_SEED_SQL = `
INSERT OR IGNORE INTO suppliers (id, name, phone, email, address, created_at)
VALUES
  ('supplier-central', 'Proveedor Central', '+52 555-100-2000', 'central@proveedor.test', 'Av. Principal 123', '2026-08-31T00:00:00.000Z'),
  ('supplier-norte', 'Distribuidora Norte', '+52 555-100-2001', 'norte@proveedor.test', 'Calle Norte 45', '2026-08-31T00:00:00.000Z');

INSERT OR IGNORE INTO products (
    id,
    name,
    description,
    active,
    current_stock,
    average_cost,
    last_cost,
    created_at,
    updated_at
) VALUES
  ('product-agua-purificada', 'Agua Purificada 500ml', 'Botella individual de agua purificada', 1, 96, 4, 4, '2026-08-31T00:00:00.000Z', '2026-08-31T00:00:00.000Z'),
    ('product-arroz-premium', 'Arroz Premium 1kg', 'Bolsa de arroz premium', 1, 30, 28, 28, '2026-08-31T00:00:00.000Z', '2026-08-31T00:00:00.000Z');

INSERT OR IGNORE INTO product_units (id, product_id, name, factor, is_base, created_at)
VALUES
  ('unit-agua-botella', 'product-agua-purificada', 'Botella', 1, 1, '2026-08-31T00:00:00.000Z'),
  ('unit-agua-caja', 'product-agua-purificada', 'Caja', 12, 0, '2026-08-31T00:00:00.000Z'),
  ('unit-arroz-bolsa', 'product-arroz-premium', 'Bolsa', 1, 1, '2026-08-31T00:00:00.000Z'),
  ('unit-arroz-saco', 'product-arroz-premium', 'Saco', 10, 0, '2026-08-31T00:00:00.000Z');

INSERT OR IGNORE INTO product_prices (id, product_id, unit_id, price, effective_date, created_at)
VALUES
  ('price-agua-botella', 'product-agua-purificada', 'unit-agua-botella', 4, '2026-08-31T00:00:00.000Z', '2026-08-31T00:00:00.000Z'),
  ('price-agua-caja', 'product-agua-purificada', 'unit-agua-caja', 48, '2026-08-31T00:00:00.000Z', '2026-08-31T00:00:00.000Z'),
  ('price-arroz-bolsa', 'product-arroz-premium', 'unit-arroz-bolsa', 28, '2026-08-31T00:00:00.000Z', '2026-08-31T00:00:00.000Z'),
  ('price-arroz-saco', 'product-arroz-premium', 'unit-arroz-saco', 280, '2026-08-31T00:00:00.000Z', '2026-08-31T00:00:00.000Z');

INSERT OR IGNORE INTO purchases (
    id,
    supplier_id,
    invoice_number,
    purchase_date,
    subtotal,
    total,
    notes,
    created_at
) VALUES (
    'purchase-001',
    'supplier-central',
    'F-0001',
    '2026-08-31T08:00:00.000Z',
    1320,
    1320,
    'Compra inicial para cargar inventario de prueba',
    '2026-08-31T08:00:00.000Z'
);

INSERT OR IGNORE INTO purchase_items (
    id,
    purchase_id,
    product_id,
    unit_id,
    quantity,
    factor,
    inventory_quantity,
    unit_cost,
    total
) VALUES
  ('purchase-item-agua', 'purchase-001', 'product-agua-purificada', 'unit-agua-caja', 10, 12, 120, 48, 480),
    ('purchase-item-arroz', 'purchase-001', 'product-arroz-premium', 'unit-arroz-saco', 3, 10, 30, 280, 840);

INSERT OR IGNORE INTO sales (
    id,
    sale_date,
    subtotal,
    total,
    notes,
    created_at
) VALUES (
    'sale-001',
    '2026-08-31T12:00:00.000Z',
    120,
    120,
    'Venta de prueba para validar salidas',
    '2026-08-31T12:00:00.000Z'
);

INSERT OR IGNORE INTO sale_items (
    id,
    sale_id,
    product_id,
    unit_id,
    quantity,
    factor,
    inventory_quantity,
    unit_price,
    cost_at_sale,
    total
) VALUES (
    'sale-item-agua',
    'sale-001',
    'product-agua-purificada',
    'unit-agua-caja',
    2,
    12,
    24,
    60,
    4,
    120
);

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
) VALUES
  ('movement-agua-in', 'product-agua-purificada', 'IN', 120, 4, 'PURCHASE', 'purchase-001', '2026-08-31T08:00:00.000Z', 'Entrada por compra inicial', '2026-08-31T08:00:00.000Z'),
    ('movement-arroz-in', 'product-arroz-premium', 'IN', 30, 28, 'PURCHASE', 'purchase-001', '2026-08-31T08:00:00.000Z', 'Entrada por compra inicial', '2026-08-31T08:00:00.000Z'),
  ('movement-agua-out', 'product-agua-purificada', 'OUT', 24, 4, 'SALE', 'sale-001', '2026-08-31T12:00:00.000Z', 'Salida por venta de prueba', '2026-08-31T12:00:00.000Z');

INSERT OR IGNORE INTO inventory_adjustments (
    id,
    adjustment_date,
    reason,
    created_at
) VALUES (
    'adjustment-001',
    '2026-08-31T15:00:00.000Z',
    'Conteo físico inicial de prueba',
    '2026-08-31T15:00:00.000Z'
);

INSERT OR IGNORE INTO inventory_adjustment_items (
    id,
    adjustment_id,
    product_id,
    expected_quantity,
    actual_quantity,
    difference_quantity
) VALUES (
    'adjustment-item-001',
    'adjustment-001',
    'product-arroz-premium',
    30,
    30,
    0
);

INSERT OR IGNORE INTO audit_log (
    id,
    entity,
    entity_id,
    action,
    old_data,
    new_data,
    created_at
) VALUES (
    'audit-001',
    'products',
    'product-agua-purificada',
    'CREATE',
    NULL,
    '{"name":"Agua Purificada 500ml"}',
    '2026-08-31T00:00:00.000Z'
);
`;
