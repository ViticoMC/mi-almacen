# Plan — Conteo semanal y venta conjunta

> Continúa la planificación de la sesión `ses_e7d2`. Las respuestas del cliente ya están tomadas; este documento define el diseño completo antes de tocar código.

## 1. Qué pidió el cliente

Cada domingo cuenta todo el almacén, ajusta el stock a lo que realmente queda y **la diferencia contra el stock anterior se registra como una venta conjunta**.

Respuestas confirmadas en la sesión anterior:

| Tema | Decisión |
| --- | --- |
| Flujo de conteo | Una sola pantalla con todos los productos |
| Diferencia del conteo | Se guarda como **una venta conjunta** de todos los productos |
| Valor de la venta | Con el `sale_price` congelado al momento |
| Venta manual | Se elimina de la interfaz |
| Compras | Se mantienen igual: entran directo al stock y fijan costos |

## 2. Decisiones que asumo (confírmame antes de implementar)

1. **"Venta conjunta" = un evento de conteo con varias líneas.** Se crea un registro `counts` (el conteo) y cada producto con faltante genera una línea en `sales` ligada a ese conteo. No se crea una fila suelta por producto en el historial: el conteo se ve como un solo movimiento con su detalle.
2. **Los sobrantes se registran como entrada, no como venta.** Si `contado > stock`, se crea un ajuste positivo con motivo `"Sobrante de conteo"` ligado al mismo conteo. No se iguala el stock en silencio: todo cambio queda auditado. (Vender un sobrante no tiene sentido y el stock no puede subir por una venta.)
3. **Productos sin precio de salida:** si hay faltante y el producto no tiene `sale_price`, la línea se registra con `unit_price = 0` y `total = 0`, avisada en la vista previa y en el detalle. No se bloquea el conteo por un producto sin precio.
4. **Los conteos son inmutables.** No se editan ni se eliminan; un error se corrige con otro conteo. Revertir un conteo implicaría reconstruir stock y precios históricos.
5. **Un conteo no exige contar todos los productos.** El campo vacío significa "sin cambio". El cliente solo digita los que difieren.

## 3. Modelo de datos (migración 2)

### Nueva tabla `counts`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | TEXT PK | Identificador |
| `total_sale` | INTEGER | Suma congelada de las líneas de venta |
| `units_sold` | REAL | Unidades faltantes (vendidas) |
| `units_added` | REAL | Unidades sobrantes (entradas) |
| `sale_lines` | INTEGER | Productos con faltante |
| `adjustment_lines` | INTEGER | Productos con sobrante |
| `created_at` | INTEGER | Fecha del conteo |

### Cambios a tablas existentes

- `sales`: `count_id TEXT NULL REFERENCES counts(id) ON DELETE SET NULL`, `stock_before REAL NULL`, `stock_after REAL NULL`.
- `adjustments`: `count_id TEXT NULL REFERENCES counts(id) ON DELETE SET NULL`.

Las ventas históricas (manuales) quedan con `count_id = NULL` y se siguen viendo igual. No se borra ni se reescribe data existente.

### Vista `history`

Se recrea (DROP + CREATE) para:

- Excluir las ventas y ajustes que pertenecen a un conteo (`count_id IS NULL`), evitando duplicar el evento.
- Agregar una fila por conteo (`type = 'count'`) con `quantity = units_sold`, `total = total_sale` y `item_count = sale_lines + adjustment_lines`.

`HistoryType` pasa a `"purchase" | "sale" | "adjustment" | "count"`; `product_id` y `product_unit` pasan a ser nullables para la fila de conteo.

### SQL de la migración

```sql
CREATE TABLE IF NOT EXISTS counts (
  id TEXT PRIMARY KEY NOT NULL,
  total_sale INTEGER NOT NULL DEFAULT 0 CHECK (total_sale >= 0),
  units_sold REAL NOT NULL DEFAULT 0 CHECK (units_sold >= 0),
  units_added REAL NOT NULL DEFAULT 0 CHECK (units_added >= 0),
  sale_lines INTEGER NOT NULL DEFAULT 0 CHECK (sale_lines >= 0),
  adjustment_lines INTEGER NOT NULL DEFAULT 0 CHECK (adjustment_lines >= 0),
  created_at INTEGER NOT NULL
);

ALTER TABLE sales ADD COLUMN count_id TEXT REFERENCES counts(id) ON DELETE SET NULL;
ALTER TABLE sales ADD COLUMN stock_before REAL;
ALTER TABLE sales ADD COLUMN stock_after REAL;
ALTER TABLE adjustments ADD COLUMN count_id TEXT REFERENCES counts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_counts_created ON counts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_count ON sales(count_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_count ON adjustments(count_id);
```

