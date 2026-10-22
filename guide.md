# Guía de la aplicación — Mi Almacén

> Documento base de toda la aplicación. Cualquier decisión de producto, datos o interfaz debe respetar esta guía. Si una decisión cambia, primero se actualiza este documento.

## 1. Objetivo

Aplicación móvil **offline-first** para administrar un almacén pequeño de forma simple:

- Catálogo de productos con stock accesible.
- Compras que actualizan stock y precios.
- Ventas que descuentan stock y congelan precios.
- Ajustes de inventario positivos o negativos.
- Estadísticas del valor del stock y alertas de agotamiento.
- Historial consultable de compras, ventas y ajustes.

La prioridad es la simplicidad: pocos campos, pocos pasos, una interfaz limpia y elegante.

## 2. Decisiones confirmadas

| Tema | Decisión |
| --- | --- |
| Plataforma | Expo SDK 57, React Native, Expo Router |
| Persistencia | SQLite local con `expo-sqlite` (sin red) |
| Dinero | Enteros en pesos, sin centavos (`10000` = `$10.000`) |
| Cantidades | Decimales hasta 3 posiciones (`0.5 lb`) |
| Unidad | Campo `unit` / **pesaje**: texto libre escrito por el usuario (`g`, `lb`, `unidad`, `caja`...) |
| Conversiones | No existen. Compras, ventas y stock usan siempre la unidad del producto |
| Precio de costo | Se define al registrar una compra, no al crear el producto |
| Precio de salida | Se calcula con un margen definido por el usuario |
| Margen máximo | Estrictamente menor a 30% (ley local) |
| Proveedores | No se incluyen |
| Valor del stock | Se muestran valor a costo y valor potencial a venta |
| Stock negativo | Prohibido |
| Borrado de productos | Suave, para conservar historial |
| Recalcular salida | Sí: al cambiar el costo, el precio de salida se recalcula con el margen guardado |

## 3. Modelo de datos

### `products`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | TEXT PK | Identificador generado localmente |
| `name` | TEXT | Nombre del producto |
| `unit` | TEXT | Pesaje / unidad base escrita por el usuario |
| `stock` | REAL | Existencia actual en la unidad base |
| `min_stock` | REAL | Umbral de stock bajo (`0` = sin alerta) |
| `last_price` | INTEGER NULL | Costo anterior por unidad |
| `current_price` | INTEGER NULL | Costo actual por unidad |
| `sale_price` | INTEGER NULL | Precio de salida calculado |
| `margin_percent` | REAL | Margen configurado por el usuario |
| `created_at` | INTEGER | Fecha en milisegundos |
| `updated_at` | INTEGER | Fecha en milisegundos |
| `archived_at` | INTEGER NULL | Borrado suave |

### `purchases`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | TEXT PK | Identificador |
| `product_id` | TEXT FK | Producto comprado |
| `quantity` | REAL | Cantidad comprada |
| `total` | INTEGER | Total pagado |
| `unit_cost` | INTEGER | `round(total / quantity)` |
| `previous_cost` | INTEGER NULL | `current_price` antes de la compra |
| `new_cost` | INTEGER | Nuevo `current_price` |
| `previous_sale_price` | INTEGER NULL | Precio de salida anterior |
| `new_sale_price` | INTEGER NULL | Precio de salida recalculado |
| `created_at` | INTEGER | Fecha |

### `sales`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | TEXT PK | Identificador |
| `product_id` | TEXT FK | Producto vendido |
| `quantity` | REAL | Cantidad vendida |
| `unit_price` | INTEGER | Precio de salida congelado |
| `cost_price` | INTEGER NULL | Costo congelado |
| `margin_percent` | REAL NULL | Margen congelado |
| `total` | INTEGER | Total de la venta |
| `created_at` | INTEGER | Fecha |

### `adjustments`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | TEXT PK | Identificador |
| `product_id` | TEXT FK | Producto ajustado |
| `quantity_delta` | REAL | Positivo agrega, negativo quita |
| `stock_before` | REAL | Stock antes del ajuste |
| `stock_after` | REAL | Stock después del ajuste |
| `unit_cost` | INTEGER NULL | Costo congelado al momento |
| `reason` | TEXT NULL | Motivo del ajuste |
| `created_at` | INTEGER | Fecha |

### Historial

Vista SQL `history` con `UNION ALL` de compras, ventas y ajustes. No se duplican datos: cada registro conserva sus precios y cantidades congelados.

## 4. Reglas de negocio

### 4.1 Crear producto

Se registran solo: nombre, pesaje/unidad y stock mínimo. Los precios nacen en `NULL`. El margen puede configurarse después.

### 4.2 Registrar compra

1. El usuario ingresa producto, cantidad y total pagado.
2. `unit_cost = round(total / quantity)`.
3. Antes de confirmar, la interfaz muestra:
   - costo anterior,
   - costo nuevo por unidad,
   - margen definido,
   - **precio de salida nuevo** calculado con ese margen.
4. Al confirmar, en una sola transacción:
   - `last_price = current_price`
   - `current_price = unit_cost`
   - `sale_price = calcularPrecioSalida(unit_cost, margin_percent)` si el margen es mayor que cero
   - `stock = stock + quantity`
   - se guarda la compra con los valores anteriores y nuevos.

### 4.3 Margen y precio de salida

- El margen se ingresa como porcentaje entre `0` y `29.9`.
- `precio = round(costo * (1 + margen / 100))`.
- La interfaz muestra el margen efectivo después del redondeo.
- Si el margen efectivo resultante es `>= 30%`, se reduce el precio en 1 peso hasta cumplir la regla.
- También se puede escribir el precio de salida directamente; la interfaz muestra el margen resultante y lo limita a menos de 30%.

