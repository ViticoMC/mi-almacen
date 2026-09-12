-- ============================================================
-- SISTEMA DE INVENTARIO, COMPRAS Y VENTAS
-- React Native + SQLite (Offline First)
--
-- OBJETIVOS:
-- 1. Gestionar compras (entradas de almacén)
-- 2. Gestionar ventas (salidas de almacén)
-- 3. Mantener historial completo de movimientos
-- 4. Calcular stock en cualquier momento
-- 5. Soportar múltiples presentaciones
--    (unidad, caja, saco, pallet, etc.)
-- 6. Mantener trazabilidad contable
-- 7. Permitir cálculo de costos y ganancias
--
-- FILOSOFÍA DEL SISTEMA:
--
-- El stock NO es la fuente de verdad.
--
-- La fuente de verdad son los movimientos
-- registrados en inventory_movements.
--
-- Todo lo demás puede calcularse a partir
-- de esos movimientos.
--
-- ============================================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- PRODUCTOS
-- ============================================================
--
-- Catálogo principal de productos.
--
-- current_stock:
-- Se mantiene como caché para consultas rápidas.
--
-- El valor real siempre puede recalcularse
-- desde inventory_movements.
--
-- average_cost:
-- Costo promedio ponderado actual.
--
-- last_cost:
-- Último costo de compra registrado.
--
-- ============================================================

-- image_path:
-- Ruta al archivo de imagen del producto.
-- El binario se guarda en el directorio
-- documentDirectory/product-images de la app;
-- en la base solo se almacena la ruta.
--
-- active:
-- DELETE lógico (1 = activo, 0 = desactivado).

