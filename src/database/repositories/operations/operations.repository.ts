import type { SQLiteDatabase } from "expo-sqlite";
import type { InventoryMovementRow, ProductRow } from "../../entities";
import { createId } from "../../utils/ids";
import { nowIso } from "../../utils/time";
import { getProductById } from "../products/products.repository";

const PRODUCT_COLUMNS = `
  id,
  name,
  description,
  image_path,
  active,
  current_stock,
  average_cost,
  last_cost,
  created_at,
  updated_at
`;

export type DashboardSummary = {
  totalProducts: number;
  lowStock: number;
  entriesToday: number;
  exitsToday: number;
};

export type PurchaseItemDraft = {
  product_id: string;
  unit_id: string;
  quantity: number;
  factor?: number;
  unit_cost: number;
};

export type PurchaseDraft = {
  id?: string;
  supplier_id?: string | null;
  invoice_number?: string | null;
  purchase_date?: string;
  notes?: string | null;
  items: PurchaseItemDraft[];
};

export type SaleItemDraft = {
  product_id: string;
  unit_id: string;
  quantity: number;
  factor?: number;
  unit_price: number;
};

export type SaleDraft = {
  id?: string;
  sale_date?: string;
  notes?: string | null;
  items: SaleItemDraft[];
};

export type MovementFilter = "ALL" | "IN" | "OUT" | "ADJUSTMENTS";

export type InventoryMovementDetailedRow = InventoryMovementRow & {
  product_name: string;
};

export type ManualMovementType =
  | "IN"
  | "OUT"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT";

export type ManualMovementDraft = {
  product_id: string;
  movement_type: ManualMovementType;
  quantity: number;
  unit_cost?: number | null;
  movement_date?: string;
  notes?: string | null;
};

export async function getDashboardSummary(
  db: SQLiteDatabase,
): Promise<DashboardSummary> {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).toISOString();
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  ).toISOString();

  const summary = await db.getFirstAsync<{
    total_products: number;
    low_stock: number;
    entries_today: number;
    exits_today: number;
  }>(
    `
    SELECT
      (SELECT COUNT(*) FROM products WHERE active = 1) AS total_products,
      (SELECT COUNT(*) FROM products WHERE active = 1 AND current_stock <= 10) AS low_stock,
      COALESCE((
        SELECT SUM(quantity)
        FROM inventory_movements
        WHERE movement_type = 'IN'
          AND movement_date >= $start
          AND movement_date < $end
      ), 0) AS entries_today,
      COALESCE((
        SELECT SUM(quantity)
        FROM inventory_movements
        WHERE movement_type = 'OUT'
          AND movement_date >= $start
          AND movement_date < $end
      ), 0) AS exits_today;
  `,
    {
      $start: startOfDay,
      $end: endOfDay,
    },
  );

  return {
    totalProducts: Number(summary?.total_products ?? 0),
    lowStock: Number(summary?.low_stock ?? 0),
    entriesToday: Number(summary?.entries_today ?? 0),
    exitsToday: Number(summary?.exits_today ?? 0),
  };
}