La vista se define con `UNION ALL` de compras + ventas sueltas + ajustes sueltos + conteos.

## 4. Reglas del conteo

1. Solo productos activos (`archived_at IS NULL`).
2. `delta = round(contado, 3) − stock`; `contado` no puede ser negativo.
3. `delta = 0` → no genera nada.
4. `delta < 0` → línea de venta:
   - `quantity = |delta|`
   - `unit_price = sale_price` (0 si no tiene)
   - `cost_price = current_price`
   - `margin_percent` = margen efectivo (NULL si no hay precio o costo)
   - `total = round(|delta| × unit_price)`
   - `stock_before` / `stock_after` congelados
5. `delta > 0` → ajuste de entrada:
   - `quantity_delta = delta`, `unit_cost = current_price`, `reason = "Sobrante de conteo"`, `stock_before` / `stock_after`.
6. El stock de cada producto contado termina exactamente en `contado`.
7. Todo ocurre en **una sola** `withExclusiveTransactionAsync`: cabecera, líneas y updates de stock. Si algo falla, no se escribe nada.
8. Si no hay ninguna diferencia, se rechaza el registro ("No hay diferencias para registrar").
9. Los precios y el margen se congelan; el conteo no modifica costos ni precios del producto.
10. Un conteo puede incluir solo faltantes, solo sobrantes o ambos.

## 5. Pantallas

### 5.1 Inicio — acceso principal

- Tarjeta destacada arriba de las estadísticas: **"Conteo semanal"**.
- Si nunca hay conteo: "Haz tu primer conteo".
- Si existe: "Último conteo: 26 oct · hace 6 días"; badge `Pendiente` cuando pasan 7 días o más.
- Botón "Nuevo conteo" → `/count/new`.

### 5.2 Nuevo conteo (`/count/new`)

- Pantalla completa con header "Conteo semanal" y acción principal fija abajo.
- Buscador por nombre y switch "Solo diferencias".
- Lista de productos activos. Cada fila:
  - Nombre, unidad y `Sistema: 10 unidad`.
  - Campo numérico "Contado" (decimal, 3 posiciones). Vacío = sin cambio; el placeholder muestra el stock actual.
  - Al escribir, etiqueta del efecto: `Faltan 2 · venta $8.000` (rojo), `Sobran 3 · entrada` (verde) o `Sin precio de salida` (ámbar).
- Resumen fijo:
  - `N productos con diferencia`
  - `Ventas: X unidades · $Y`
  - `Entradas: Z unidades`
  - Aviso si hay líneas sin precio.
  - Botón **"Confirmar conteo"** (deshabilitado sin diferencias o mientras guarda).
- Confirmación con `Alert` que resume venta conjunta, entradas y productos sin precio.
- Al guardar: `refresh()` y volver; el conteo aparece de primero en Movimientos e Inicio.
- Estados: sin productos (EmptyState + "Crear producto"), carga y error.

### 5.3 Detalle del conteo (`/count/[id]`)

- Cabecera: fecha, badge "Conteo", total de la venta conjunta, unidades vendidas y entradas.
- Sección **Ventas del conteo**: producto, `stock antes → después`, cantidad, precio congelado y total. Etiqueta "Sin precio" cuando aplica.
- Sección **Entradas**: producto, delta, `antes → después`, costo congelado y motivo.
- Nota: "Precios y cantidades congelados al momento del conteo."
- Sin acciones de edición ni borrado.

### 5.4 Movimientos

- Modos: **Compras | Conteos | Ajustes** (se elimina "Ventas").
- Tarjeta de conteo: fecha, `N productos`, total vendido y unidades faltantes; tap → detalle.
- Botón contextual: "Nuevo conteo".
- Estados vacíos actualizados.

### 5.5 Historial