CREATE TABLE products (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    description TEXT,

    image_path TEXT,

    active INTEGER NOT NULL DEFAULT 1,

    current_stock REAL NOT NULL DEFAULT 0,

    average_cost REAL NOT NULL DEFAULT 0,

    last_cost REAL NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- CREATE INDEX idx_products_code
-- ON products(code);

CREATE INDEX idx_products_name
ON products(name);

-- ============================================================
-- PROVEEDORES
-- ============================================================
--
-- Empresas o personas que suministran productos.
--
-- ============================================================

CREATE TABLE suppliers (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    phone TEXT,
    email TEXT,
    address TEXT,

    created_at TEXT NOT NULL
);

-- ============================================================
-- UNIDADES Y PRESENTACIONES
-- ============================================================
--
-- Permiten vender/comprar:
--
-- Unidad
-- Caja
-- Saco
-- Paquete
-- Pallet
--
-- Todo se convierte internamente
-- a la unidad base.
--
-- EJEMPLO:
--
-- Producto: Coca Cola
--
-- Unidad = 1
-- Caja = 24
-- Pallet = 1440
--
-- ============================================================

CREATE TABLE product_units (
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

CREATE INDEX idx_product_units_product
ON product_units(product_id);

-- ============================================================
-- PRECIOS POR PRESENTACIÓN
-- ============================================================
--
-- Permite que:
--
-- Unidad = $1
-- Caja = $22
--
-- Aunque una caja tenga 24 unidades.
--
-- ============================================================

CREATE TABLE product_prices (
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

CREATE INDEX idx_product_prices_product
ON product_prices(product_id);

-- ============================================================
-- COMPRAS
-- ============================================================
--
-- Encabezado de compra.
--
-- Una compra puede contener
-- múltiples productos.
--
-- ============================================================

CREATE TABLE purchases (
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

CREATE INDEX idx_purchases_date
ON purchases(purchase_date);

-- ============================================================
-- DETALLES DE COMPRA
-- ============================================================
--
-- Ejemplo:
--
-- Compra #001
--
-- 10 cajas de refresco
--
-- quantity = 10
-- factor = 24
--
-- inventory_quantity = 240
--
-- unit_cost:
-- costo por presentación comprada.
--
-- ============================================================

CREATE TABLE purchase_items (
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

-- ============================================================
-- VENTAS
-- ============================================================
--
-- Encabezado de factura o venta.
--
-- ============================================================

CREATE TABLE sales (
    id TEXT PRIMARY KEY,

    sale_date TEXT NOT NULL,

    subtotal REAL NOT NULL,

    total REAL NOT NULL,

    notes TEXT,

    created_at TEXT NOT NULL
);

CREATE INDEX idx_sales_date
ON sales(sale_date);

-- ============================================================
-- DETALLES DE VENTA
-- ============================================================
--
-- IMPORTANTE:
--
-- unit_price:
-- Precio vendido.
--
-- cost_at_sale:
-- Costo promedio existente al momento
-- de la venta.
--
-- Esto evita que cambios futuros
-- alteren ventas históricas.
--
-- ============================================================

CREATE TABLE sale_items (
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

-- ============================================================
-- MOVIMIENTOS DE INVENTARIO
-- ============================================================
--
-- TABLA MÁS IMPORTANTE DEL SISTEMA
--
-- Cada entrada o salida genera
-- un movimiento.
--
-- movement_type:
--
-- IN
-- OUT
-- ADJUSTMENT_IN
-- ADJUSTMENT_OUT
--
-- reference_type:
--
-- PURCHASE
-- SALE
-- ADJUSTMENT
--
-- ============================================================

CREATE TABLE inventory_movements (
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

CREATE INDEX idx_inventory_product
ON inventory_movements(product_id);

CREATE INDEX idx_inventory_date
ON inventory_movements(movement_date);

-- ============================================================
-- AJUSTES DE INVENTARIO
-- ============================================================
--
-- Cuando existe diferencia entre:
--
-- Inventario físico
-- Inventario del sistema
--
-- Ejemplo:
--
-- Sistema = 100
-- Conteo real = 97
--
-- Se registra un ajuste de -3.
--
-- ============================================================

CREATE TABLE inventory_adjustments (
    id TEXT PRIMARY KEY,

    adjustment_date TEXT NOT NULL,

    reason TEXT,

    created_at TEXT NOT NULL
);

CREATE TABLE inventory_adjustment_items (
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

-- ============================================================
-- AUDITORÍA
-- ============================================================
--
-- Historial de cambios.
--
-- Permite saber:
--
-- Quién hizo qué.
-- Qué cambió.
-- Cuándo cambió.
--
-- old_data y new_data
-- almacenan JSON.
--
-- ============================================================

CREATE TABLE audit_log (
    id TEXT PRIMARY KEY,

    entity TEXT NOT NULL,

    entity_id TEXT NOT NULL,

    action TEXT NOT NULL,

    old_data TEXT,

    new_data TEXT,

    created_at TEXT NOT NULL
);

CREATE INDEX idx_audit_entity
ON audit_log(entity, entity_id);

-- ============================================================
-- VISTA DE STOCK ACTUAL
-- ============================================================
--
-- Calcula el inventario real
-- directamente desde los movimientos.
--
-- Puede utilizarse para validar
-- la integridad del sistema.
--
-- ============================================================

CREATE VIEW current_stock_view AS
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

-- ============================================================
-- VISTA DE VALOR DEL INVENTARIO
-- ============================================================
--
-- Permite conocer:
--
-- Stock actual
-- Costo promedio
-- Valor almacenado
--
-- ============================================================

CREATE VIEW inventory_valuation_view AS
SELECT
    p.id,
    p.name,

    p.current_stock,

    p.average_cost,

    (p.current_stock * p.average_cost)
        AS inventory_value

FROM products p;

-- ============================================================
-- RESUMEN DEL FLUJO DE NEGOCIO
-- ============================================================
--
-- REGISTRAR COMPRA
--
-- 1. Crear purchase
-- 2. Crear purchase_items
-- 3. Crear inventory_movements(IN)
-- 4. Actualizar current_stock
-- 5. Recalcular average_cost
--
--
-- REGISTRAR VENTA
--
-- 1. Validar stock
-- 2. Crear sale
-- 3. Crear sale_items
-- 4. Crear inventory_movements(OUT)
-- 5. Actualizar current_stock
--
--
-- AJUSTE DE INVENTARIO
--
-- 1. Crear inventory_adjustment
-- 2. Crear adjustment_items
-- 3. Crear movement ADJUSTMENT
--
--
-- REPORTES POSIBLES
--
-- Inventario actual
-- Kardex por producto
-- Historial de compras
-- Historial de ventas
-- Ganancias por período
-- Productos más vendidos
-- Valor total del almacén
--
-- ============================================================