export async function listLowStockProducts(
  db: SQLiteDatabase,
  threshold = 10,
): Promise<ProductRow[]> {
  return db.getAllAsync<ProductRow>(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE active = 1 AND current_stock <= $threshold ORDER BY current_stock ASC, name ASC`,
    { $threshold: threshold },
  );
}

export async function listRecentMovements(
  db: SQLiteDatabase,
  limit = 6,
): Promise<InventoryMovementRow[]> {
  return db.getAllAsync<InventoryMovementRow>(
    `SELECT * FROM inventory_movements ORDER BY movement_date DESC, created_at DESC LIMIT $limit`,
    { $limit: limit },
  );
}

export async function listMovementsDetailed(
  db: SQLiteDatabase,
  options?: {
    limit?: number;
    filter?: MovementFilter;
  },
): Promise<InventoryMovementDetailedRow[]> {
  const limit = options?.limit ?? 120;
  const filter = options?.filter ?? "ALL";

  let whereClause = "";

  if (filter === "IN") {
    whereClause = "WHERE m.movement_type IN ('IN', 'ADJUSTMENT_IN')";
  } else if (filter === "OUT") {
    whereClause = "WHERE m.movement_type IN ('OUT', 'ADJUSTMENT_OUT')";
  } else if (filter === "ADJUSTMENTS") {
    whereClause =
      "WHERE m.movement_type IN ('ADJUSTMENT_IN', 'ADJUSTMENT_OUT')";
  }

  return db.getAllAsync<InventoryMovementDetailedRow>(
    `
      SELECT
        m.id,
        m.product_id,
        p.name AS product_name,
        m.movement_type,
        m.quantity,
        m.unit_cost,
        m.reference_type,
        m.reference_id,
        m.movement_date,
        m.notes,
        m.created_at
      FROM inventory_movements m
      INNER JOIN products p ON p.id = m.product_id
      ${whereClause}
      ORDER BY m.movement_date DESC, m.created_at DESC
      LIMIT $limit
    `,
    { $limit: limit },
  );
}

export async function createManualInventoryMovement(
  db: SQLiteDatabase,
  input: ManualMovementDraft,
) {
  const quantity = Number(input.quantity || 0);

  if (quantity <= 0) {
    throw new Error("La cantidad debe ser mayor a cero.");
  }

  const product = await getProductById(db, input.product_id);

  if (!product) {
    throw new Error("No se encontro el producto seleccionado.");
  }

  const createdAt = nowIso();
  const movementDate = input.movement_date ?? createdAt;
  const movementType = input.movement_type;
  const isIncoming = movementType === "IN" || movementType === "ADJUSTMENT_IN";
  const isOutgoing =
    movementType === "OUT" || movementType === "ADJUSTMENT_OUT";
  const isAdjustment =
    movementType === "ADJUSTMENT_IN" || movementType === "ADJUSTMENT_OUT";
  const currentStock = Number(product.current_stock || 0);

  if (isOutgoing && quantity > currentStock) {
    throw new Error(`Stock insuficiente para ${product.name}.`);
  }

  const nextStock = isIncoming
    ? currentStock + quantity
    : isOutgoing
      ? currentStock - quantity
      : currentStock;
  const inputUnitCost = input.unit_cost ?? null;
  const unitCost =
    inputUnitCost === null || Number(inputUnitCost) < 0
      ? null
      : Number(inputUnitCost);

  let nextAverageCost = Number(product.average_cost || 0);
  let nextLastCost = Number(product.last_cost || 0);

  if (isIncoming && unitCost !== null) {
    const weightedCost = nextAverageCost * currentStock;
    nextAverageCost =
      nextStock === 0 ? 0 : (weightedCost + unitCost * quantity) / nextStock;
    nextLastCost = unitCost;
  }

  const referenceType = isAdjustment ? "ADJUSTMENT" : "MANUAL";
  const referenceId = isAdjustment
    ? createId("adjustment")
    : createId("manual-movement");

  await db.withTransactionAsync(async () => {
    if (isAdjustment) {
      await db.runAsync(
        `
          INSERT INTO inventory_adjustments (
            id,
            adjustment_date,
            reason,
            created_at
          ) VALUES (
            $id,
            $adjustment_date,
            $reason,
            $created_at
          )
        `,
        {
          $id: referenceId,
          $adjustment_date: movementDate,
          $reason: input.notes ?? "Ajuste manual",
          $created_at: createdAt,
        },
      );

      await db.runAsync(
        `
          INSERT INTO inventory_adjustment_items (
            id,
            adjustment_id,
            product_id,
            expected_quantity,
            actual_quantity,
            difference_quantity
          ) VALUES (
            $id,
            $adjustment_id,
            $product_id,
            $expected_quantity,
            $actual_quantity,
            $difference_quantity
          )
        `,
        {
          $id: createId("adjustment-item"),
          $adjustment_id: referenceId,
          $product_id: input.product_id,
          $expected_quantity: currentStock,
          $actual_quantity: nextStock,
          $difference_quantity: isIncoming ? quantity : -quantity,
        },
      );
    }

    await db.runAsync(
      `
        UPDATE products SET
          current_stock = $current_stock,
          average_cost = $average_cost,
          last_cost = $last_cost,
          updated_at = $updated_at
        WHERE id = $id
      `,
      {
        $id: input.product_id,
        $current_stock: nextStock,
        $average_cost: nextAverageCost,
        $last_cost: nextLastCost,
        $updated_at: nowIso(),
      },
    );

    await db.runAsync(
      `
        INSERT INTO inventory_movements (
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
        ) VALUES (
          $id,
          $product_id,
          $movement_type,
          $quantity,
          $unit_cost,
          $reference_type,
          $reference_id,
          $movement_date,
          $notes,
          $created_at
        )
      `,
      {
        $id: createId("movement"),
        $product_id: input.product_id,
        $movement_type: movementType,
        $quantity: quantity,
        $unit_cost: unitCost,
        $reference_type: referenceType,
        $reference_id: referenceId,
        $movement_date: movementDate,
        $notes: input.notes ?? null,
        $created_at: createdAt,
      },
    );
  });

  return {
    product_id: input.product_id,
    movement_type: movementType,
    quantity,
    unit_cost: unitCost,
    reference_type: referenceType,
    reference_id: referenceId,
    movement_date: movementDate,
    notes: input.notes ?? null,
    created_at: createdAt,
  };
}

export async function createPurchase(db: SQLiteDatabase, input: PurchaseDraft) {
  if (!input.items.length) {
    throw new Error("La compra debe incluir al menos un producto.");
  }

  const purchaseId = input.id ?? createId("purchase");
  const createdAt = nowIso();
  const purchaseDate = input.purchase_date ?? createdAt;
  const subtotal = input.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unit_cost || 0),
    0,
  );

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
        INSERT INTO purchases (
          id,
          supplier_id,
          invoice_number,
          purchase_date,
          subtotal,
          total,
          notes,
          created_at
        ) VALUES (
          $id,
          $supplier_id,
          $invoice_number,
          $purchase_date,
          $subtotal,
          $total,
          $notes,
          $created_at
        )
      `,
      {
        $id: purchaseId,
        $supplier_id: input.supplier_id ?? null,
        $invoice_number: input.invoice_number ?? null,
        $purchase_date: purchaseDate,
        $subtotal: subtotal,
        $total: subtotal,
        $notes: input.notes ?? null,
        $created_at: createdAt,
      },
    );

    for (const item of input.items) {
      const product = await getProductById(db, item.product_id);

      if (!product) {
        throw new Error(`No existe el producto ${item.product_id}.`);
      }

      const factor = Number(item.factor ?? 1);
      const quantity = Number(item.quantity || 0);
      const unitCost = Number(item.unit_cost || 0);
      const inventoryQuantity = quantity * factor;
      const baseUnitCost = factor === 0 ? unitCost : unitCost / factor;
      const itemId = createId("purchase-item");
      const itemTotal = quantity * unitCost;

      await db.runAsync(
        `
          INSERT INTO purchase_items (
            id,
            purchase_id,
            product_id,
            unit_id,
            quantity,
            factor,
            inventory_quantity,
            unit_cost,
            total
          ) VALUES (
            $id,
            $purchase_id,
            $product_id,
            $unit_id,
            $quantity,
            $factor,
            $inventory_quantity,
            $unit_cost,
            $total
          )
        `,
        {
          $id: itemId,
          $purchase_id: purchaseId,
          $product_id: item.product_id,
          $unit_id: item.unit_id,
          $quantity: quantity,
          $factor: factor,
          $inventory_quantity: inventoryQuantity,
          $unit_cost: unitCost,
          $total: itemTotal,
        },
      );

      const nextStock = Number(product.current_stock || 0) + inventoryQuantity;
      const weightedCost =
        Number(product.average_cost || 0) * Number(product.current_stock || 0);
      const nextAverageCost =
        nextStock === 0
          ? 0
          : (weightedCost + baseUnitCost * inventoryQuantity) / nextStock;

      await db.runAsync(
        `
          UPDATE products SET
            current_stock = $current_stock,
            average_cost = $average_cost,
            last_cost = $last_cost,
            updated_at = $updated_at
          WHERE id = $id
        `,
        {
          $current_stock: nextStock,
          $average_cost: nextAverageCost,
          $last_cost: baseUnitCost,
          $updated_at: nowIso(),
          $id: item.product_id,
        },
      );

      await db.runAsync(
        `
          INSERT INTO inventory_movements (
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
          ) VALUES (
            $id,
            $product_id,
            $movement_type,
            $quantity,
            $unit_cost,
            $reference_type,
            $reference_id,
            $movement_date,
            $notes,
            $created_at
          )
        `,
        {
          $id: createId("movement"),
          $product_id: item.product_id,
          $movement_type: "IN",
          $quantity: inventoryQuantity,
          $unit_cost: baseUnitCost,
          $reference_type: "PURCHASE",
          $reference_id: purchaseId,
          $movement_date: purchaseDate,
          $notes: `Compra ${input.invoice_number ?? "registrada"}`,
          $created_at: createdAt,
        },
      );
    }
  });

  return {
    id: purchaseId,
    supplier_id: input.supplier_id ?? null,
    invoice_number: input.invoice_number ?? null,
    purchase_date: purchaseDate,
    subtotal,
    total: subtotal,
    notes: input.notes ?? null,
    created_at: createdAt,
  };
}