- Chips: Todo · Compras · Ventas · **Conteos** · Ajustes (se conserva "Ventas" para las ventas manuales históricas).
- El conteo se muestra como **un solo movimiento** ("Conteo semanal", fecha, N productos, total y unidades); tap → `/count/[id]`.
- El filtro por producto incluye los conteos que contengan ese producto (EXISTS sobre `sales`/`adjustments`).
- El detalle de ventas y ajustes sueltos no cambia.

### 5.6 Producto

- Se elimina el botón "Registrar venta".
- Quedan: Registrar compra · Ajustar stock · Editar · Archivar.

## 6. Archivos

### Nuevos

- `src/database/repositories/counts.repository.ts` — preview, listado, detalle, último conteo y `registerCount`.
- `src/hooks/use-counts.ts` — `useCounts`, `useCountDetail`, `useLastCount`.
- `src/components/counts/count-form.tsx` — lista, inputs, resumen y confirmación.
- `src/app/count/new.tsx`
- `src/app/count/[id].tsx`

### Modificados

- `guide.md` — fuente de verdad (primero).
- `src/database/migrations.ts` — migración 2 + vista.
- `src/database/types.ts` — `Count`, líneas, `HistoryType`, `productId` nullable.
- `src/database/repositories/history.repository.ts` — tipo `count`, filtro por producto, mapeo.
- `src/database/repositories/dashboard.repository.ts` — actividad con `LEFT JOIN`, último conteo.
- `src/hooks/use-dashboard.ts`
- `src/app/_layout.tsx` — rutas `count/new` y `count/[id]`; quitar `sale/new`.
- `src/app/(tabs)/movements.tsx`
- `src/app/(tabs)/history.tsx`
- `src/app/(tabs)/index.tsx` — CTA de conteo y actividad.
- `src/app/product/[id]/index.tsx`
- `src/app/history/[type]/[id].tsx` — los conteos no pasan por esta ruta.

### Eliminados (venta manual)

- `src/app/sale/new.tsx`
- `src/components/movements/sale-form.tsx`
- `src/hooks/use-sales.ts`
- `src/database/repositories/sales.repository.ts` (la lógica de snapshot se traslada a `counts.repository.ts`)

## 7. Orden de implementación

1. **`guide.md`**: objetivo, tabla de decisiones, modelo `counts`, regla 4.5, rutas, módulo nuevo y estado.
2. **Migración 2 + tipos**: crear `counts`, columnas, índices y vista.
3. **`counts.repository.ts`**: preview y `registerCount` transaccional; helpers de margen.
4. **Limpiar venta manual**: rutas, formulario, hook y repositorio; quitar botón en producto.
5. **Pantalla de conteo**: formulario, búsqueda, solo diferencias, resumen y confirmación.
6. **Detalle + Movimientos**: lista de conteos y detalle.
7. **Historial e Inicio**: agrupación, filtros, actividad y CTA con último conteo.
8. **QA**: recorrido completo, `npx tsc --noEmit` y `npx expo lint`.

Antes de empezar: hay cambios sin commitear en el árbol (`guide.md` y varios archivos de la sesión anterior). Conviene commitear o guardar ese trabajo para separar el nuevo módulo.

## 8. Criterios de aceptación

- Un conteo con faltantes deja el stock exactamente en lo contado y crea **una** venta conjunta con precios congelados y total correcto.
- Los sobrantes crean ajustes de entrada ligados al mismo conteo.
- Los productos sin diferencia no generan movimientos.
- El historial muestra el conteo como un solo evento y su detalle conserva cada línea.
- El filtro por producto encuentra los conteos que lo incluyen.
- No queda ningún acceso a venta manual.
- La data existente (compras, ventas y ajustes previos) sigue visible.
- `npx tsc --noEmit` y `npx expo lint` pasan.

## 9. Riesgos y cuidados

- **Migración sobre data real:** no usar `resetDatabase`; la migración 2 debe ser aditiva. Probar con una base existente (user_version = 1).
- **Vista `history`:** recrearla y verificar que `listRecentActivity` use `LEFT JOIN` para no perder la fila del conteo.
- **Tipos nullables:** `productId` y `productUnit` nulos obligan a revisar Historial, Inicio y el detalle; usar discriminación por `type`.
- **Inputs en lista larga:** mantener el estado por `productId` para que el teclado no pierda el foco al filtrar.
- **Sin precios:** validar que el total del conteo no rompa `sales.total` (permite 0) y que el margen quede NULL, no negativo.
