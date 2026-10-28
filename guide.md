# Guía de la aplicación — Mi Almacén

> Documento base de toda la aplicación. Cualquier decisión de producto, datos o interfaz debe respetar esta guía. Si una decisión cambia, primero se actualiza este documento.

## 1. Objetivo

Aplicación móvil **offline-first** para administrar un almacén pequeño de forma simple:

- Catálogo de productos con stock accesible.
- Compras que actualizan stock y precios.
- Conteo semanal que ajusta el stock y registra la diferencia como venta conjunta.
- Ajustes de inventario positivos o negativos.
- Estadísticas del valor del stock y alertas de agotamiento.
- Historial consultable de compras, conteos y ajustes.

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
| Precio de salida | Se calcula con un margen definido por el usuario o se define directamente |
| Margen máximo | Estrictamente menor a 30% (ley local) |
| Proveedores | No se incluyen |
| Valor del stock | Se muestran valor a costo y valor potencial a venta |
| Stock negativo | Prohibido |
| Registro de ventas | Nace solo del conteo semanal; no existe venta manual |
| Conteo | Semanal, todos los productos activos en una sola pantalla |
| Diferencias del conteo | Los faltantes son venta; los sobrantes son ajuste de entrada |
| Venta del conteo | Venta conjunta con una línea por producto y precios congelados |
| Borrado de productos | Suave y solo con stock en cero; si hay stock se advierte y se pide ajustarlo |
| Recalcular salida | Al cambiar el costo se elige entre recalcular con el margen guardado, mantener el precio actual o definir el precio de venta directamente |

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
| `margin_percent` | REAL | Margen configurado en la compra (0 = sin definir) |
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
| `count_id` | TEXT NULL | Conteo que originó la venta (`NULL` = venta manual histórica) |
| `stock_before` | REAL NULL | Stock antes del conteo |
| `stock_after` | REAL NULL | Stock después del conteo |
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
| `count_id` | TEXT NULL | Conteo que originó la entrada (`NULL` = ajuste manual) |
| `created_at` | INTEGER | Fecha |

### `counts`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | TEXT PK | Identificador del conteo |
| `total_sale` | INTEGER | Suma congelada de las líneas de venta |
| `units_sold` | REAL | Unidades faltantes (vendidas) |
| `units_added` | REAL | Unidades sobrantes (entradas) |
| `sale_lines` | INTEGER | Productos con faltante |
| `adjustment_lines` | INTEGER | Productos con sobrante |
| `created_at` | INTEGER | Fecha del conteo |

### Historial

Vista SQL `history` con `UNION ALL` de compras, ventas sueltas, ajustes sueltos y conteos. Las ventas y ajustes con `count_id` no aparecen por separado: el conteo se muestra como un solo evento. No se duplican datos: cada registro conserva sus precios y cantidades congelados.

## 4. Reglas de negocio

### 4.1 Crear producto

Se registran solo: nombre, pesaje/unidad y stock mínimo. Los precios nacen en `NULL` y el margen en `0`. El costo, el margen y el precio de salida se configuran en la primera compra.

### 4.2 Registrar compra

1. El usuario ingresa producto, cantidad y total pagado.
2. `unit_cost = round(total / quantity)`.
3. Antes de confirmar, la interfaz muestra costo anterior, costo nuevo por unidad, margen definido y tres opciones de precio de salida:
   - **recalcular** con el margen guardado (redondeando al múltiplo de 5 superior inmediato),
   - **mantener** el precio de salida actual, o
   - **definir precio de venta** escribiendo directamente el precio final; la interfaz muestra el margen resultante.
4. Mantener el precio solo se permite si el margen efectivo resultante es menor a 30%; si es negativo se advierte. El precio de venta directo debe ser mayor a `0` y producir un margen menor a `30%`; si queda por debajo del costo se advierte pero se permite.
5. Al confirmar, en una sola transacción:
   - `last_price = current_price`
   - `current_price = unit_cost`
   - `margin_percent` = margen guardado, o el margen efectivo del precio de venta directo (`0` si es negativo)
   - `sale_price` = precio elegido (recalculado, mantenido o definido directamente)
   - `stock = stock + quantity`
   - se guarda la compra con los valores anteriores y nuevos.

### 4.3 Margen y precio de salida

- El margen se ingresa como porcentaje entre `0` y `29.9`.
- `precio = costo * (1 + margen / 100)`, redondeado al **múltiplo de 5 superior inmediato**.
- La interfaz muestra el margen efectivo después del redondeo.
- Si el múltiplo superior alcanza o supera `30%` de margen efectivo, se usa el múltiplo de 5 inferior más cercano que cumpla la regla.
- Con margen `0` el precio de salida es el costo redondeado, sin forzar múltiplo de 5.
- También se puede escribir el precio de salida directamente; la interfaz muestra el margen resultante y lo limita a menos de 30%.
- Al definir el precio de venta directamente en una compra, el margen efectivo resultante queda guardado en el producto para los siguientes recálculos. Si el margen es negativo se guarda `0`.

### 4.4 Conteo semanal y venta conjunta