export async function createSale(db: SQLiteDatabase, input: SaleDraft) {
  if (!input.items.length) {
    throw new Error("La venta debe incluir al menos un producto.");
  }

  const saleId = input.id ?? createId("sale");
  const createdAt = nowIso();
  const saleDate = input.sale_date ?? createdAt;
  let subtotal = 0;

  await db.withTransactionAsync(async () => {
    for (const item of input.items) {
      const product = await getProductById(db, item.product_id);

      if (!product) {
        throw new Error(`No existe el producto ${item.product_id}.`);
      }

      const factor = Number(item.factor ?? 1);
      const inventoryQuantity = Number(item.quantity || 0) * factor;

      if (Number(product.current_stock || 0) < inventoryQuantity) {
        throw new Error(`Stock insuficiente para ${product.name}.`);
      }

      subtotal += Number(item.unit_price || 0) * Number(item.quantity || 0);
    }

    await db.runAsync(
      `
        INSERT INTO sales (
          id,
          sale_date,
          subtotal,
          total,
          notes,
          created_at
        ) VALUES (
          $id,
          $sale_date,
          $subtotal,
          $total,
          $notes,
          $created_at
        )
      `,
      {
        $id: saleId,
        $sale_date: saleDate,
        $subtotal: subtotal,
        $total: subtotal,
        $notes: input.notes ?? null,
        $created_at: createdAt,
      },
    );

    for (const item of input.items) {
      const product = await getProductById(db, item.product_id);

      if (!product) {
        throw new Error(`No existe el producto ${item.product_id}.`);
      }

      const factor = Number(item.factor ?? 1);
      const inventoryQuantity = Number(item.quantity || 0) * factor;
      const unitPrice = Number(item.unit_price || 0);
      const total = unitPrice * Number(item.quantity || 0);
      const itemId = createId("sale-item");
      const costAtSale = Number(product.average_cost || 0);

      await db.runAsync(
        `
          INSERT INTO sale_items (
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
            $id,
            $sale_id,
            $product_id,
            $unit_id,
            $quantity,
            $factor,
            $inventory_quantity,
            $unit_price,
            $cost_at_sale,
            $total
          )
        `,
        {
          $id: itemId,
          $sale_id: saleId,
          $product_id: item.product_id,
          $unit_id: item.unit_id,
          $quantity: Number(item.quantity || 0),
          $factor: factor,
          $inventory_quantity: inventoryQuantity,
          $unit_price: unitPrice,
          $cost_at_sale: costAtSale,
          $total: total,
        },
      );

      const nextStock = Number(product.current_stock || 0) - inventoryQuantity;

      await db.runAsync(
        `
          UPDATE products SET
            current_stock = $current_stock,
            last_cost = $last_cost,
            updated_at = $updated_at
          WHERE id = $id
        `,
        {
          $current_stock: nextStock,
          $last_cost: Number(product.last_cost || 0),
          $updated_at: nowIso(),
          $id: item.product_id,
        },
      );

      await db.runAsync(
        `
          INSERT INTO inventory_movements (
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
          ) VALUES (
            $id,
            $product_id,
            $movement_type,
            $quantity,
            $unit_cost,
            $reference_type,
            $reference_id,
            $movement_date,
            $notes,
            $created_at
          )
        `,
        {
          $id: createId("movement"),
          $product_id: item.product_id,
          $movement_type: "OUT",
          $quantity: inventoryQuantity,
          $unit_cost: costAtSale,
          $reference_type: "SALE",
          $reference_id: saleId,
          $movement_date: saleDate,
          $notes: `Venta registrada ${saleId}`,
          $created_at: createdAt,
        },
      );
    }
  });

  return {
    id: saleId,
    sale_date: saleDate,
    subtotal,
    total: subtotal,
    notes: input.notes ?? null,
    created_at: createdAt,
  };
}