### 4.4 Registrar venta

1. Se elige producto y cantidad.
2. Se valida que exista `sale_price` y que `stock >= quantity`.
3. Se congela `unit_price`, `cost_price` y `margin_percent`.
4. `total = round(quantity * unit_price)`.
5. `stock = stock - quantity`.
6. La venta queda en el historial con los precios del momento.

### 4.5 Ajustes

- **Directo:** suma o resta una cantidad.
- **Por conteo:** el usuario escribe el stock contado y la app calcula la diferencia.
- Se guarda `stock_before`, `stock_after`, `quantity_delta`, costo congelado y motivo.
- No se permite que `stock_after` sea negativo.

### 4.6 Stock bajo

Un producto está en alerta cuando `min_stock > 0` y `stock <= min_stock`.

### 4.7 Estadísticas

- Valor a costo: `Σ(stock × current_price)`.
- Valor a venta: `Σ(stock × sale_price)`.
- Ganancia potencial: valor a venta − valor a costo.
- Total de unidades: `Σ(stock)`.
- Total de productos activos.
- Cantidad de productos en alerta.

## 5. Arquitectura técnica

- `expo-sqlite` con `SQLiteProvider` y migraciones versionadas por `PRAGMA user_version`.
- `PRAGMA journal_mode = WAL` y `PRAGMA foreign_keys = ON`.
- Repositorios con SQL preparado. Sin ORM ni dependencias nuevas.
- Mutaciones de stock dentro de `withExclusiveTransactionAsync`.
- Contexto de datos con `revision` + `refresh()` para recargar listas después de cada operación.
- Formato y redondeo centralizados en utilidades.
- Toda la data vive en el dispositivo; la app no depende de internet.

### Estructura

```
src/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx          Inicio / estadísticas
      inventory.tsx      Inventario
      movements.tsx      Compras, ventas y ajustes
      history.tsx        Historial unificado
    product/
      new.tsx
      [id].tsx
      [id]/edit.tsx
    purchase/new.tsx
    sale/new.tsx
    adjustment/new.tsx
    history/[type]/[id].tsx
  components/
    ui/                  Primitivos del sistema de diseño
    products/
    movements/
    dashboard/
  database/
    provider.tsx
    migrations.ts
    repositories/
    utils/
  theme/
    colors.ts            Colores para props que no aceptan className
  utils/
    cn.ts
```

## 6. Sistema de diseño

- Tokens de color en `src/global.css` y `tailwind.config.js`.
- Colores para props nativas (headers, placeholders) en `src/theme/colors.ts`.
- Primitivos en `src/components/ui/`:
  `Screen`, `AppText`, `Button`, `Card`, `TextField`, `Badge`, `EmptyState`, `MoneyText`.
- Paleta cálida y clara: marfil, blancos y piedra; acento café/taupe. Verde, ámbar y terracota para estados.
- Tarjetas con borde sutil; sin sombras pesadas.
- Números monetarios con `tabular-nums`.
- Feedback de presión con escala `0.96` y 150 ms.
- Formularios en modales tipo sheet con acción principal fija.
- Solo modo claro: sin azul ni bloques oscuros; contraste alto y superficies blancas.
- Estados vacíos, de carga y error cuidados.

## 7. Módulos de implementación

### Módulo 0 — Base

- Guía, tokens y componentes UI.
- Provider SQLite, migración inicial, tipos y utilidades.
- Shell de navegación con 4 tabs y pantallas base.
- **Criterio de aceptación:** la app abre, crea la base de datos, navega y pasa `tsc` + `lint`.

### Módulo 1 — Productos

- CRUD, archivar, búsqueda y filtro de stock bajo.
- Lista, detalle y formulario de producto.
- Calculadora de margen y precio de salida.
- **Criterio:** crear, buscar, editar y archivar productos; margen siempre menor a 30%.

### Módulo 2 — Compras

- Registro con costo unitario en vivo y vista previa del nuevo precio de salida.
- Actualización transaccional de stock y precios.
- **Criterio:** una compra actualiza stock, costo anterior, costo actual y precio de salida.

### Módulo 3 — Ventas

- Venta con precio congelado, validación de stock y ganancia calculada.
- **Criterio:** la venta descuenta stock y conserva los precios del momento.

### Módulo 4 — Ajustes

- Ajuste directo y por conteo.
- **Criterio:** el stock queda cuadrado y el ajuste queda registrado con motivo.

### Módulo 5 — Inicio y estadísticas

- Tarjetas de valor a costo, valor a venta, ganancia potencial y unidades.
- Productos por agotarse y actividad reciente.
- **Criterio:** totales correctos y alerta de stock bajo funcionando.

### Módulo 6 — Historial

- Lista unificada con filtros por tipo, producto y fecha.
- Detalle con precios y stock congelados.
- **Criterio:** compras, ventas y ajustes se consultan sin perder su snapshot.

### Módulo 7 — QA y pulido

- Recorrido completo, estados vacíos, teclado, accesibilidad y contraste en modo claro.
- `npx tsc --noEmit` y `npx expo lint`.

## 8. Estado del proyecto

- [x] Limpieza del código anterior y configuración de SQLite.
- [x] Definición de producto, datos e interfaz.
- [x] Módulo 0 — Base.
- [x] Módulo 1 — Productos.
- [x] Módulo 2 — Compras.
- [ ] Módulo 3 — Ventas.
- [ ] Módulo 4 — Ajustes.
- [ ] Módulo 5 — Inicio y estadísticas.
- [ ] Módulo 6 — Historial.
- [ ] Módulo 7 — QA y pulido.