1. El usuario abre el conteo y ve todos los productos activos con su stock del sistema.
2. Escribe lo contado por producto; un campo vacío significa "sin cambio". El stock contado no puede ser negativo.
3. `delta = round(contado, 3) − stock`.
4. `delta = 0` no genera movimiento.
5. `delta < 0` genera una línea de venta:
   - `quantity = |delta|`, con `stock_before` y `stock_after` congelados.
   - `unit_price = sale_price` congelado, `cost_price = current_price` y `margin_percent` efectivo.
   - `total = round(|delta| × unit_price)`.
   - Si el producto no tiene precio de salida, la línea queda en `$0`; la interfaz lo advierte antes de confirmar.
6. `delta > 0` genera un ajuste de entrada con motivo `"Sobrante de conteo"`, ligado al mismo conteo.
7. Al confirmar, en una sola transacción se crea el `counts`, se guardan las líneas y el stock de cada producto contado queda exactamente en `contado`.
8. La venta es conjunta: un conteo tiene una cabecera y una línea por producto. El historial muestra el conteo como un evento único y su detalle conserva cada línea.
9. Un conteo no se edita ni se elimina; un error se corrige con otro conteo.
10. Si no hay diferencias, no se registra nada.
11. El conteo no modifica costos, márgenes ni precios de salida del producto; solo el stock.

### 4.5 Ajustes

- **Directo:** suma o resta una cantidad.
- **Por conteo:** el usuario escribe el stock contado y la app calcula la diferencia.
- Se guarda `stock_before`, `stock_after`, `quantity_delta`, costo congelado y motivo.
- No se permite que `stock_after` sea negativo.
- Los ajustes manuales siguen disponibles para correcciones puntuales; no crean ventas.

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
- El conteo semanal crea cabecera, líneas de venta, entradas y updates de stock en una sola transacción.
- Las ventas no se registran manualmente: solo nacen de un conteo.
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
      index.tsx          Inicio / estadísticas y acceso al conteo
      inventory.tsx      Inventario
      movements.tsx      Compras, conteos y ajustes
      history.tsx        Historial unificado
    product/
      new.tsx
      [id].tsx
      [id]/edit.tsx
    purchase/new.tsx
    count/
      new.tsx            Conteo semanal
      [id].tsx           Detalle del conteo
    adjustment/new.tsx
    history/[type]/[id].tsx
  components/
    ui/                  Primitivos del sistema de diseño
    products/
    movements/
    counts/
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
- El conteo usa una lista con un campo por producto, resumen fijo y confirmación con totales.
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
- Lista, detalle y formulario de datos básicos del producto.
- El margen y el precio de salida se configuran en la compra, no al crear.
- **Criterio:** crear, buscar, editar y archivar productos; el margen se define en las compras y siempre queda menor a 30%.

### Módulo 2 — Compras

- Registro con costo unitario en vivo y vista previa del nuevo precio de salida.
- Tres opciones de salida: mantener precio, recalcular con el margen guardado o definir el precio de venta directamente.
- Actualización transaccional de stock, costos, margen y precio de salida.
- **Criterio:** una compra actualiza stock, costo anterior, costo actual, margen y precio de salida según la opción elegida.

### Módulo 3 — Ventas

- Venta con precio congelado, validación de stock y ganancia calculada.
- Las ventas nacen del conteo semanal; no hay registro manual.
- **Criterio:** la venta descuenta stock y conserva los precios del momento.

### Módulo 4 — Ajustes

- Ajuste directo y por conteo.
- **Criterio:** el stock queda cuadrado y el ajuste queda registrado con motivo.

### Módulo 5 — Inicio y estadísticas

- Tarjetas de valor a costo, valor a venta, ganancia potencial y unidades.
- Acceso al conteo semanal con el último conteo realizado.
- Productos por agotarse y actividad reciente.
- **Criterio:** totales correctos y alerta de stock bajo funcionando.

### Módulo 6 — Historial

- Lista unificada con filtros por tipo, producto y fecha.
- Los conteos se muestran como un evento único; su detalle conserva cada línea.
- Detalle con precios y stock congelados.
- **Criterio:** compras, conteos y ajustes se consultan sin perder su snapshot.

### Módulo 7 — Conteo semanal

- Pantalla única con todos los productos activos: stock del sistema, campo contado y resumen fijo.
- Faltantes como venta conjunta; sobrantes como ajuste de entrada; todo en una transacción.
- Detalle del conteo, pestaña de conteos en Movimientos e historial agrupado.
- Eliminación del registro manual de ventas de la interfaz.
- **Criterio:** el stock queda exactamente en lo contado, la venta conjunta conserva precios y el historial no duplica líneas.

### Módulo 8 — QA y pulido

- Recorrido completo, estados vacíos, teclado, accesibilidad y contraste en modo claro.
- `npx tsc --noEmit` y `npx expo lint`.

## 8. Estado del proyecto

- [x] Limpieza del código anterior y configuración de SQLite.
- [x] Definición de producto, datos e interfaz.
- [x] Módulo 0 — Base.
- [x] Módulo 1 — Productos.
- [x] Módulo 2 — Compras.
- [x] Módulo 3 — Ventas.
- [x] Módulo 4 — Ajustes.
- [x] Módulo 5 — Inicio y estadísticas.
- [x] Módulo 6 — Historial.
- [ ] Módulo 7 — Conteo semanal.
- [ ] Módulo 8 — QA y pulido.
