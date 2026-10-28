
# Inventario por ajuste de stock en vez de ventas

**Session ID:** ses_e7d2d110bffeS1rPQLKKaeW5Zy
**Created:** 10/28/2026, 10:03:44 AM
**Updated:** 10/28/2026, 10:11:44 AM

---

## User

necesito hacer un cambio importante en mi aplicacacion , mi cliente no necesita registrar ventas , su objetivo es hacer inventario , te explico el todos los domingos cuenta su almacen , verifica la mercancia que le queda de cada tipo , y el quiere ajutar el stock , ocn esa mercancia que le queda y la diferencia con el total anterior es lo que se registra como venta 

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 8.4s)

_Thinking:_

Let me start by understanding the codebase. I need to read guide.md (the source of truth) and explore the app structure.

Let me use tools to read guide.md and explore.

**Tool: bash**

**Input:**
```json
{
  "command": "ls -la && echo \"---\" && cat package.json 2>/dev/null | head -60"
}
```

**Output:**
```
total 424
drwxr-xr-x. 1 viticomc viticomc    570 Oct 27 20:06 .
drwxr-xr-x. 1 viticomc viticomc    726 Oct 27 15:01 ..
drwxr-xr-x. 1 viticomc viticomc     12 Aug 28 11:52 .agents
-rw-r--r--. 1 viticomc viticomc    410 Oct 22 10:39 AGENTS.md
-rw-r--r--. 1 viticomc viticomc   1532 Oct 22 11:03 app.json
drwxr-xr-x. 1 viticomc viticomc     30 Aug 28 10:51 assets
-rw-r--r--. 1 viticomc viticomc    145 Aug 28 12:02 babel.config.js
drwxr-xr-x. 1 viticomc viticomc     26 Aug 28 11:00 .claude
-rw-r--r--. 1 viticomc viticomc     11 Aug 28 11:00 CLAUDE.md
drwxr-xr-x. 1 viticomc viticomc     48 Oct 22 11:50 dist
-rw-r--r--. 1 viticomc viticomc    236 Sep 11 06:49 eslint.config.js
drwxr-xr-x. 1 viticomc viticomc     94 Sep 11 06:49 .expo
-rw-r--r--. 1 viticomc viticomc    110 Oct 27 20:06 expo-env.d.ts
drwxr-xr-x. 1 viticomc viticomc    182 Oct 27 14:33 .git
-rw-r--r--. 1 viticomc viticomc    514 Sep 16 06:34 .gitignore
-rw-r--r--. 1 viticomc viticomc  11836 Oct 27 16:22 guide.md
-rw-r--r--. 1 viticomc viticomc   1106 Aug 28 10:51 LICENSE
-rw-r--r--. 1 viticomc viticomc    233 Aug 28 11:39 metro.config.js
-rw-r--r--. 1 viticomc viticomc    161 Aug 28 11:13 nativewind-env.d.ts
drwxr-xr-x. 1 viticomc viticomc   1288 Oct 22 10:15 node_modules
-rw-r--r--. 1 viticomc viticomc   1884 Oct 22 10:15 package.json
-rw-r--r--. 1 viticomc viticomc 356235 Sep 22 08:04 pnpm-lock.yaml
-rw-------. 1 viticomc viticomc     36 Oct 22 10:07 pnpm-workspace.yaml
-rw-r--r--. 1 viticomc viticomc   2183 Aug 28 10:51 README.md
-rw-r--r--. 1 viticomc viticomc   2730 Sep 17 06:47 skills-lock.json
drwxr-xr-x. 1 viticomc viticomc     92 Oct 22 10:47 src
-rw-r--r--. 1 viticomc viticomc   1601 Oct 22 11:33 tailwind.config.js
-rw-r--r--. 1 viticomc viticomc    324 Aug 28 11:13 tsconfig.json
drwxr-xr-x. 1 viticomc viticomc     56 Aug 28 10:51 .vscode
---
{
  "name": "mi-almacen",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo/ui": "~57.0.14",
    "@expo/vector-icons": "^15.1.1",
    "clsx": "^2.1.1",
    "expo": "~57.0.18",
    "expo-constants": "~57.0.16",
    "expo-device": "~57.0.1",
    "expo-file-system": "~57.0.6",
    "expo-font": "~57.0.2",
    "expo-glass-effect": "~57.0.1",
    "expo-image": "~57.0.3",
    "expo-image-picker": "~57.0.16",
    "expo-linking": "~57.0.8",
    "expo-router": "~57.0.17",
    "expo-splash-screen": "~57.0.8",
    "expo-sqlite": "~57.0.2",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.2",
    "expo-system-ui": "~57.0.3",
    "expo-web-browser": "~57.0.2",
    "nativewind": "^4.2.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-css-interop": "0.2.6",
    "react-native-dropdown-picker": "^5.4.6",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-gifted-charts": "^1.4.78",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "^15.15.5",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.1",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "babel-preset-expo": "^57.0.9",
    "eslint": "^9.39.4",
    "eslint-config-expo": "~57.0.2",
    "prettier-plugin-tailwindcss": "^0.5.14",
    "tailwindcss": "^3.4.19",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true,
  "packageManager": "pnpm@12.5.1+sha512.e3f305bc784a2bc89f5ad3b6138889470fae8d2af5f36b61216ec91c2c3d64089775f9de38aac331044ea40f245cb0d5666392dfdf65824e1907ef6a2c62de5f"
}

```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/guide.md"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/guide.md</path>
<type>file</type>
<content>
1: # Guía de la aplicación — Mi Almacén
2: 
3: > Documento base de toda la aplicación. Cualquier decisión de producto, datos o interfaz debe respetar esta guía. Si una decisión cambia, primero se actualiza este documento.
4: 
5: ## 1. Objetivo
6: 
7: Aplicación móvil **offline-first** para administrar un almacén pequeño de forma simple:
8: 
9: - Catálogo de productos con stock accesible.
10: - Compras que actualizan stock y precios.
11: - Ventas que descuentan stock y congelan precios.
12: - Ajustes de inventario positivos o negativos.
13: - Estadísticas del valor del stock y alertas de agotamiento.
14: - Historial consultable de compras, ventas y ajustes.
15: 
16: La prioridad es la simplicidad: pocos campos, pocos pasos, una interfaz limpia y elegante.
17: 
18: ## 2. Decisiones confirmadas
19: 
20: | Tema | Decisión |
21: | --- | --- |
22: | Plataforma | Expo SDK 57, React Native, Expo Router |
23: | Persistencia | SQLite local con `expo-sqlite` (sin red) |
24: | Dinero | Enteros en pesos, sin centavos (`10000` = `$10.000`) |
25: | Cantidades | Decimales hasta 3 posiciones (`0.5 lb`) |
26: | Unidad | Campo `unit` / **pesaje**: texto libre escrito por el usuario (`g`, `lb`, `unidad`, `caja`...) |
27: | Conversiones | No existen. Compras, ventas y stock usan siempre la unidad del producto |
28: | Precio de costo | Se define al registrar una compra, no al crear el producto |
29: | Precio de salida | Se calcula con un margen definido por el usuario o se define directamente |
30: | Margen máximo | Estrictamente menor a 30% (ley local) |
31: | Proveedores | No se incluyen |
32: | Valor del stock | Se muestran valor a costo y valor potencial a venta |
33: | Stock negativo | Prohibido |
34: | Borrado de productos | Suave y solo con stock en cero; si hay stock se advierte y se pide ajustarlo |
35: | Recalcular salida | Al cambiar el costo se elige entre recalcular con el margen guardado, mantener el precio actual o definir el precio de venta directamente |
36: 
37: ## 3. Modelo de datos
38: 
39: ### `products`
40: 
41: | Campo | Tipo | Descripción |
42: | --- | --- | --- |
43: | `id` | TEXT PK | Identificador generado localmente |
44: | `name` | TEXT | Nombre del producto |
45: | `unit` | TEXT | Pesaje / unidad base escrita por el usuario |
46: | `stock` | REAL | Existencia actual en la unidad base |
47: | `min_stock` | REAL | Umbral de stock bajo (`0` = sin alerta) |
48: | `last_price` | INTEGER NULL | Costo anterior por unidad |
49: | `current_price` | INTEGER NULL | Costo actual por unidad |
50: | `sale_price` | INTEGER NULL | Precio de salida calculado |
51: | `margin_percent` | REAL | Margen configurado en la compra (0 = sin definir) |
52: | `created_at` | INTEGER | Fecha en milisegundos |
53: | `updated_at` | INTEGER | Fecha en milisegundos |
54: | `archived_at` | INTEGER NULL | Borrado suave |
55: 
56: ### `purchases`
57: 
58: | Campo | Tipo | Descripción |
59: | --- | --- | --- |
60: | `id` | TEXT PK | Identificador |
61: | `product_id` | TEXT FK | Producto comprado |
62: | `quantity` | REAL | Cantidad comprada |
63: | `total` | INTEGER | Total pagado |
64: | `unit_cost` | INTEGER | `round(total / quantity)` |
65: | `previous_cost` | INTEGER NULL | `current_price` antes de la compra |
66: | `new_cost` | INTEGER | Nuevo `current_price` |
67: | `previous_sale_price` | INTEGER NULL | Precio de salida anterior |
68: | `new_sale_price` | INTEGER NULL | Precio de salida recalculado |
69: | `created_at` | INTEGER | Fecha |
70: 
71: ### `sales`
72: 
73: | Campo | Tipo | Descripción |
74: | --- | --- | --- |
75: | `id` | TEXT PK | Identificador |
76: | `product_id` | TEXT FK | Producto vendido |
77: | `quantity` | REAL | Cantidad vendida |
78: | `unit_price` | INTEGER | Precio de salida congelado |
79: | `cost_price` | INTEGER NULL | Costo congelado |
80: | `margin_percent` | REAL NULL | Margen congelado |
81: | `total` | INTEGER | Total de la venta |
82: | `created_at` | INTEGER | Fecha |
83: 
84: ### `adjustments`
85: 
86: | Campo | Tipo | Descripción |
87: | --- | --- | --- |
88: | `id` | TEXT PK | Identificador |
89: | `product_id` | TEXT FK | Producto ajustado |
90: | `quantity_delta` | REAL | Positivo agrega, negativo quita |
91: | `stock_before` | REAL | Stock antes del ajuste |
92: | `stock_after` | REAL | Stock después del ajuste |
93: | `unit_cost` | INTEGER NULL | Costo congelado al momento |
94: | `reason` | TEXT NULL | Motivo del ajuste |
95: | `created_at` | INTEGER | Fecha |
96: 
97: ### Historial
98: 
99: Vista SQL `history` con `UNION ALL` de compras, ventas y ajustes. No se duplican datos: cada registro conserva sus precios y cantidades congelados.
100: 
101: ## 4. Reglas de negocio
102: 
103: ### 4.1 Crear producto
104: 
105: Se registran solo: nombre, pesaje/unidad y stock mínimo. Los precios nacen en `NULL` y el margen en `0`. El costo, el margen y el precio de salida se configuran en la primera compra.
106: 
107: ### 4.2 Registrar compra
108: 
109: 1. El usuario ingresa producto, cantidad y total pagado.
110: 2. `unit_cost = round(total / quantity)`.
111: 3. Antes de confirmar, la interfaz muestra costo anterior, costo nuevo por unidad, margen definido y tres opciones de precio de salida:
112:    - **recalcular** con el margen guardado (redondeando al múltiplo de 5 superior inmediato),
113:    - **mantener** el precio de salida actual, o
114:    - **definir precio de venta** escribiendo directamente el precio final; la interfaz muestra el margen resultante.
115: 4. Mantener el precio solo se permite si el margen efectivo resultante es menor a 30%; si es negativo se advierte. El precio de venta directo debe ser mayor a `0` y producir un margen menor a `30%`; si queda por debajo del costo se advierte pero se permite.
116: 5. Al confirmar, en una sola transacción:
117:    - `last_price = current_price`
118:    - `current_price = unit_cost`
119:    - `margin_percent` = margen guardado, o el margen efectivo del precio de venta directo (`0` si es negativo)
120:    - `sale_price` = precio elegido (recalculado, mantenido o definido directamente)
121:    - `stock = stock + quantity`
122:    - se guarda la compra con los valores anteriores y nuevos.
123: 
124: ### 4.3 Margen y precio de salida
125: 
126: - El margen se ingresa como porcentaje entre `0` y `29.9`.
127: - `precio = costo * (1 + margen / 100)`, redondeado al **múltiplo de 5 superior inmediato**.
128: - La interfaz muestra el margen efectivo después del redondeo.
129: - Si el múltiplo superior alcanza o supera `30%` de margen efectivo, se usa el múltiplo de 5 inferior más cercano que cumpla la regla.
130: - Con margen `0` el precio de salida es el costo redondeado, sin forzar múltiplo de 5.
131: - También se puede escribir el precio de salida directamente; la interfaz muestra el margen resultante y lo limita a menos de 30%.
132: - Al definir el precio de venta directamente en una compra, el margen efectivo resultante queda guardado en el producto para los siguientes recálculos. Si el margen es negativo se guarda `0`.
133: 
134: ### 4.4 Registrar venta
135: 
136: 1. Se elige producto y cantidad.
137: 2. Se valida que exista `sale_price` y que `stock >= quantity`.
138: 3. Se congela `unit_price`, `cost_price` y `margin_percent`.
139: 4. `total = round(quantity * unit_price)`.
140: 5. `stock = stock - quantity`.
141: 6. La venta queda en el historial con los precios del momento.
142: 
143: ### 4.5 Ajustes
144: 
145: - **Directo:** suma o resta una cantidad.
146: - **Por conteo:** el usuario escribe el stock contado y la app calcula la diferencia.
147: - Se guarda `stock_before`, `stock_after`, `quantity_delta`, costo congelado y motivo.
148: - No se permite que `stock_after` sea negativo.
149: 
150: ### 4.6 Stock bajo
151: 
152: Un producto está en alerta cuando `min_stock > 0` y `stock <= min_stock`.
153: 
154: ### 4.7 Estadísticas
155: 
156: - Valor a costo: `Σ(stock × current_price)`.
157: - Valor a venta: `Σ(stock × sale_price)`.
158: - Ganancia potencial: valor a venta − valor a costo.
159: - Total de unidades: `Σ(stock)`.
160: - Total de productos activos.
161: - Cantidad de productos en alerta.
162: 
163: ## 5. Arquitectura técnica
164: 
165: - `expo-sqlite` con `SQLiteProvider` y migraciones versionadas por `PRAGMA user_version`.
166: - `PRAGMA journal_mode = WAL` y `PRAGMA foreign_keys = ON`.
167: - Repositorios con SQL preparado. Sin ORM ni dependencias nuevas.
168: - Mutaciones de stock dentro de `withExclusiveTransactionAsync`.
169: - Contexto de datos con `revision` + `refresh()` para recargar listas después de cada operación.
170: - Formato y redondeo centralizados en utilidades.
171: - Toda la data vive en el dispositivo; la app no depende de internet.
172: 
173: ### Estructura
174: 
175: ```
176: src/
177:   app/
178:     _layout.tsx
179:     (tabs)/
180:       _layout.tsx
181:       index.tsx          Inicio / estadísticas
182:       inventory.tsx      Inventario
183:       movements.tsx      Compras, ventas y ajustes
184:       history.tsx        Historial unificado
185:     product/
186:       new.tsx
187:       [id].tsx
188:       [id]/edit.tsx
189:     purchase/new.tsx
190:     sale/new.tsx
191:     adjustment/new.tsx
192:     history/[type]/[id].tsx
193:   components/
194:     ui/                  Primitivos del sistema de diseño
195:     products/
196:     movements/
197:     dashboard/
198:   database/
199:     provider.tsx
200:     migrations.ts
201:     repositories/
202:     utils/
203:   theme/
204:     colors.ts            Colores para props que no aceptan className
205:   utils/
206:     cn.ts
207: ```
208: 
209: ## 6. Sistema de diseño
210: 
211: - Tokens de color en `src/global.css` y `tailwind.config.js`.
212: - Colores para props nativas (headers, placeholders) en `src/theme/colors.ts`.
213: - Primitivos en `src/components/ui/`:
214:   `Screen`, `AppText`, `Button`, `Card`, `TextField`, `Badge`, `EmptyState`, `MoneyText`.
215: - Paleta cálida y clara: marfil, blancos y piedra; acento café/taupe. Verde, ámbar y terracota para estados.
216: - Tarjetas con borde sutil; sin sombras pesadas.
217: - Números monetarios con `tabular-nums`.
218: - Feedback de presión con escala `0.96` y 150 ms.
219: - Formularios en modales tipo sheet con acción principal fija.
220: - Solo modo claro: sin azul ni bloques oscuros; contraste alto y superficies blancas.
221: - Estados vacíos, de carga y error cuidados.
222: 
223: ## 7. Módulos de implementación
224: 
225: ### Módulo 0 — Base
226: 
227: - Guía, tokens y componentes UI.
228: - Provider SQLite, migración inicial, tipos y utilidades.
229: - Shell de navegación con 4 tabs y pantallas base.
230: - **Criterio de aceptación:** la app abre, crea la base de datos, navega y pasa `tsc` + `lint`.
231: 
232: ### Módulo 1 — Productos
233: 
234: - CRUD, archivar, búsqueda y filtro de stock bajo.
235: - Lista, detalle y formulario de datos básicos del producto.
236: - El margen y el precio de salida se configuran en la compra, no al crear.
237: - **Criterio:** crear, buscar, editar y archivar productos; el margen se define en las compras y siempre queda menor a 30%.
238: 
239: ### Módulo 2 — Compras
240: 
241: - Registro con costo unitario en vivo y vista previa del nuevo precio de salida.
242: - Tres opciones de salida: mantener precio, recalcular con el margen guardado o definir el precio de venta directamente.
243: - Actualización transaccional de stock, costos, margen y precio de salida.
244: - **Criterio:** una compra actualiza stock, costo anterior, costo actual, margen y precio de salida según la opción elegida.
245: 
246: ### Módulo 3 — Ventas
247: 
248: - Venta con precio congelado, validación de stock y ganancia calculada.
249: - **Criterio:** la venta descuenta stock y conserva los precios del momento.
250: 
251: ### Módulo 4 — Ajustes
252: 
253: - Ajuste directo y por conteo.
254: - **Criterio:** el stock queda cuadrado y el ajuste queda registrado con motivo.
255: 
256: ### Módulo 5 — Inicio y estadísticas
257: 
258: - Tarjetas de valor a costo, valor a venta, ganancia potencial y unidades.
259: - Productos por agotarse y actividad reciente.
260: - **Criterio:** totales correctos y alerta de stock bajo funcionando.
261: 
262: ### Módulo 6 — Historial
263: 
264: - Lista unificada con filtros por tipo, producto y fecha.
265: - Detalle con precios y stock congelados.
266: - **Criterio:** compras, ventas y ajustes se consultan sin perder su snapshot.
267: 
268: ### Módulo 7 — QA y pulido
269: 
270: - Recorrido completo, estados vacíos, teclado, accesibilidad y contraste en modo claro.
271: - `npx tsc --noEmit` y `npx expo lint`.
272: 
273: ## 8. Estado del proyecto
274: 
275: - [x] Limpieza del código anterior y configuración de SQLite.
276: - [x] Definición de producto, datos e interfaz.
277: - [x] Módulo 0 — Base.
278: - [x] Módulo 1 — Productos.
279: - [x] Módulo 2 — Compras.
280: - [x] Módulo 3 — Ventas.
281: - [x] Módulo 4 — Ajustes.
282: - [x] Módulo 5 — Inicio y estadísticas.
283: - [x] Módulo 6 — Historial.
284: - [ ] Módulo 7 — QA y pulido.

(End of file - total 284 lines)
</content>
```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 6.0s)

_Thinking:_

Now let me explore the source code structure.

**Tool: bash**

**Input:**
```json
{
  "command": "find src -type f | sort"
}
```

**Output:**
```
src/app/adjustment/new.tsx
src/app/history/[type]/[id].tsx
src/app/_layout.tsx
src/app/+not-found.tsx
src/app/product/[id]/edit.tsx
src/app/product/[id]/index.tsx
src/app/product/new.tsx
src/app/purchase/new.tsx
src/app/sale/new.tsx
src/app/(tabs)/history.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/inventory.tsx
src/app/(tabs)/_layout.tsx
src/app/(tabs)/movements.tsx
src/components/movements/adjustment-form.tsx
src/components/movements/purchase-form.tsx
src/components/movements/sale-form.tsx
src/components/products/product-form.tsx
src/components/products/product-picker.tsx
src/components/products/product-row.tsx
src/components/ui/app-text.tsx
src/components/ui/badge.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/empty-state.tsx
src/components/ui/index.ts
src/components/ui/money-text.tsx
src/components/ui/screen.tsx
src/components/ui/text-field.tsx
src/database/data-context.tsx
src/database/index.ts
src/database/migrations.ts
src/database/provider.tsx
src/database/repositories/adjustments.repository.ts
src/database/repositories/dashboard.repository.ts
src/database/repositories/history.repository.ts
src/database/repositories/products.repository.ts
src/database/repositories/purchases.repository.ts
src/database/repositories/sales.repository.ts
src/database/types.ts
src/database/utils/dates.ts
src/database/utils/ids.ts
src/database/utils/money.ts
src/database/utils/quantity.ts
src/global.css
src/hooks/use-adjustments.ts
src/hooks/use-dashboard.ts
src/hooks/use-history.ts
src/hooks/use-products.ts
src/hooks/use-purchases.ts
src/hooks/use-sales.ts
src/theme/colors.ts
src/utils/cn.ts
src/utils/input.ts

```

**Tool: bash**

**Input:**
```json
{
  "command": "cd /home/viticomc/Work/mi-almacen && git log --oneline -10 && echo \"---\" && git status --short"
}
```

**Output:**
```
86a4efe modulos de ventas, ajustes e historial
6fda631 cleaning
c9a9b47 movement page
3a4c71b color fix button
65ca1d5 v2
9dc98a9 update git ignore
f9928d9 refactoring
21bc9cf imagenes funkan
5ae6830 first commit
27850bf Initial commit
---
 M guide.md
 M src/app/product/[id]/index.tsx
 M src/components/movements/purchase-form.tsx
 M src/components/products/product-form.tsx
 M src/components/products/product-row.tsx
 M src/database/repositories/products.repository.ts
 M src/database/repositories/purchases.repository.ts

```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 6.5s)

_Thinking:_

Let me read the key files: migrations, repositories (sales, adjustments, dashboard, history), types, hooks, screens (movements, sale-form, adjustment-form, dashboard index, inventory), and the modified files.

Let me batch reads.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/migrations.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/migrations.ts</path>
<type>file</type>
<content>
1: import type { SQLiteDatabase } from "expo-sqlite";
2: 
3: export const DATABASE_NAME = "mi-almacen.db";
4: 
5: const PRODUCT_COLUMNS = [
6:   "id",
7:   "name",
8:   "unit",
9:   "stock",
10:   "min_stock",
11:   "last_price",
12:   "current_price",
13:   "sale_price",
14:   "margin_percent",
15:   "created_at",
16:   "updated_at",
17:   "archived_at",
18: ];
19: 
20: const migrations: ((db: SQLiteDatabase) => Promise<void>)[] = [
21:   async (db) => {
22:     await db.execAsync(`
23:       CREATE TABLE IF NOT EXISTS products (
24:         id TEXT PRIMARY KEY NOT NULL,
25:         name TEXT NOT NULL,
26:         unit TEXT NOT NULL,
27:         stock REAL NOT NULL DEFAULT 0 CHECK (stock >= 0),
28:         min_stock REAL NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
29:         last_price INTEGER,
30:         current_price INTEGER,
31:         sale_price INTEGER,
32:         margin_percent REAL NOT NULL DEFAULT 0 CHECK (margin_percent >= 0 AND margin_percent < 30),
33:         created_at INTEGER NOT NULL,
34:         updated_at INTEGER NOT NULL,
35:         archived_at INTEGER
36:       );
37: 
38:       CREATE TABLE IF NOT EXISTS purchases (
39:         id TEXT PRIMARY KEY NOT NULL,
40:         product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
41:         quantity REAL NOT NULL CHECK (quantity > 0),
42:         total INTEGER NOT NULL CHECK (total > 0),
43:         unit_cost INTEGER NOT NULL CHECK (unit_cost > 0),
44:         previous_cost INTEGER,
45:         new_cost INTEGER NOT NULL,
46:         previous_sale_price INTEGER,
47:         new_sale_price INTEGER,
48:         created_at INTEGER NOT NULL
49:       );
50: 
51:       CREATE TABLE IF NOT EXISTS sales (
52:         id TEXT PRIMARY KEY NOT NULL,
53:         product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
54:         quantity REAL NOT NULL CHECK (quantity > 0),
55:         unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
56:         cost_price INTEGER,
57:         margin_percent REAL,
58:         total INTEGER NOT NULL,
59:         created_at INTEGER NOT NULL
60:       );
61: 
62:       CREATE TABLE IF NOT EXISTS adjustments (
63:         id TEXT PRIMARY KEY NOT NULL,
64:         product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
65:         quantity_delta REAL NOT NULL CHECK (quantity_delta <> 0),
66:         stock_before REAL NOT NULL,
67:         stock_after REAL NOT NULL CHECK (stock_after >= 0),
68:         unit_cost INTEGER,
69:         reason TEXT,
70:         created_at INTEGER NOT NULL
71:       );
72: 
73:       CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
74:       CREATE INDEX IF NOT EXISTS idx_products_alert ON products(archived_at, min_stock, stock);
75:       CREATE INDEX IF NOT EXISTS idx_purchases_created ON purchases(created_at DESC);
76:       CREATE INDEX IF NOT EXISTS idx_sales_created ON sales(created_at DESC);
77:       CREATE INDEX IF NOT EXISTS idx_adjustments_created ON adjustments(created_at DESC);
78: 
79:       CREATE VIEW IF NOT EXISTS history AS
80:         SELECT
81:           'purchase' AS type,
82:           p.id AS id,
83:           p.product_id AS product_id,
84:           pr.name AS product_name,
85:           p.quantity AS quantity,
86:           p.total AS total,
87:           p.unit_cost AS unit_price,
88:           NULL AS reason,
89:           p.created_at AS created_at
90:         FROM purchases p
91:         JOIN products pr ON pr.id = p.product_id
92:         UNION ALL
93:         SELECT
94:           'sale',
95:           s.id,
96:           s.product_id,
97:           pr.name,
98:           s.quantity,
99:           s.total,
100:           s.unit_price,
101:           NULL,
102:           s.created_at
103:         FROM sales s
104:         JOIN products pr ON pr.id = s.product_id
105:         UNION ALL
106:         SELECT
107:           'adjustment',
108:           a.id,
109:           a.product_id,
110:           pr.name,
111:           a.quantity_delta,
112:           NULL,
113:           a.unit_cost,
114:           a.reason,
115:           a.created_at
116:         FROM adjustments a
117:         JOIN products pr ON pr.id = a.product_id;
118:     `);
119:   },
120: ];
121: 
122: export const DATABASE_VERSION = migrations.length;
123: 
124: function quoteIdentifier(name: string): string {
125:   return `"${name.replaceAll('"', '""')}"`;
126: }
127: 
128: async function tableExists(db: SQLiteDatabase, table: string): Promise<boolean> {
129:   const row = await db.getFirstAsync<{ name: string }>(
130:     "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
131:     table,
132:   );
133:   return row != null;
134: }
135: 
136: async function getTableColumns(
137:   db: SQLiteDatabase,
138:   table: string,
139: ): Promise<string[]> {
140:   if (!(await tableExists(db, table))) return [];
141: 
142:   const rows = await db.getAllAsync<{ name: string }>(
143:     `PRAGMA table_info(${quoteIdentifier(table)})`,
144:   );
145:   return rows.map((row) => row.name);
146: }
147: 
148: async function snapshotLegacyProducts(
149:   db: SQLiteDatabase,
150:   columns: string[],
151: ): Promise<void> {
152:   const has = (column: string) => columns.includes(column);
153:   const hasUnits = await tableExists(db, "product_units");
154:   const hasMovements = await tableExists(db, "inventory_movements");
155: 
156:   const unit = hasUnits
157:     ? `COALESCE((
158:         SELECT u.name FROM product_units u
159:         WHERE u.product_id = lp.id AND u.is_base = 1
160:         ORDER BY u.created_at ASC LIMIT 1
161:       ), 'Unidad')`
162:     : "'Unidad'";
163: 
164:   let stock = "0";
165:   if (has("current_stock")) {
166:     stock = "MAX(0, COALESCE(lp.current_stock, 0))";
167:   } else if (hasMovements) {
168:     stock = `MAX(0, COALESCE((
169:       SELECT SUM(
170:         CASE
171:           WHEN m.movement_type IN ('IN', 'ADJUSTMENT_IN') THEN m.quantity
172:           WHEN m.movement_type IN ('OUT', 'ADJUSTMENT_OUT') THEN -m.quantity
173:           ELSE 0
174:         END
175:       )
176:       FROM inventory_movements m
177:       WHERE m.product_id = lp.id
178:     ), 0))`;
179:   }
180: 
181:   let lastPrice = "NULL";
182:   if (has("last_cost")) {
183:     lastPrice =
184:       "CASE WHEN lp.last_cost > 0 THEN CAST(ROUND(lp.last_cost) AS INTEGER) ELSE NULL END";
185:   } else if (hasMovements) {
186:     lastPrice = `(
187:       SELECT CAST(ROUND(m.unit_cost) AS INTEGER)
188:       FROM inventory_movements m
189:       WHERE m.product_id = lp.id
190:         AND m.movement_type IN ('IN', 'ADJUSTMENT_IN')
191:         AND m.unit_cost IS NOT NULL
192:       ORDER BY m.movement_date DESC, m.created_at DESC, m.id DESC
193:       LIMIT 1
194:     )`;
195:   }
196: 
197:   let currentPrice = "NULL";
198:   if (has("average_cost")) {
199:     currentPrice =
200:       "CASE WHEN lp.average_cost > 0 THEN CAST(ROUND(lp.average_cost) AS INTEGER) ELSE NULL END";
201:   } else if (hasMovements) {
202:     currentPrice = `(
203:       SELECT CAST(ROUND(SUM(m.quantity * m.unit_cost) / SUM(m.quantity)) AS INTEGER)
204:       FROM inventory_movements m
205:       WHERE m.product_id = lp.id
206:         AND m.movement_type IN ('IN', 'ADJUSTMENT_IN')
207:         AND m.unit_cost IS NOT NULL
208:     )`;
209:   }
210: 
211:   const createdAt = `COALESCE(
212:     CAST(strftime('%s', lp.created_at) AS INTEGER) * 1000,
213:     CAST(strftime('%s', 'now') AS INTEGER) * 1000
214:   )`;
215:   const updatedAt = has("updated_at")
216:     ? `COALESCE(CAST(strftime('%s', lp.updated_at) AS INTEGER) * 1000, ${createdAt})`
217:     : createdAt;
218:   const archivedAt = has("active")
219:     ? `CASE WHEN lp.active = 0 THEN ${updatedAt} ELSE NULL END`
220:     : "NULL";
221: 
222:   await db.execAsync("DROP TABLE IF EXISTS legacy_product_snapshot;");
223:   await db.execAsync(`
224:     CREATE TABLE legacy_product_snapshot AS
225:     SELECT
226:       lp.id AS id,
227:       lp.name AS name,
228:       ${unit} AS unit,
229:       ${stock} AS stock,
230:       0 AS min_stock,
231:       ${lastPrice} AS last_price,
232:       ${currentPrice} AS current_price,
233:       NULL AS sale_price,
234:       0 AS margin_percent,
235:       ${createdAt} AS created_at,
236:       ${updatedAt} AS updated_at,
237:       ${archivedAt} AS archived_at
238:     FROM products lp;
239:   `);
240: }
241: 
242: async function resetDatabase(
243:   db: SQLiteDatabase,
244:   legacyColumns?: string[],
245: ): Promise<void> {
246:   await db.execAsync("PRAGMA foreign_keys = OFF;");
247: 
248:   if (legacyColumns) {
249:     await snapshotLegacyProducts(db, legacyColumns);
250:   }
251: 
252:   const objects = await db.getAllAsync<{ name: string; type: string }>(
253:     `SELECT name, type FROM sqlite_master
254:      WHERE type IN ('table', 'view')
255:        AND name NOT LIKE 'sqlite_%'
256:        AND name <> 'android_metadata'`,
257:   );
258: 
259:   for (const object of objects) {
260:     if (object.name === "legacy_product_snapshot") continue;
261:     const kind = object.type === "view" ? "VIEW" : "TABLE";
262:     await db.execAsync(
263:       `DROP ${kind} IF EXISTS ${quoteIdentifier(object.name)};`,
264:     );
265:   }
266: 
267:   await db.execAsync("PRAGMA user_version = 0;");
268:   await migrations[0](db);
269: 
270:   if (legacyColumns) {
271:     await db.execAsync(`
272:       INSERT OR REPLACE INTO products (
273:         id, name, unit, stock, min_stock, last_price, current_price,
274:         sale_price, margin_percent, created_at, updated_at, archived_at
275:       )
276:       SELECT
277:         id, name, unit, stock, min_stock, last_price, current_price,
278:         sale_price, margin_percent, created_at, updated_at, archived_at
279:       FROM legacy_product_snapshot;
280: 
281:       DROP TABLE IF EXISTS legacy_product_snapshot;
282:     `);
283:   }
284: 
285:   await db.execAsync(
286:     `PRAGMA user_version = ${DATABASE_VERSION}; PRAGMA foreign_keys = ON;`,
287:   );
288: }
289: 
290: export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
291:   await db.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
292: 
293:   const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
294:   const currentVersion = row?.user_version ?? 0;
295: 
296:   const columns = await getTableColumns(db, "products");
297:   const hasProducts = columns.length > 0;
298:   const hasCurrentSchema = PRODUCT_COLUMNS.every((column) =>
299:     columns.includes(column),
300:   );
301:   const isLegacy = hasProducts && !columns.includes("unit");
302: 
303:   if ((hasProducts && !hasCurrentSchema) || currentVersion > DATABASE_VERSION) {
304:     await resetDatabase(db, isLegacy ? columns : undefined);
305:     return;
306:   }
307: 
308:   if (currentVersion >= DATABASE_VERSION) return;
309: 
310:   for (let version = currentVersion; version < DATABASE_VERSION; version += 1) {
311:     await migrations[version](db);
312:   }
313: 
314:   await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
315: }

(End of file - total 315 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/types.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/types.ts</path>
<type>file</type>
<content>
1: export interface Product {
2:   id: string;
3:   name: string;
4:   unit: string;
5:   stock: number;
6:   minStock: number;
7:   lastPrice: number | null;
8:   currentPrice: number | null;
9:   salePrice: number | null;
10:   marginPercent: number;
11:   createdAt: number;
12:   updatedAt: number;
13:   archivedAt: number | null;
14: }
15: 
16: export interface Purchase {
17:   id: string;
18:   productId: string;
19:   quantity: number;
20:   total: number;
21:   unitCost: number;
22:   previousCost: number | null;
23:   newCost: number;
24:   previousSalePrice: number | null;
25:   newSalePrice: number | null;
26:   createdAt: number;
27: }
28: 
29: export interface Sale {
30:   id: string;
31:   productId: string;
32:   quantity: number;
33:   unitPrice: number;
34:   costPrice: number | null;
35:   marginPercent: number | null;
36:   total: number;
37:   createdAt: number;
38: }
39: 
40: export interface Adjustment {
41:   id: string;
42:   productId: string;
43:   quantityDelta: number;
44:   stockBefore: number;
45:   stockAfter: number;
46:   unitCost: number | null;
47:   reason: string | null;
48:   createdAt: number;
49: }
50: 
51: export type HistoryType = "purchase" | "sale" | "adjustment";
52: 
53: export interface HistoryEntry {
54:   type: HistoryType;
55:   id: string;
56:   productId: string;
57:   productName: string;
58:   quantity: number;
59:   total: number | null;
60:   unitPrice: number | null;
61:   reason: string | null;
62:   createdAt: number;
63: }

(End of file - total 63 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/repositories/sales.repository.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/repositories/sales.repository.ts</path>
<type>file</type>
<content>
1: import type { SQLiteDatabase } from "expo-sqlite";
2: import type { Product, Sale } from "../types";
3: import { createId } from "../utils/ids";
4: import { effectiveMargin, roundMoney } from "../utils/money";
5: import { roundQuantity } from "../utils/quantity";
6: import {
7:   mapProductRow,
8:   type ProductRow,
9: } from "./products.repository";
10: 
11: export interface SaleInput {
12:   productId: string;
13:   quantity: number;
14: }
15: 
16: export interface SalePreview {
17:   product: Product;
18:   quantity: number;
19:   unitPrice: number | null;
20:   costPrice: number | null;
21:   marginPercent: number | null;
22:   total: number | null;
23:   unitProfit: number | null;
24:   totalProfit: number | null;
25:   stockAfter: number;
26:   canSell: boolean;
27:   issue: string | null;
28: }
29: 
30: export interface SaleListItem extends Sale {
31:   productName: string;
32:   productUnit: string;
33: }
34: 
35: interface SaleRow {
36:   id: string;
37:   product_id: string;
38:   quantity: number;
39:   unit_price: number;
40:   cost_price: number | null;
41:   margin_percent: number | null;
42:   total: number;
43:   created_at: number;
44:   product_name: string;
45:   product_unit: string;
46: }
47: 
48: function mapSale(row: SaleRow): SaleListItem {
49:   return {
50:     id: row.id,
51:     productId: row.product_id,
52:     quantity: row.quantity,
53:     unitPrice: row.unit_price,
54:     costPrice: row.cost_price,
55:     marginPercent: row.margin_percent,
56:     total: row.total,
57:     createdAt: row.created_at,
58:     productName: row.product_name,
59:     productUnit: row.product_unit,
60:   };
61: }
62: 
63: function saleMargin(
64:   costPrice: number | null,
65:   unitPrice: number,
66: ): number | null {
67:   if (costPrice == null || costPrice <= 0) return null;
68:   return Math.round(effectiveMargin(costPrice, unitPrice) * 100) / 100;
69: }
70: 
71: export function buildSalePreview(product: Product, quantity: number): SalePreview {
72:   const safeQuantity = roundQuantity(quantity);
73:   const unitPrice =
74:     product.salePrice != null && product.salePrice > 0 ? product.salePrice : null;
75:   const costPrice = product.currentPrice;
76:   const total =
77:     unitPrice != null && safeQuantity > 0
78:       ? roundMoney(unitPrice * safeQuantity)
79:       : null;
80:   const unitProfit =
81:     unitPrice != null && costPrice != null ? unitPrice - costPrice : null;
82:   const totalProfit =
83:     unitProfit != null && safeQuantity > 0
84:       ? roundMoney(unitProfit * safeQuantity)
85:       : null;
86:   const stockAfter =
87:     safeQuantity > 0
88:       ? roundQuantity(product.stock - safeQuantity)
89:       : product.stock;
90: 
91:   let issue: string | null = null;
92:   if (unitPrice == null) {
93:     issue = "El producto no tiene precio de salida.";
94:   } else if (safeQuantity > product.stock) {
95:     issue = "La cantidad supera el stock disponible.";
96:   } else if (total != null && total <= 0) {
97:     issue = "El total de la venta debe ser mayor a cero.";
98:   }
99: 
100:   return {
101:     product,
102:     quantity: safeQuantity,
103:     unitPrice,
104:     costPrice,
105:     marginPercent: unitPrice != null ? saleMargin(costPrice, unitPrice) : null,
106:     total,
107:     unitProfit,
108:     totalProfit,
109:     stockAfter,
110:     canSell:
111:       unitPrice != null &&
112:       safeQuantity > 0 &&
113:       safeQuantity <= product.stock &&
114:       total != null &&
115:       total > 0,
116:     issue,
117:   };
118: }
119: 
120: export async function listSales(
121:   db: SQLiteDatabase,
122:   limit = 50,
123: ): Promise<SaleListItem[]> {
124:   const rows = await db.getAllAsync<SaleRow>(
125:     `SELECT
126:        s.*,
127:        pr.name AS product_name,
128:        pr.unit AS product_unit
129:      FROM sales s
130:      JOIN products pr ON pr.id = s.product_id
131:      ORDER BY s.created_at DESC
132:      LIMIT ?`,
133:     [limit],
134:   );
135: 
136:   return rows.map(mapSale);
137: }
138: 
139: export async function registerSale(
140:   db: SQLiteDatabase,
141:   input: SaleInput,
142: ): Promise<Sale> {
143:   const quantity = roundQuantity(input.quantity);
144: 
145:   if (quantity <= 0) {
146:     throw new Error("La cantidad debe ser mayor a cero.");
147:   }
148: 
149:   let created: Sale | null = null;
150: 
151:   await db.withExclusiveTransactionAsync(async (txn) => {
152:     const productRow = await txn.getFirstAsync<ProductRow>(
153:       "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
154:       input.productId,
155:     );
156: 
157:     if (!productRow) {
158:       throw new Error("Producto no encontrado o archivado.");
159:     }
160: 
161:     const product = mapProductRow(productRow);
162:     const unitPrice = product.salePrice;
163: 
164:     if (unitPrice == null || unitPrice <= 0) {
165:       throw new Error(
166:         "El producto no tiene precio de salida. Edítalo antes de vender.",
167:       );
168:     }
169:     if (quantity > product.stock) {
170:       throw new Error("La cantidad supera el stock disponible.");
171:     }
172: 
173:     const total = roundMoney(quantity * unitPrice);
174:     if (total <= 0) {
175:       throw new Error("El total de la venta debe ser mayor a cero.");
176:     }
177: 
178:     const marginPercent = saleMargin(product.currentPrice, unitPrice);
179:     const newStock = roundQuantity(product.stock - quantity);
180:     const id = createId("sal");
181:     const now = Date.now();
182: 
183:     await txn.runAsync(
184:       `INSERT INTO sales (
185:         id, product_id, quantity, unit_price, cost_price,
186:         margin_percent, total, created_at
187:       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
188:       [
189:         id,
190:         product.id,
191:         quantity,
192:         unitPrice,
193:         product.currentPrice,
194:         marginPercent,
195:         total,
196:         now,
197:       ],
198:     );
199: 
200:     await txn.runAsync(
201:       `UPDATE products
202:        SET stock = ?, updated_at = ?
203:        WHERE id = ?`,
204:       [newStock, now, product.id],
205:     );
206: 
207:     created = {
208:       id,
209:       productId: product.id,
210:       quantity,
211:       unitPrice,
212:       costPrice: product.currentPrice,
213:       marginPercent,
214:       total,
215:       createdAt: now,
216:     };
217:   });
218: 
219:   if (!created) {
220:     throw new Error("No se pudo registrar la venta.");
221:   }
222: 
223:   return created;
224: }

(End of file - total 224 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/repositories/adjustments.repository.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/repositories/adjustments.repository.ts</path>
<type>file</type>
<content>
1: import type { SQLiteDatabase } from "expo-sqlite";
2: import type { Adjustment, Product } from "../types";
3: import { createId } from "../utils/ids";
4: import { roundQuantity } from "../utils/quantity";
5: import {
6:   mapProductRow,
7:   type ProductRow,
8: } from "./products.repository";
9: 
10: export type AdjustmentMode = "direct" | "count";
11: export type AdjustmentDirection = "in" | "out";
12: 
13: export interface AdjustmentDraft {
14:   mode: AdjustmentMode;
15:   direction: AdjustmentDirection;
16:   quantity: number | null;
17:   countedStock: number | null;
18: }
19: 
20: export interface AdjustmentInput extends AdjustmentDraft {
21:   productId: string;
22:   reason?: string | null;
23: }
24: 
25: export interface AdjustmentPreview {
26:   product: Product;
27:   stockBefore: number;
28:   stockAfter: number;
29:   quantityDelta: number;
30:   unitCost: number | null;
31:   valid: boolean;
32:   issue: string | null;
33: }
34: 
35: export interface AdjustmentListItem extends Adjustment {
36:   productName: string;
37:   productUnit: string;
38: }
39: 
40: interface AdjustmentRow {
41:   id: string;
42:   product_id: string;
43:   quantity_delta: number;
44:   stock_before: number;
45:   stock_after: number;
46:   unit_cost: number | null;
47:   reason: string | null;
48:   created_at: number;
49:   product_name: string;
50:   product_unit: string;
51: }
52: 
53: function mapAdjustment(row: AdjustmentRow): AdjustmentListItem {
54:   return {
55:     id: row.id,
56:     productId: row.product_id,
57:     quantityDelta: row.quantity_delta,
58:     stockBefore: row.stock_before,
59:     stockAfter: row.stock_after,
60:     unitCost: row.unit_cost,
61:     reason: row.reason,
62:     createdAt: row.created_at,
63:     productName: row.product_name,
64:     productUnit: row.product_unit,
65:   };
66: }
67: 
68: export function buildAdjustmentPreview(
69:   product: Product,
70:   draft: AdjustmentDraft,
71: ): AdjustmentPreview {
72:   const stockBefore = roundQuantity(product.stock);
73:   const unitCost = product.currentPrice;
74:   const quantity = draft.quantity != null ? roundQuantity(draft.quantity) : null;
75:   const counted =
76:     draft.countedStock != null ? roundQuantity(draft.countedStock) : null;
77: 
78:   let quantityDelta = 0;
79:   let issue: string | null = null;
80: 
81:   if (draft.mode === "direct") {
82:     if (quantity == null || quantity <= 0) {
83:       issue = "Ingresa una cantidad mayor a cero.";
84:     } else {
85:       quantityDelta =
86:         draft.direction === "in" ? quantity : roundQuantity(-quantity);
87:       if (draft.direction === "out" && quantity > stockBefore) {
88:         issue = "No puedes quitar más de lo que hay en stock.";
89:       }
90:     }
91:   } else {
92:     if (counted == null) {
93:       issue = "Ingresa el stock contado.";
94:     } else if (counted < 0) {
95:       issue = "El stock contado no puede ser negativo.";
96:     } else {
97:       quantityDelta = roundQuantity(counted - stockBefore);
98:     }
99:   }
100: 
101:   const stockAfter = roundQuantity(stockBefore + quantityDelta);
102: 
103:   if (!issue && stockAfter < 0) {
104:     issue = "El stock después del ajuste no puede ser negativo.";
105:   }
106:   if (!issue && quantityDelta === 0) {
107:     issue = "El ajuste no cambia el stock.";
108:   }
109: 
110:   return {
111:     product,
112:     stockBefore,
113:     stockAfter,
114:     quantityDelta,
115:     unitCost,
116:     valid: issue == null,
117:     issue,
118:   };
119: }
120: 
121: export async function listAdjustments(
122:   db: SQLiteDatabase,
123:   limit = 50,
124: ): Promise<AdjustmentListItem[]> {
125:   const rows = await db.getAllAsync<AdjustmentRow>(
126:     `SELECT
127:        a.*,
128:        pr.name AS product_name,
129:        pr.unit AS product_unit
130:      FROM adjustments a
131:      JOIN products pr ON pr.id = a.product_id
132:      ORDER BY a.created_at DESC
133:      LIMIT ?`,
134:     [limit],
135:   );
136: 
137:   return rows.map(mapAdjustment);
138: }
139: 
140: export async function registerAdjustment(
141:   db: SQLiteDatabase,
142:   input: AdjustmentInput,
143: ): Promise<Adjustment> {
144:   let created: Adjustment | null = null;
145: 
146:   await db.withExclusiveTransactionAsync(async (txn) => {
147:     const productRow = await txn.getFirstAsync<ProductRow>(
148:       "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
149:       input.productId,
150:     );
151: 
152:     if (!productRow) {
153:       throw new Error("Producto no encontrado o archivado.");
154:     }
155: 
156:     const product = mapProductRow(productRow);
157:     const preview = buildAdjustmentPreview(product, input);
158: 
159:     if (!preview.valid) {
160:       throw new Error(preview.issue ?? "El ajuste no es válido.");
161:     }
162: 
163:     const reason = input.reason?.trim() || null;
164:     const id = createId("adj");
165:     const now = Date.now();
166: 
167:     await txn.runAsync(
168:       `INSERT INTO adjustments (
169:         id, product_id, quantity_delta, stock_before, stock_after,
170:         unit_cost, reason, created_at
171:       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
172:       [
173:         id,
174:         product.id,
175:         preview.quantityDelta,
176:         preview.stockBefore,
177:         preview.stockAfter,
178:         preview.unitCost,
179:         reason,
180:         now,
181:       ],
182:     );
183: 
184:     await txn.runAsync(
185:       `UPDATE products
186:        SET stock = ?, updated_at = ?
187:        WHERE id = ?`,
188:       [preview.stockAfter, now, product.id],
189:     );
190: 
191:     created = {
192:       id,
193:       productId: product.id,
194:       quantityDelta: preview.quantityDelta,
195:       stockBefore: preview.stockBefore,
196:       stockAfter: preview.stockAfter,
197:       unitCost: preview.unitCost,
198:       reason,
199:       createdAt: now,
200:     };
201:   });
202: 
203:   if (!created) {
204:     throw new Error("No se pudo registrar el ajuste.");
205:   }
206: 
207:   return created;
208: }

(End of file - total 208 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/repositories/history.repository.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/repositories/history.repository.ts</path>
<type>file</type>
<content>
1: import type { SQLiteDatabase } from "expo-sqlite";
2: import type {
3:   Adjustment,
4:   HistoryEntry,
5:   HistoryType,
6:   Purchase,
7:   Sale,
8: } from "../types";
9: 
10: export interface HistoryFilters {
11:   type?: HistoryType;
12:   productId?: string;
13:   since?: number;
14: }
15: 
16: export interface HistoryListItem extends HistoryEntry {
17:   productUnit: string;
18: }
19: 
20: export interface PurchaseHistoryDetail extends Purchase {
21:   kind: "purchase";
22:   productName: string;
23:   productUnit: string;
24: }
25: 
26: export interface SaleHistoryDetail extends Sale {
27:   kind: "sale";
28:   productName: string;
29:   productUnit: string;
30: }
31: 
32: export interface AdjustmentHistoryDetail extends Adjustment {
33:   kind: "adjustment";
34:   productName: string;
35:   productUnit: string;
36: }
37: 
38: export type HistoryDetail =
39:   | PurchaseHistoryDetail
40:   | SaleHistoryDetail
41:   | AdjustmentHistoryDetail;
42: 
43: interface HistoryRow {
44:   type: HistoryType;
45:   id: string;
46:   product_id: string;
47:   product_name: string;
48:   quantity: number;
49:   total: number | null;
50:   unit_price: number | null;
51:   reason: string | null;
52:   created_at: number;
53:   product_unit: string;
54: }
55: 
56: interface PurchaseDetailRow {
57:   id: string;
58:   product_id: string;
59:   quantity: number;
60:   total: number;
61:   unit_cost: number;
62:   previous_cost: number | null;
63:   new_cost: number;
64:   previous_sale_price: number | null;
65:   new_sale_price: number | null;
66:   created_at: number;
67:   product_name: string;
68:   product_unit: string;
69: }
70: 
71: interface SaleDetailRow {
72:   id: string;
73:   product_id: string;
74:   quantity: number;
75:   unit_price: number;
76:   cost_price: number | null;
77:   margin_percent: number | null;
78:   total: number;
79:   created_at: number;
80:   product_name: string;
81:   product_unit: string;
82: }
83: 
84: interface AdjustmentDetailRow {
85:   id: string;
86:   product_id: string;
87:   quantity_delta: number;
88:   stock_before: number;
89:   stock_after: number;
90:   unit_cost: number | null;
91:   reason: string | null;
92:   created_at: number;
93:   product_name: string;
94:   product_unit: string;
95: }
96: 
97: function mapHistory(row: HistoryRow): HistoryListItem {
98:   return {
99:     type: row.type,
100:     id: row.id,
101:     productId: row.product_id,
102:     productName: row.product_name,
103:     quantity: row.quantity,
104:     total: row.total,
105:     unitPrice: row.unit_price,
106:     reason: row.reason,
107:     createdAt: row.created_at,
108:     productUnit: row.product_unit,
109:   };
110: }
111: 
112: export function isHistoryType(value: string | undefined): value is HistoryType {
113:   return value === "purchase" || value === "sale" || value === "adjustment";
114: }
115: 
116: export async function listHistory(
117:   db: SQLiteDatabase,
118:   filters: HistoryFilters = {},
119: ): Promise<HistoryListItem[]> {
120:   const clauses: string[] = [];
121:   const params: (string | number)[] = [];
122: 
123:   if (filters.type) {
124:     clauses.push("h.type = ?");
125:     params.push(filters.type);
126:   }
127:   if (filters.productId) {
128:     clauses.push("h.product_id = ?");
129:     params.push(filters.productId);
130:   }
131:   if (filters.since != null) {
132:     clauses.push("h.created_at >= ?");
133:     params.push(filters.since);
134:   }
135: 
136:   const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
137:   const rows = await db.getAllAsync<HistoryRow>(
138:     `SELECT h.*, pr.unit AS product_unit
139:      FROM history h
140:      JOIN products pr ON pr.id = h.product_id
141:      ${where}
142:      ORDER BY h.created_at DESC
143:      LIMIT 200`,
144:     params,
145:   );
146: 
147:   return rows.map(mapHistory);
148: }
149: 
150: export async function getHistoryDetail(
151:   db: SQLiteDatabase,
152:   type: HistoryType,
153:   id: string,
154: ): Promise<HistoryDetail | null> {
155:   if (type === "purchase") {
156:     const row = await db.getFirstAsync<PurchaseDetailRow>(
157:       `SELECT pu.*, pr.name AS product_name, pr.unit AS product_unit
158:        FROM purchases pu
159:        JOIN products pr ON pr.id = pu.product_id
160:        WHERE pu.id = ?`,
161:       id,
162:     );
163:     if (!row) return null;
164: 
165:     return {
166:       kind: "purchase",
167:       id: row.id,
168:       productId: row.product_id,
169:       quantity: row.quantity,
170:       total: row.total,
171:       unitCost: row.unit_cost,
172:       previousCost: row.previous_cost,
173:       newCost: row.new_cost,
174:       previousSalePrice: row.previous_sale_price,
175:       newSalePrice: row.new_sale_price,
176:       createdAt: row.created_at,
177:       productName: row.product_name,
178:       productUnit: row.product_unit,
179:     };
180:   }
181: 
182:   if (type === "sale") {
183:     const row = await db.getFirstAsync<SaleDetailRow>(
184:       `SELECT s.*, pr.name AS product_name, pr.unit AS product_unit
185:        FROM sales s
186:        JOIN products pr ON pr.id = s.product_id
187:        WHERE s.id = ?`,
188:       id,
189:     );
190:     if (!row) return null;
191: 
192:     return {
193:       kind: "sale",
194:       id: row.id,
195:       productId: row.product_id,
196:       quantity: row.quantity,
197:       unitPrice: row.unit_price,
198:       costPrice: row.cost_price,
199:       marginPercent: row.margin_percent,
200:       total: row.total,
201:       createdAt: row.created_at,
202:       productName: row.product_name,
203:       productUnit: row.product_unit,
204:     };
205:   }
206: 
207:   const row = await db.getFirstAsync<AdjustmentDetailRow>(
208:     `SELECT a.*, pr.name AS product_name, pr.unit AS product_unit
209:      FROM adjustments a
210:      JOIN products pr ON pr.id = a.product_id
211:      WHERE a.id = ?`,
212:     id,
213:   );
214:   if (!row) return null;
215: 
216:   return {
217:     kind: "adjustment",
218:     id: row.id,
219:     productId: row.product_id,
220:     quantityDelta: row.quantity_delta,
221:     stockBefore: row.stock_before,
222:     stockAfter: row.stock_after,
223:     unitCost: row.unit_cost,
224:     reason: row.reason,
225:     createdAt: row.created_at,
226:     productName: row.product_name,
227:     productUnit: row.product_unit,
228:   };
229: }

(End of file - total 229 lines)
</content>
```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 8.4s)

_Thinking:_

Now let me read the UI screens/hooks related to sales, movements tab, adjustments, dashboard.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/(tabs)/movements.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/(tabs)/movements.tsx</path>
<type>file</type>
<content>
1: import { useRouter } from "expo-router";
2: import { useState } from "react";
3: import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
4: import {
5:   AppText,
6:   Badge,
7:   Button,
8:   Card,
9:   EmptyState,
10:   MoneyText,
11: } from "@/components/ui";
12: import type { AdjustmentListItem } from "@/database/repositories/adjustments.repository";
13: import type { PurchaseListItem } from "@/database/repositories/purchases.repository";
14: import type { SaleListItem } from "@/database/repositories/sales.repository";
15: import { formatDateTime } from "@/database/utils/dates";
16: import { roundMoney } from "@/database/utils/money";
17: import { formatQuantity } from "@/database/utils/quantity";
18: import { useAdjustments } from "@/hooks/use-adjustments";
19: import { usePurchases } from "@/hooks/use-purchases";
20: import { useSales } from "@/hooks/use-sales";
21: import { usePalette } from "@/theme/colors";
22: import { cn } from "@/utils/cn";
23: 
24: type MovementMode = "purchases" | "sales" | "adjustments";
25: 
26: type MovementItem =
27:   | { kind: "purchase"; data: PurchaseListItem }
28:   | { kind: "sale"; data: SaleListItem }
29:   | { kind: "adjustment"; data: AdjustmentListItem };
30: 
31: function formatDelta(value: number): string {
32:   if (value === 0) return formatQuantity(0);
33:   const formatted = formatQuantity(Math.abs(value));
34:   return value > 0 ? `+${formatted}` : `-${formatted}`;
35: }
36: 
37: function ModeSwitch({
38:   mode,
39:   onChange,
40: }: {
41:   mode: MovementMode;
42:   onChange: (mode: MovementMode) => void;
43: }) {
44:   const palette = usePalette();
45:   const options: { value: MovementMode; label: string }[] = [
46:     { value: "purchases", label: "Compras" },
47:     { value: "sales", label: "Ventas" },
48:     { value: "adjustments", label: "Ajustes" },
49:   ];
50: 
51:   return (
52:     <View className="flex-row rounded-xl border border-border bg-surface p-1">
53:       {options.map((option) => {
54:         const selected = option.value === mode;
55:         return (
56:           <Pressable
57:             key={option.value}
58:             accessibilityRole="tab"
59:             accessibilityState={{ selected }}
60:             onPress={() => onChange(option.value)}
61:             style={{
62:               flex: 1,
63:               alignItems: "center",
64:               borderRadius: 8,
65:               paddingVertical: 8,
66:               backgroundColor: selected ? palette.accentSoft : undefined,
67:             }}
68:           >
69:             <AppText
70:               variant="caption"
71:               className={cn(
72:                 "font-semibold",
73:                 selected ? "text-accent" : "text-content-muted",
74:               )}
75:             >
76:               {option.label}
77:             </AppText>
78:           </Pressable>
79:         );
80:       })}
81:     </View>
82:   );
83: }
84: 
85: function PurchaseCard({ item }: { item: PurchaseListItem }) {
86:   return (
87:     <Card className="gap-3 border-warning/25 bg-warning/10">
88:       <View className="flex-row items-start justify-between gap-3">
89:         <View className="flex-1 gap-1">
90:           <AppText className="font-semibold">{item.productName}</AppText>
91:           <AppText variant="caption">
92:             {formatQuantity(item.quantity)} {item.productUnit} ·{" "}
93:             {formatDateTime(item.createdAt)}
94:           </AppText>
95:         </View>
96:         <Badge tone="warning" label="Compra" />
97:       </View>
98: 
99:       <View className="flex-row items-end justify-between gap-3">
100:         <View className="gap-0.5">
101:           <AppText variant="caption">Costo unidad</AppText>
102:           <MoneyText value={item.unitCost} />
103:         </View>
104:         <View className="items-end gap-0.5">
105:           <AppText variant="caption">Total</AppText>
106:           <MoneyText value={item.total} className="font-semibold" />
107:         </View>
108:       </View>
109:     </Card>
110:   );
111: }
112: 
113: function SaleCard({ item }: { item: SaleListItem }) {
114:   const palette = usePalette();
115:   const profit =
116:     item.costPrice != null
117:       ? roundMoney(item.quantity * (item.unitPrice - item.costPrice))
118:       : null;
119: 
120:   return (
121:     <Card className="gap-3 border-success/25 bg-success/10">
122:       <View className="flex-row items-start justify-between gap-3">
123:         <View className="flex-1 gap-1">
124:           <AppText className="font-semibold">{item.productName}</AppText>
125:           <AppText variant="caption">
126:             {formatQuantity(item.quantity)} {item.productUnit} ·{" "}
127:             {formatDateTime(item.createdAt)}
128:           </AppText>
129:         </View>
130:         <Badge tone="success" label="Venta" />
131:       </View>
132: 
133:       <View className="flex-row items-end justify-between gap-3">
134:         <View className="gap-0.5">
135:           <AppText variant="caption">Precio unidad</AppText>
136:           <MoneyText value={item.unitPrice} />
137:         </View>
138:         <View className="items-end gap-0.5">
139:           <AppText variant="caption">Total</AppText>
140:           <MoneyText value={item.total} className="font-semibold" />
141:         </View>
142:       </View>
143: 
144:       {profit != null ? (
145:         <View className="flex-row items-center justify-between gap-3 border-t border-border pt-3">
146:           <AppText variant="caption">Ganancia</AppText>
147:           <MoneyText
148:             value={profit}
149:             className="font-semibold"
150:             style={{ color: profit < 0 ? palette.danger : palette.success }}
151:           />
152:         </View>
153:       ) : null}
154:     </Card>
155:   );
156: }
157: 
158: function AdjustmentCard({ item }: { item: AdjustmentListItem }) {
159:   const palette = usePalette();
160:   const isRemoval = item.quantityDelta < 0;
161: 
162:   return (
163:     <Card
164:       className={cn(
165:         "gap-3",
166:         isRemoval
167:           ? "border-danger-border bg-danger-soft"
168:           : "border-success/25 bg-success/10",
169:       )}
170:     >
171:       <View className="flex-row items-start justify-between gap-3">
172:         <View className="flex-1 gap-1">
173:           <AppText className="font-semibold">{item.productName}</AppText>
174:           <AppText variant="caption">
175:             {item.reason ?? "Ajuste de inventario"} ·{" "}
176:             {formatDateTime(item.createdAt)}
177:           </AppText>
178:         </View>
179:         <Badge tone={isRemoval ? "danger" : "success"} label="Ajuste" />
180:       </View>
181: 
182:       <View className="flex-row items-end justify-between gap-3">
183:         <View className="gap-0.5">
184:           <AppText variant="caption">Ajuste</AppText>
185:           <AppText
186:             className="font-semibold"
187:             style={{ color: isRemoval ? palette.danger : palette.success }}
188:           >
189:             {formatDelta(item.quantityDelta)} {item.productUnit}
190:           </AppText>
191:         </View>
192:         <View className="items-end gap-0.5">
193:           <AppText variant="caption">Stock</AppText>
194:           <AppText className="font-semibold">
195:             {formatQuantity(item.stockBefore)} → {formatQuantity(item.stockAfter)}
196:           </AppText>
197:         </View>
198:       </View>
199:     </Card>
200:   );
201: }
202: 
203: export default function MovementsScreen() {
204:   const router = useRouter();
205:   const palette = usePalette();
206:   const [mode, setMode] = useState<MovementMode>("purchases");
207:   const purchaseState = usePurchases();
208:   const saleState = useSales();
209:   const adjustmentState = useAdjustments();
210: 
211:   const isPurchase = mode === "purchases";
212:   const isSale = mode === "sales";
213:   const items: MovementItem[] = isPurchase
214:     ? purchaseState.purchases.map((data) => ({ kind: "purchase", data }))
215:     : isSale
216:       ? saleState.sales.map((data) => ({ kind: "sale", data }))
217:       : adjustmentState.adjustments.map((data) => ({ kind: "adjustment", data }));
218:   const loading = isPurchase
219:     ? purchaseState.loading
220:     : isSale
221:       ? saleState.loading
222:       : adjustmentState.loading;
223:   const error = isPurchase
224:     ? purchaseState.error
225:     : isSale
226:       ? saleState.error
227:       : adjustmentState.error;
228: 
229:   const countLabel = isPurchase
230:     ? items.length === 1
231:       ? "1 compra registrada"
232:       : `${items.length} compras registradas`
233:     : isSale
234:       ? items.length === 1
235:         ? "1 venta registrada"
236:         : `${items.length} ventas registradas`
237:       : items.length === 1
238:         ? "1 ajuste registrado"
239:         : `${items.length} ajustes registrados`;
240: 
241:   const newLabel = isPurchase
242:     ? "Nueva compra"
243:     : isSale
244:       ? "Nueva venta"
245:       : "Nuevo ajuste";
246: 
247:   function openNew() {
248:     if (isPurchase) {
249:       router.push("/purchase/new");
250:     } else if (isSale) {
251:       router.push("/sale/new");
252:     } else {
253:       router.push("/adjustment/new");
254:     }
255:   }
256: 
257:   return (
258:     <View className="flex-1 bg-background">
259:       <FlatList
260:         data={items}
261:         keyExtractor={(item) => item.data.id}
262:         contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
263:         contentInsetAdjustmentBehavior="automatic"
264:         showsVerticalScrollIndicator={false}
265:         ListHeaderComponent={
266:           <View className="gap-3 pb-1">
267:             <View className="flex-row items-center justify-between gap-3">
268:               <View className="flex-1 gap-1">
269:                 <AppText variant="title">Movimientos</AppText>
270:                 <AppText variant="muted">{countLabel}</AppText>
271:               </View>
272:               <Button label={newLabel} size="sm" onPress={openNew} />
273:             </View>
274: 
275:             <ModeSwitch mode={mode} onChange={setMode} />
276: 
277:             {error ? (
278:               <AppText variant="caption" className="text-danger">
279:                 {error}
280:               </AppText>
281:             ) : null}
282:           </View>
283:         }
284:         renderItem={({ item }) => {
285:           if (item.kind === "purchase") return <PurchaseCard item={item.data} />;
286:           if (item.kind === "sale") return <SaleCard item={item.data} />;
287:           return <AdjustmentCard item={item.data} />;
288:         }}
289:         ListEmptyComponent={
290:           loading ? (
291:             <View className="items-center py-12">
292:               <ActivityIndicator color={palette.accent} />
293:             </View>
294:           ) : (
295:             <EmptyState
296:               icon={
297:                 isPurchase
298:                   ? "cart-arrow-down"
299:                   : isSale
300:                     ? "cash-register"
301:                     : "swap-vertical"
302:               }
303:               title={
304:                 isPurchase ? "Sin compras" : isSale ? "Sin ventas" : "Sin ajustes"
305:               }
306:               description={
307:                 isPurchase
308:                   ? "Registra tu primera compra para actualizar el stock y los precios."
309:                   : isSale
310:                     ? "Registra tu primera venta para descontar stock y congelar precios."
311:                     : "Registra un ajuste para corregir el stock sin comprar ni vender."
312:               }
313:               action={
314:                 <Button
315:                   label={
316:                     isPurchase
317:                       ? "Registrar compra"
318:                       : isSale
319:                         ? "Registrar venta"
320:                         : "Registrar ajuste"
321:                   }
322:                   onPress={openNew}
323:                 />
324:               }
325:             />
326:           )
327:         }
328:       />
329:     </View>
330:   );
331: }

(End of file - total 331 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/components/movements/sale-form.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/components/movements/sale-form.tsx</path>
<type>file</type>
<content>
1: import { useState, type ReactNode } from "react";
2: import {
3:   KeyboardAvoidingView,
4:   Platform,
5:   ScrollView,
6:   View,
7: } from "react-native";
8: import { useSafeAreaInsets } from "react-native-safe-area-context";
9: import { ProductPicker } from "@/components/products/product-picker";
10: import {
11:   AppText,
12:   Badge,
13:   Button,
14:   Card,
15:   MoneyText,
16:   TextField,
17: } from "@/components/ui";
18: import {
19:   buildSalePreview,
20:   type SaleInput,
21: } from "@/database/repositories/sales.repository";
22: import type { Product } from "@/database/types";
23: import { formatPercent } from "@/database/utils/money";
24: import {
25:   formatQuantity,
26:   parseQuantityInput,
27: } from "@/database/utils/quantity";
28: import { usePalette } from "@/theme/colors";
29: import { sanitizeDecimalInput } from "@/utils/input";
30: 
31: interface SaleFormProps {
32:   initialProduct?: Product | null;
33:   submitting?: boolean;
34:   onSubmit: (input: SaleInput) => Promise<void> | void;
35:   onCancel: () => void;
36: }
37: 
38: interface FormErrors {
39:   product?: string;
40:   quantity?: string;
41:   salePrice?: string;
42: }
43: 
44: function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
45:   return (
46:     <View className="flex-row items-center justify-between gap-3">
47:       <AppText variant="muted">{label}</AppText>
48:       {children}
49:     </View>
50:   );
51: }
52: 
53: export function SaleForm({
54:   initialProduct,
55:   submitting = false,
56:   onSubmit,
57:   onCancel,
58: }: SaleFormProps) {
59:   const insets = useSafeAreaInsets();
60:   const palette = usePalette();
61:   const [selectedProduct, setSelectedProduct] = useState<Product | null>(
62:     initialProduct ?? null,
63:   );
64:   const [quantityInput, setQuantityInput] = useState("");
65:   const [pickerVisible, setPickerVisible] = useState(false);
66:   const [errors, setErrors] = useState<FormErrors>({});
67: 
68:   const quantity = parseQuantityInput(quantityInput);
69:   const preview = selectedProduct
70:     ? buildSalePreview(selectedProduct, quantity)
71:     : null;
72:   const marginTone =
73:     preview?.marginPercent == null
74:       ? palette.contentMuted
75:       : preview.marginPercent < 0
76:         ? palette.danger
77:         : palette.success;
78:   const profitTone =
79:     preview?.totalProfit == null
80:       ? palette.contentMuted
81:       : preview.totalProfit < 0
82:         ? palette.danger
83:         : palette.success;
84: 
85:   function handleSelect(product: Product) {
86:     setSelectedProduct(product);
87:     setErrors({});
88:     setPickerVisible(false);
89:   }
90: 
91:   function validate(): boolean {
92:     const next: FormErrors = {};
93: 
94:     if (!selectedProduct) {
95:       next.product = "Selecciona un producto.";
96:     } else {
97:       if (selectedProduct.salePrice == null || selectedProduct.salePrice <= 0) {
98:         next.salePrice =
99:           "El producto no tiene precio de salida. Edítalo antes de vender.";
100:       }
101:       if (quantity <= 0) {
102:         next.quantity = "Ingresa una cantidad mayor a cero.";
103:       } else if (quantity > selectedProduct.stock) {
104:         next.quantity = `Solo hay ${formatQuantity(selectedProduct.stock)} ${selectedProduct.unit} en stock.`;
105:       } else if (preview?.total != null && preview.total <= 0) {
106:         next.quantity = "El total de la venta debe ser mayor a cero.";
107:       }
108:     }
109: 
110:     setErrors(next);
111:     return Object.keys(next).length === 0;
112:   }
113: 
114:   async function handleSubmit() {
115:     if (submitting || !validate() || !selectedProduct) return;
116: 
117:     await onSubmit({
118:       productId: selectedProduct.id,
119:       quantity,
120:     });
121:   }
122: 
123:   return (
124:     <KeyboardAvoidingView
125:       style={{ flex: 1 }}
126:       behavior={Platform.OS === "ios" ? "padding" : undefined}
127:     >
128:       <ScrollView
129:         className="flex-1 bg-background"
130:         contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
131:         contentInsetAdjustmentBehavior="automatic"
132:         keyboardShouldPersistTaps="handled"
133:         showsVerticalScrollIndicator={false}
134:       >
135:         <Card className="gap-3">
136:           <View className="flex-row items-center justify-between gap-3">
137:             <AppText variant="title">Producto</AppText>
138:             {selectedProduct ? (
139:               <Button
140:                 label="Cambiar"
141:                 size="sm"
142:                 variant="secondary"
143:                 onPress={() => setPickerVisible(true)}
144:               />
145:             ) : null}
146:           </View>
147: 
148:           {selectedProduct ? (
149:             <View className="gap-1">
150:               <AppText className="font-semibold">{selectedProduct.name}</AppText>
151:               <View className="flex-row items-center gap-1">
152:                 <AppText variant="muted">
153:                   {formatQuantity(selectedProduct.stock)} {selectedProduct.unit} en
154:                   stock · costo
155:                 </AppText>
156:                 {selectedProduct.currentPrice != null ? (
157:                   <MoneyText value={selectedProduct.currentPrice} />
158:                 ) : (
159:                   <AppText variant="muted">sin definir</AppText>
160:                 )}
161:               </View>
162:               {selectedProduct.salePrice != null ? (
163:                 <View className="flex-row items-center gap-1">
164:                   <AppText variant="muted">Precio de salida</AppText>
165:                   <MoneyText value={selectedProduct.salePrice} className="font-semibold" />
166:                 </View>
167:               ) : null}
168:             </View>
169:           ) : (
170:             <Button
171:               label="Seleccionar producto"
172:               variant="secondary"
173:               onPress={() => setPickerVisible(true)}
174:             />
175:           )}
176: 
177:           {errors.product ? (
178:             <AppText variant="caption" className="text-danger">
179:               {errors.product}
180:             </AppText>
181:           ) : null}
182:           {errors.salePrice ? (
183:             <AppText variant="caption" className="text-danger">
184:               {errors.salePrice}
185:             </AppText>
186:           ) : null}
187:         </Card>
188: 
189:         <Card className="gap-4">
190:           <AppText variant="title">Datos de la venta</AppText>
191: 
192:           <TextField
193:             label={selectedProduct ? `Cantidad (${selectedProduct.unit})` : "Cantidad"}
194:             value={quantityInput}
195:             onChangeText={(text) => {
196:               setQuantityInput(sanitizeDecimalInput(text));
197:               setErrors((current) => ({ ...current, quantity: undefined }));
198:             }}
199:             keyboardType="decimal-pad"
200:             placeholder="Ej. 1"
201:             hint="Se descuenta del stock al confirmar."
202:             error={errors.quantity}
203:           />
204:         </Card>
205: 
206:         {preview ? (
207:           <Card className="gap-3">
208:             <View className="flex-row items-center justify-between gap-3">
209:               <AppText variant="title">Resumen</AppText>
210:               <Badge tone="success" label="Venta" />
211:             </View>
212: 
213:             {preview.unitPrice == null ? (
214:               <AppText variant="muted">
215:                 Este producto no tiene precio de salida. Edítalo antes de vender.
216:               </AppText>
217:             ) : (
218:               <>
219:                 <SummaryRow label="Precio de venta">
220:                   <MoneyText value={preview.unitPrice} className="font-semibold" />
221:                 </SummaryRow>
222:                 <SummaryRow label="Costo actual">
223:                   <MoneyText value={preview.costPrice} />
224:                 </SummaryRow>
225:                 <SummaryRow label="Margen actual">
226:                   <AppText style={{ color: marginTone }} className="font-semibold">
227:                     {formatPercent(preview.marginPercent)}
228:                   </AppText>
229:                 </SummaryRow>
230:               </>
231:             )}
232: 
233:             <SummaryRow label="Stock disponible">
234:               <AppText variant="body">
235:                 {formatQuantity(preview.product.stock)} {preview.product.unit}
236:               </AppText>
237:             </SummaryRow>
238: 
239:             <View className="h-px bg-border" />
240: 
241:             <SummaryRow label="Total">
242:               <MoneyText value={preview.total} className="font-semibold" />
243:             </SummaryRow>
244:             <SummaryRow label="Ganancia estimada">
245:               <MoneyText
246:                 value={preview.totalProfit}
247:                 className="font-semibold"
248:                 style={{ color: profitTone }}
249:               />
250:             </SummaryRow>
251:             <SummaryRow label="Stock después">
252:               <AppText
253:                 variant="body"
254:                 className={preview.stockAfter < 0 ? "font-semibold text-danger" : "font-semibold"}
255:               >
256:                 {formatQuantity(preview.stockAfter)} {preview.product.unit}
257:               </AppText>
258:             </SummaryRow>
259: 
260:             {preview.issue && quantity > 0 ? (
261:               <AppText variant="caption" className="text-danger">
262:                 {preview.issue}
263:               </AppText>
264:             ) : null}
265:           </Card>
266:         ) : null}
267:       </ScrollView>
268: 
269:       <View
270:         className="border-t border-border bg-surface px-4 pt-3"
271:         style={{ paddingBottom: Math.max(insets.bottom, 12) }}
272:       >
273:         <View className="flex-row gap-3">
274:           <Button
275:             label="Cancelar"
276:             variant="outline"
277:             className="flex-1"
278:             onPress={onCancel}
279:             disabled={submitting}
280:           />
281:           <Button
282:             label="Registrar venta"
283:             className="flex-1"
284:             loading={submitting}
285:             onPress={handleSubmit}
286:           />
287:         </View>
288:       </View>
289: 
290:       <ProductPicker
291:         visible={pickerVisible}
292:         selectedId={selectedProduct?.id}
293:         onSelect={handleSelect}
294:         onClose={() => setPickerVisible(false)}
295:       />
296:     </KeyboardAvoidingView>
297:   );
298: }

(End of file - total 298 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/components/movements/adjustment-form.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/components/movements/adjustment-form.tsx</path>
<type>file</type>
<content>
1: import { useState, type ReactNode } from "react";
2: import {
3:   KeyboardAvoidingView,
4:   Platform,
5:   Pressable,
6:   ScrollView,
7:   View,
8: } from "react-native";
9: import { useSafeAreaInsets } from "react-native-safe-area-context";
10: import { ProductPicker } from "@/components/products/product-picker";
11: import {
12:   AppText,
13:   Badge,
14:   Button,
15:   Card,
16:   MoneyText,
17:   TextField,
18: } from "@/components/ui";
19: import {
20:   buildAdjustmentPreview,
21:   type AdjustmentDirection,
22:   type AdjustmentInput,
23:   type AdjustmentMode,
24: } from "@/database/repositories/adjustments.repository";
25: import type { Product } from "@/database/types";
26: import {
27:   formatQuantity,
28:   parseQuantityInput,
29: } from "@/database/utils/quantity";
30: import { usePalette } from "@/theme/colors";
31: import { cn } from "@/utils/cn";
32: import { sanitizeDecimalInput } from "@/utils/input";
33: 
34: interface AdjustmentFormProps {
35:   initialProduct?: Product | null;
36:   submitting?: boolean;
37:   onSubmit: (input: AdjustmentInput) => Promise<void> | void;
38:   onCancel: () => void;
39: }
40: 
41: interface FormErrors {
42:   product?: string;
43:   quantity?: string;
44:   counted?: string;
45: }
46: 
47: function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
48:   return (
49:     <View className="flex-row items-center justify-between gap-3">
50:       <AppText variant="muted">{label}</AppText>
51:       {children}
52:     </View>
53:   );
54: }
55: 
56: function formatDelta(value: number): string {
57:   if (value === 0) return formatQuantity(0);
58:   const formatted = formatQuantity(Math.abs(value));
59:   return value > 0 ? `+${formatted}` : `-${formatted}`;
60: }
61: 
62: function ModeToggle({
63:   mode,
64:   onChange,
65: }: {
66:   mode: AdjustmentMode;
67:   onChange: (mode: AdjustmentMode) => void;
68: }) {
69:   const palette = usePalette();
70:   const options: { value: AdjustmentMode; label: string }[] = [
71:     { value: "direct", label: "Directo" },
72:     { value: "count", label: "Por conteo" },
73:   ];
74: 
75:   return (
76:     <View className="flex-row rounded-xl border border-border bg-surface p-1">
77:       {options.map((option) => {
78:         const selected = option.value === mode;
79:         return (
80:           <Pressable
81:             key={option.value}
82:             accessibilityRole="tab"
83:             accessibilityState={{ selected }}
84:             onPress={() => onChange(option.value)}
85:             style={{
86:               flex: 1,
87:               alignItems: "center",
88:               borderRadius: 8,
89:               paddingVertical: 8,
90:               backgroundColor: selected ? palette.accentSoft : undefined,
91:             }}
92:           >
93:             <AppText
94:               variant="caption"
95:               className={cn(
96:                 "font-semibold",
97:                 selected ? "text-accent" : "text-content-muted",
98:               )}
99:             >
100:               {option.label}
101:             </AppText>
102:           </Pressable>
103:         );
104:       })}
105:     </View>
106:   );
107: }
108: 
109: function DirectionToggle({
110:   direction,
111:   onChange,
112: }: {
113:   direction: AdjustmentDirection;
114:   onChange: (direction: AdjustmentDirection) => void;
115: }) {
116:   const palette = usePalette();
117:   const options: { value: AdjustmentDirection; label: string }[] = [
118:     { value: "in", label: "Agregar" },
119:     { value: "out", label: "Quitar" },
120:   ];
121: 
122:   return (
123:     <View className="flex-row gap-2">
124:       {options.map((option) => {
125:         const selected = option.value === direction;
126:         const isOut = option.value === "out";
127:         return (
128:           <Pressable
129:             key={option.value}
130:             accessibilityRole="radio"
131:             accessibilityState={{ selected }}
132:             onPress={() => onChange(option.value)}
133:             style={{
134:               flex: 1,
135:               alignItems: "center",
136:               borderRadius: 12,
137:               borderWidth: 1,
138:               paddingVertical: 10,
139:               borderColor: selected
140:                 ? isOut
141:                   ? palette.danger
142:                   : palette.accent
143:                 : palette.border,
144:               backgroundColor: selected
145:                 ? isOut
146:                   ? palette.dangerSoft
147:                   : palette.accentSoft
148:                 : palette.surface,
149:             }}
150:           >
151:             <AppText
152:               className="font-semibold"
153:               style={{
154:                 color: selected
155:                   ? isOut
156:                     ? palette.danger
157:                     : palette.accent
158:                   : palette.contentMuted,
159:               }}
160:             >
161:               {option.label}
162:             </AppText>
163:           </Pressable>
164:         );
165:       })}
166:     </View>
167:   );
168: }
169: 
170: export function AdjustmentForm({
171:   initialProduct,
172:   submitting = false,
173:   onSubmit,
174:   onCancel,
175: }: AdjustmentFormProps) {
176:   const insets = useSafeAreaInsets();
177:   const palette = usePalette();
178:   const [selectedProduct, setSelectedProduct] = useState<Product | null>(
179:     initialProduct ?? null,
180:   );
181:   const [mode, setMode] = useState<AdjustmentMode>("direct");
182:   const [direction, setDirection] = useState<AdjustmentDirection>("in");
183:   const [quantityInput, setQuantityInput] = useState("");
184:   const [countedInput, setCountedInput] = useState(
185:     initialProduct ? formatQuantity(initialProduct.stock) : "",
186:   );
187:   const [reason, setReason] = useState("");
188:   const [pickerVisible, setPickerVisible] = useState(false);
189:   const [errors, setErrors] = useState<FormErrors>({});
190: 
191:   const quantity = quantityInput.trim() ? parseQuantityInput(quantityInput) : null;
192:   const counted = countedInput.trim() ? parseQuantityInput(countedInput) : null;
193:   const preview = selectedProduct
194:     ? buildAdjustmentPreview(selectedProduct, {
195:         mode,
196:         direction,
197:         quantity,
198:         countedStock: counted,
199:       })
200:     : null;
201:   const isRemoval = (preview?.quantityDelta ?? 0) < 0;
202:   const deltaTone =
203:     preview == null || preview.quantityDelta === 0
204:       ? palette.contentMuted
205:       : isRemoval
206:         ? palette.danger
207:         : palette.success;
208: 
209:   function handleSelect(product: Product) {
210:     setSelectedProduct(product);
211:     setCountedInput(formatQuantity(product.stock));
212:     setErrors({});
213:     setPickerVisible(false);
214:   }
215: 
216:   function handleMode(next: AdjustmentMode) {
217:     setMode(next);
218:     setErrors({});
219:     if (next === "count" && selectedProduct) {
220:       setCountedInput(formatQuantity(selectedProduct.stock));
221:     }
222:   }
223: 
224:   function validate(): boolean {
225:     const next: FormErrors = {};
226: 
227:     if (!selectedProduct) {
228:       next.product = "Selecciona un producto.";
229:     } else if (preview && !preview.valid) {
230:       if (mode === "direct") {
231:         next.quantity = preview.issue ?? "Revisa la cantidad.";
232:       } else {
233:         next.counted = preview.issue ?? "Revisa el stock contado.";
234:       }
235:     }
236: 
237:     setErrors(next);
238:     return Object.keys(next).length === 0;
239:   }
240: 
241:   async function handleSubmit() {
242:     if (submitting || !validate() || !selectedProduct) return;
243: 
244:     await onSubmit({
245:       productId: selectedProduct.id,
246:       mode,
247:       direction,
248:       quantity,
249:       countedStock: counted,
250:       reason: reason.trim() || null,
251:     });
252:   }
253: 
254:   return (
255:     <KeyboardAvoidingView
256:       style={{ flex: 1 }}
257:       behavior={Platform.OS === "ios" ? "padding" : undefined}
258:     >
259:       <ScrollView
260:         className="flex-1 bg-background"
261:         contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
262:         contentInsetAdjustmentBehavior="automatic"
263:         keyboardShouldPersistTaps="handled"
264:         showsVerticalScrollIndicator={false}
265:       >
266:         <Card className="gap-3">
267:           <View className="flex-row items-center justify-between gap-3">
268:             <AppText variant="title">Producto</AppText>
269:             {selectedProduct ? (
270:               <Button
271:                 label="Cambiar"
272:                 size="sm"
273:                 variant="secondary"
274:                 onPress={() => setPickerVisible(true)}
275:               />
276:             ) : null}
277:           </View>
278: 
279:           {selectedProduct ? (
280:             <View className="gap-1">
281:               <AppText className="font-semibold">{selectedProduct.name}</AppText>
282:               <View className="flex-row items-center gap-1">
283:                 <AppText variant="muted">
284:                   {formatQuantity(selectedProduct.stock)} {selectedProduct.unit} en
285:                   stock · costo
286:                 </AppText>
287:                 {selectedProduct.currentPrice != null ? (
288:                   <MoneyText value={selectedProduct.currentPrice} />
289:                 ) : (
290:                   <AppText variant="muted">sin definir</AppText>
291:                 )}
292:               </View>
293:             </View>
294:           ) : (
295:             <Button
296:               label="Seleccionar producto"
297:               variant="secondary"
298:               onPress={() => setPickerVisible(true)}
299:             />
300:           )}
301: 
302:           {errors.product ? (
303:             <AppText variant="caption" className="text-danger">
304:               {errors.product}
305:             </AppText>
306:           ) : null}
307:         </Card>
308: 
309:         <Card className="gap-4">
310:           <View className="flex-row items-center justify-between gap-3">
311:             <AppText variant="title">Ajuste</AppText>
312:             <Badge tone="warning" label="Inventario" />
313:           </View>
314: 
315:           <ModeToggle mode={mode} onChange={handleMode} />
316: 
317:           {mode === "direct" ? (
318:             <View className="gap-3">
319:               <DirectionToggle
320:                 direction={direction}
321:                 onChange={(next) => {
322:                   setDirection(next);
323:                   setErrors((current) => ({ ...current, quantity: undefined }));
324:                 }}
325:               />
326: 
327:               <TextField
328:                 label={
329:                   selectedProduct
330:                     ? `Cantidad (${selectedProduct.unit})`
331:                     : "Cantidad"
332:                 }
333:                 value={quantityInput}
334:                 onChangeText={(text) => {
335:                   setQuantityInput(sanitizeDecimalInput(text));
336:                   setErrors((current) => ({ ...current, quantity: undefined }));
337:                 }}
338:                 keyboardType="decimal-pad"
339:                 placeholder="Ej. 1"
340:                 hint={
341:                   direction === "in"
342:                     ? "La cantidad se suma al stock actual."
343:                     : "La cantidad se resta del stock actual."
344:                 }
345:                 error={errors.quantity}
346:               />
347:             </View>
348:           ) : (
349:             <TextField
350:               label={
351:                 selectedProduct
352:                   ? `Stock contado (${selectedProduct.unit})`
353:                   : "Stock contado"
354:               }
355:               value={countedInput}
356:               onChangeText={(text) => {
357:                 setCountedInput(sanitizeDecimalInput(text));
358:                 setErrors((current) => ({ ...current, counted: undefined }));
359:               }}
360:               keyboardType="decimal-pad"
361:               placeholder="Ej. 12"
362:               hint={
363:                 selectedProduct
364:                   ? `Stock actual: ${formatQuantity(selectedProduct.stock)} ${selectedProduct.unit}. La diferencia se calcula automáticamente.`
365:                   : "La diferencia se calcula automáticamente."
366:               }
367:               error={errors.counted}
368:             />
369:           )}
370: 
371:           <TextField
372:             label="Motivo (opcional)"
373:             value={reason}
374:             onChangeText={setReason}
375:             placeholder="Ej. conteo físico, producto dañado…"
376:             maxLength={160}
377:             autoCapitalize="sentences"
378:           />
379:         </Card>
380: 
381:         {preview ? (
382:           <Card
383:             className={cn(
384:               "gap-3",
385:               preview.quantityDelta === 0
386:                 ? undefined
387:                 : isRemoval
388:                   ? "border-danger-border bg-danger-soft"
389:                   : "border-success/25 bg-success/10",
390:             )}
391:           >
392:             <View className="flex-row items-center justify-between gap-3">
393:               <AppText variant="title">Vista previa</AppText>
394:               <Badge
395:                 tone={
396:                   preview.quantityDelta === 0
397:                     ? "neutral"
398:                     : isRemoval
399:                       ? "danger"
400:                       : "success"
401:                 }
402:                 label={
403:                   preview.quantityDelta === 0
404:                     ? "Sin cambio"
405:                     : isRemoval
406:                       ? "Salida"
407:                       : "Entrada"
408:                 }
409:               />
410:             </View>
411: 
412:             <SummaryRow label="Stock actual">
413:               <AppText variant="body">
414:                 {formatQuantity(preview.stockBefore)} {preview.product.unit}
415:               </AppText>
416:             </SummaryRow>
417:             <SummaryRow label="Ajuste">
418:               <AppText style={{ color: deltaTone }} className="font-semibold">
419:                 {formatDelta(preview.quantityDelta)} {preview.product.unit}
420:               </AppText>
421:             </SummaryRow>
422:             <SummaryRow label="Stock después">
423:               <AppText
424:                 variant="body"
425:                 className={
426:                   preview.stockAfter < 0
427:                     ? "font-semibold text-danger"
428:                     : "font-semibold"
429:                 }
430:               >
431:                 {formatQuantity(preview.stockAfter)} {preview.product.unit}
432:               </AppText>
433:             </SummaryRow>
434:             <SummaryRow label="Costo congelado">
435:               <MoneyText value={preview.unitCost} />
436:             </SummaryRow>
437: 
438:             {preview.issue ? (
439:               <AppText variant="caption" className="text-danger">
440:                 {preview.issue}
441:               </AppText>
442:             ) : null}
443:           </Card>
444:         ) : null}
445:       </ScrollView>
446: 
447:       <View
448:         className="border-t border-border bg-surface px-4 pt-3"
449:         style={{ paddingBottom: Math.max(insets.bottom, 12) }}
450:       >
451:         <View className="flex-row gap-3">
452:           <Button
453:             label="Cancelar"
454:             variant="outline"
455:             className="flex-1"
456:             onPress={onCancel}
457:             disabled={submitting}
458:           />
459:           <Button
460:             label="Registrar ajuste"
461:             className="flex-1"
462:             loading={submitting}
463:             onPress={handleSubmit}
464:           />
465:         </View>
466:       </View>
467: 
468:       <ProductPicker
469:         visible={pickerVisible}
470:         selectedId={selectedProduct?.id}
471:         onSelect={handleSelect}
472:         onClose={() => setPickerVisible(false)}
473:       />
474:     </KeyboardAvoidingView>
475:   );
476: }

(End of file - total 476 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/sale/new.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/sale/new.tsx</path>
<type>file</type>
<content>
1: import { useLocalSearchParams, useRouter } from "expo-router";
2: import { useSQLiteContext } from "expo-sqlite";
3: import { useState } from "react";
4: import { ActivityIndicator, Alert, View } from "react-native";
5: import { SaleForm } from "@/components/movements/sale-form";
6: import { useDataRevision } from "@/database/data-context";
7: import {
8:   registerSale,
9:   type SaleInput,
10: } from "@/database/repositories/sales.repository";
11: import { useProduct } from "@/hooks/use-products";
12: import { usePalette } from "@/theme/colors";
13: 
14: export default function NewSaleScreen() {
15:   const params = useLocalSearchParams<{ productId?: string }>();
16:   const router = useRouter();
17:   const db = useSQLiteContext();
18:   const { refresh } = useDataRevision();
19:   const palette = usePalette();
20:   const { product, loading } = useProduct(params.productId);
21:   const [saving, setSaving] = useState(false);
22: 
23:   if (params.productId && loading) {
24:     return (
25:       <View className="flex-1 items-center justify-center bg-background">
26:         <ActivityIndicator color={palette.accent} />
27:       </View>
28:     );
29:   }
30: 
31:   async function handleSubmit(input: SaleInput) {
32:     setSaving(true);
33:     try {
34:       await registerSale(db, input);
35:       refresh();
36:       router.back();
37:     } catch (cause) {
38:       Alert.alert(
39:         "No se pudo registrar",
40:         cause instanceof Error ? cause.message : "Intenta de nuevo.",
41:       );
42:     } finally {
43:       setSaving(false);
44:     }
45:   }
46: 
47:   return (
48:     <SaleForm
49:       key={product?.id ?? "new"}
50:       initialProduct={product}
51:       submitting={saving}
52:       onSubmit={handleSubmit}
53:       onCancel={() => router.back()}
54:     />
55:   );
56: }

(End of file - total 56 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/adjustment/new.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/adjustment/new.tsx</path>
<type>file</type>
<content>
1: import { useLocalSearchParams, useRouter } from "expo-router";
2: import { useSQLiteContext } from "expo-sqlite";
3: import { useState } from "react";
4: import { ActivityIndicator, Alert, View } from "react-native";
5: import { AdjustmentForm } from "@/components/movements/adjustment-form";
6: import { useDataRevision } from "@/database/data-context";
7: import {
8:   registerAdjustment,
9:   type AdjustmentInput,
10: } from "@/database/repositories/adjustments.repository";
11: import { useProduct } from "@/hooks/use-products";
12: import { usePalette } from "@/theme/colors";
13: 
14: export default function NewAdjustmentScreen() {
15:   const params = useLocalSearchParams<{ productId?: string }>();
16:   const router = useRouter();
17:   const db = useSQLiteContext();
18:   const { refresh } = useDataRevision();
19:   const palette = usePalette();
20:   const { product, loading } = useProduct(params.productId);
21:   const [saving, setSaving] = useState(false);
22: 
23:   if (params.productId && loading) {
24:     return (
25:       <View className="flex-1 items-center justify-center bg-background">
26:         <ActivityIndicator color={palette.accent} />
27:       </View>
28:     );
29:   }
30: 
31:   async function handleSubmit(input: AdjustmentInput) {
32:     setSaving(true);
33:     try {
34:       await registerAdjustment(db, input);
35:       refresh();
36:       router.back();
37:     } catch (cause) {
38:       Alert.alert(
39:         "No se pudo registrar",
40:         cause instanceof Error ? cause.message : "Intenta de nuevo.",
41:       );
42:     } finally {
43:       setSaving(false);
44:     }
45:   }
46: 
47:   return (
48:     <AdjustmentForm
49:       key={product?.id ?? "new"}
50:       initialProduct={product}
51:       submitting={saving}
52:       onSubmit={handleSubmit}
53:       onCancel={() => router.back()}
54:     />
55:   );
56: }

(End of file - total 56 lines)
</content>
```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 11.8s)

_Thinking:_

Now let me look at the dashboard, inventory, history screens and hooks, plus the modified files (maybe in-progress changes). Also read product detail screen/index, movements routes for header titles (_layout).

Let me read: src/app/_layout.tsx, (tabs)/_layout.tsx, (tabs)/index.tsx, (tabs)/inventory.tsx, (tabs)/history.tsx, dashboard.repository, hooks use-dashboard, use-sales, data-context, product/[id]/index.tsx (modified), history detail.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/_layout.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/_layout.tsx</path>
<type>file</type>
<content>
1: import { Stack } from "expo-router";
2: import { StatusBar } from "expo-status-bar";
3: import { View } from "react-native";
4: import { GestureHandlerRootView } from "react-native-gesture-handler";
5: import { DatabaseProvider } from "@/database";
6: import { usePalette } from "@/theme/colors";
7: import "../global.css";
8: 
9: export default function RootLayout() {
10:   const palette = usePalette();
11: 
12:   return (
13:     <GestureHandlerRootView style={{ flex: 1 }}>
14:       <View className="flex-1 bg-background">
15:         <StatusBar style="dark" />
16:         <DatabaseProvider>
17:           <Stack
18:             screenOptions={{
19:               headerShown: false,
20:               headerStyle: { backgroundColor: palette.background },
21:               headerTintColor: palette.content,
22:               headerTitleStyle: { fontWeight: "700" },
23:               headerShadowVisible: false,
24:               contentStyle: { backgroundColor: palette.background },
25:             }}
26:           >
27:             <Stack.Screen name="(tabs)" />
28:             <Stack.Screen
29:               name="product/new"
30:               options={{
31:                 headerShown: true,
32:                 presentation: "modal",
33:                 title: "Nuevo producto",
34:               }}
35:             />
36:             <Stack.Screen
37:               name="product/[id]/index"
38:               options={{ headerShown: true, title: "Producto" }}
39:             />
40:             <Stack.Screen
41:               name="product/[id]/edit"
42:               options={{
43:                 headerShown: true,
44:                 presentation: "modal",
45:                 title: "Editar producto",
46:               }}
47:             />
48:             <Stack.Screen
49:               name="purchase/new"
50:               options={{
51:                 headerShown: true,
52:                 presentation: "modal",
53:                 title: "Registrar compra",
54:               }}
55:             />
56:             <Stack.Screen
57:               name="sale/new"
58:               options={{
59:                 headerShown: true,
60:                 presentation: "modal",
61:                 title: "Registrar venta",
62:               }}
63:             />
64:             <Stack.Screen
65:               name="adjustment/new"
66:               options={{
67:                 headerShown: true,
68:                 presentation: "modal",
69:                 title: "Ajustar stock",
70:               }}
71:             />
72:             <Stack.Screen
73:               name="history/[type]/[id]"
74:               options={{ headerShown: true, title: "Detalle" }}
75:             />
76:             <Stack.Screen name="+not-found" />
77:           </Stack>
78:         </DatabaseProvider>
79:       </View>
80:     </GestureHandlerRootView>
81:   );
82: }

(End of file - total 82 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/(tabs)/_layout.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/(tabs)/_layout.tsx</path>
<type>file</type>
<content>
1: import { AppText } from "@/components/ui";
2: import { usePalette } from "@/theme/colors";
3: import { MaterialCommunityIcons } from "@expo/vector-icons";
4: import { Tabs } from "expo-router";
5: import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
6: import type { ComponentProps } from "react";
7: import {
8:   Pressable,
9:   StyleSheet,
10:   View,
11:   type ColorValue,
12: } from "react-native";
13: 
14: type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];
15: 
16: function tabIcon(name: IconName) {
17:   return function TabBarIcon({ color, size }: { color: ColorValue; size: number }) {
18:     return <MaterialCommunityIcons name={name} size={size} color={color} />;
19:   };
20: }
21: 
22: function AppTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
23:   const palette = usePalette();
24: 
25:   return (
26:     <View
27:       style={[
28:         styles.bar,
29:         {
30:           backgroundColor: palette.surface,
31:           borderTopColor: palette.border,
32:           paddingBottom: insets.bottom,
33:         },
34:       ]}
35:     >
36:       {state.routes.map((route, index) => {
37:         const { options } = descriptors[route.key];
38:         const focused = state.index === index;
39:         const label = options.title ?? route.name;
40:         const color = focused ? palette.accent : palette.contentMuted;
41: 
42:         function handlePress() {
43:           const event = navigation.emit({
44:             type: "tabPress",
45:             target: route.key,
46:             canPreventDefault: true,
47:           });
48: 
49:           if (!focused && !event.defaultPrevented) {
50:             navigation.navigate(route.name, route.params);
51:           }
52:         }
53: 
54:         function handleLongPress() {
55:           navigation.emit({ type: "tabLongPress", target: route.key });
56:         }
57: 
58:         return (
59:           <Pressable
60:             key={route.key}
61:             accessibilityRole="tab"
62:             accessibilityState={{ selected: focused }}
63:             accessibilityLabel={options.tabBarAccessibilityLabel}
64:             onPress={handlePress}
65:             onLongPress={handleLongPress}
66:             style={styles.item}
67:           >
68:             <View
69:               style={[
70:                 styles.tabBackground,
71:                 {
72:                   backgroundColor: focused ? palette.accentSoft : "transparent",
73:                 },
74:               ]}
75:             >
76:               {options.tabBarIcon?.({ focused, color, size: 22 })}
77:               <AppText
78:                 variant="caption"
79:                 style={[styles.label, { color }]}
80:                 numberOfLines={1}
81:               >
82:                 {label}
83:               </AppText>
84:             </View>
85:           </Pressable>
86:         );
87:       })}
88:     </View>
89:   );
90: }
91: 
92: const styles = StyleSheet.create({
93:   bar: {
94:     flexDirection: "row",
95:     paddingHorizontal: 8,
96:     paddingTop: 4,
97:     borderTopWidth: StyleSheet.hairlineWidth,
98:   },
99:   item: {
100:     flex: 1,
101:     marginHorizontal: 3,
102:     marginBottom: 4,
103:   },
104:   tabBackground: {
105:     alignItems: "center",
106:     justifyContent: "center",
107:     gap: 2,
108:     paddingVertical: 6,
109:   },
110:   label: {
111:     fontSize: 10,
112:     lineHeight: 13,
113:     fontWeight: "600",
114:     letterSpacing: 0.2,
115:   },
116: });
117: 
118: export default function TabsLayout() {
119:   const palette = usePalette();
120: 
121:   return (
122:     <Tabs
123:       tabBar={(props) => <AppTabBar {...props} />}
124:       screenOptions={{
125:         headerStyle: { backgroundColor: palette.background },
126:         headerTintColor: palette.content,
127:         headerTitleStyle: { fontWeight: "700" },
128:         headerShadowVisible: true,
129:         sceneStyle: { backgroundColor: palette.background },
130:       }}
131:     >
132:       <Tabs.Screen
133:         name="index"
134:         options={{ title: "Inicio", tabBarIcon: tabIcon("view-dashboard-outline") }}
135:       />
136:       <Tabs.Screen
137:         name="inventory"
138:         options={{ title: "Inventario", tabBarIcon: tabIcon("package-variant-closed") }}
139:       />
140:       <Tabs.Screen
141:         name="movements"
142:         options={{ title: "Movimientos", tabBarIcon: tabIcon("swap-horizontal") }}
143:       />
144:       <Tabs.Screen
145:         name="history"
146:         options={{ title: "Historial", tabBarIcon: tabIcon("history") }}
147:       />
148:     </Tabs>
149:   );
150: }

(End of file - total 150 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/(tabs)/index.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/(tabs)/index.tsx</path>
<type>file</type>
<content>
1: import {
2:   AppText,
3:   Badge,
4:   Button,
5:   Card,
6:   MoneyText,
7:   Screen,
8: } from "@/components/ui";
9: import type { DashboardActivity } from "@/database/repositories/dashboard.repository";
10: import type { Product } from "@/database/types";
11: import { formatDateTime } from "@/database/utils/dates";
12: import { formatQuantity } from "@/database/utils/quantity";
13: import { useDashboard } from "@/hooks/use-dashboard";
14: import { usePalette } from "@/theme/colors";
15: import { cn } from "@/utils/cn";
16: import { MaterialCommunityIcons } from "@expo/vector-icons";
17: import { useRouter } from "expo-router";
18: import { ActivityIndicator, Pressable, View } from "react-native";
19: 
20: const activityStyles = {
21:   purchase: { icon: "cart-arrow-down", label: "Compra" },
22:   sale: { icon: "cash-register", label: "Venta" },
23:   adjustment: { icon: "swap-vertical", label: "Ajuste" },
24: } as const;
25: 
26: function formatDelta(value: number): string {
27:   if (value === 0) return formatQuantity(0);
28:   const formatted = formatQuantity(Math.abs(value));
29:   return value > 0 ? `+${formatted}` : `-${formatted}`;
30: }
31: 
32: function ActivityCard({ entry }: { entry: DashboardActivity }) {
33:   const palette = usePalette();
34:   const meta = activityStyles[entry.type];
35:   const isAdjustment = entry.type === "adjustment";
36:   const isRemoval = isAdjustment && entry.quantity < 0;
37:   const color = isAdjustment
38:     ? isRemoval
39:       ? palette.danger
40:       : palette.success
41:     : entry.type === "purchase"
42:       ? palette.warning
43:       : palette.success;
44:   const cardTone = isAdjustment
45:     ? isRemoval
46:       ? "border-danger-border bg-danger-soft"
47:       : "border-success/25 bg-success/10"
48:     : entry.type === "purchase"
49:       ? "border-warning/25 bg-warning/10"
50:       : "border-success/25 bg-success/10";
51:   const badgeTone = isAdjustment
52:     ? isRemoval
53:       ? "danger"
54:       : "success"
55:     : entry.type === "purchase"
56:       ? "warning"
57:       : "success";
58: 
59:   return (
60:     <Card className={cn("gap-3", cardTone)}>
61:       <View className="flex-row items-start justify-between gap-3">
62:         <View className="flex-1 flex-row items-center gap-2">
63:           <View className="h-9 w-9 items-center justify-center rounded-full bg-surface">
64:             <MaterialCommunityIcons name={meta.icon} size={18} color={color} />
65:           </View>
66:           <View className="flex-1 gap-0.5">
67:             <AppText className="font-semibold" numberOfLines={1}>
68:               {entry.productName}
69:             </AppText>
70:             <AppText variant="caption">{formatDateTime(entry.createdAt)}</AppText>
71:           </View>
72:         </View>
73:         <Badge tone={badgeTone} label={meta.label} />
74:       </View>
75: 
76:       <View className="flex-row items-end justify-between gap-3">
77:         <View className="gap-0.5">
78:           <AppText variant="caption">
79:             {isAdjustment ? "Ajuste" : "Cantidad"}
80:           </AppText>
81:           <AppText
82:             className="font-semibold"
83:             style={isAdjustment ? { color } : undefined}
84:           >
85:             {isAdjustment
86:               ? formatDelta(entry.quantity)
87:               : formatQuantity(entry.quantity)}{" "}
88:             {entry.productUnit}
89:           </AppText>
90:         </View>
91:         <View className="items-end gap-0.5">
92:           <AppText variant="caption">
93:             {isAdjustment ? "Costo unidad" : "Total"}
94:           </AppText>
95:           <MoneyText
96:             value={isAdjustment ? entry.unitPrice : entry.total}
97:             className="font-semibold"
98:           />
99:         </View>
100:       </View>
101: 
102:       {isAdjustment && entry.reason ? (
103:         <AppText variant="caption">{entry.reason}</AppText>
104:       ) : null}
105:     </Card>
106:   );
107: }
108: 
109: function LowStockRow({
110:   product,
111:   last,
112:   onPress,
113: }: {
114:   product: Product;
115:   last: boolean;
116:   onPress: () => void;
117: }) {
118:   const palette = usePalette();
119: 
120:   return (
121:     <Pressable
122:       accessibilityRole="button"
123:       accessibilityLabel={`${product.name}, ${formatQuantity(product.stock)} ${product.unit}, stock bajo`}
124:       onPress={onPress}
125:       className={cn(
126:         "flex-row items-center gap-3",
127:         !last && "border-b border-border pb-3",
128:       )}
129:       style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
130:     >
131:       <View className="flex-1 gap-0.5">
132:         <AppText className="font-semibold">{product.name}</AppText>
133:         <AppText variant="caption" className="text-danger">
134:           {formatQuantity(product.stock)} {product.unit} · mínimo{" "}
135:           {formatQuantity(product.minStock)}
136:         </AppText>
137:       </View>
138:       <MaterialCommunityIcons
139:         name="chevron-right"
140:         size={20}
141:         color={palette.contentMuted}
142:       />
143:     </Pressable>
144:   );
145: }
146: 
147: export default function HomeScreen() {
148:   const router = useRouter();
149:   const palette = usePalette();
150:   const { stats, lowStock, activity, loading, error } = useDashboard();
151: 
152:   return (
153:     <Screen>
154:       {/* <View className="gap-1">
155:         <AppText variant="eyebrow" className="text-accent">
156:           Resumen
157:         </AppText>
158:         <AppText variant="hero">Tu almacén</AppText>
159:         <AppText variant="muted">
160:           {stats
161:             ? `${stats.activeProducts} ${
162:                 stats.activeProducts === 1 ? "producto activo" : "productos activos"
163:               } · Todo se guarda en este dispositivo.`
164:             : "Todo se guarda en este dispositivo."}
165:         </AppText>
166:       </View> */}
167: 
168:       {loading && !stats ? (
169:         <View className="items-center py-16">
170:           <ActivityIndicator color={palette.accent} />
171:         </View>
172:       ) : null}
173: 
174:       {error ? (
175:         <Card>
176:           <AppText variant="caption" className="text-danger">
177:             {error}
178:           </AppText>
179:         </Card>
180:       ) : null}
181: 
182:       {stats ? (
183:         <>
184:           <View className="flex-row gap-3">
185:             <Card className="flex-1 gap-1">
186:               <AppText variant="caption">Valor a costo</AppText>
187:               <MoneyText value={stats.costValue} variant="title" />
188:             </Card>
189:             <Card className="flex-1 gap-1">
190:               <AppText variant="caption">Valor a venta</AppText>
191:               <MoneyText value={stats.saleValue} variant="title" />
192:             </Card>
193:           </View>
194: 
195:           <View className="flex-row gap-3">
196:             <Card className="flex-1 gap-1">
197:               <AppText variant="caption">Ganancia potencial</AppText>
198:               <MoneyText
199:                 value={stats.potentialProfit}
200:                 variant="title"
201:                 style={{
202:                   color:
203:                     stats.potentialProfit < 0 ? palette.danger : palette.success,
204:                 }}
205:               />
206:             </Card>
207:             <Card className="flex-1 gap-1">
208:               <AppText variant="caption">Unidades</AppText>
209:               <AppText
210:                 variant="title"
211:                 style={{ fontVariant: ["tabular-nums"] }}
212:               >
213:                 {formatQuantity(stats.totalUnits)}
214:               </AppText>
215:             </Card>
216:           </View>
217: 
218:           {stats.activeProducts === 0 ? (
219:             <Card className="items-center gap-3 py-6">
220:               <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
221:                 <MaterialCommunityIcons
222:                   name="package-variant"
223:                   size={24}
224:                   color={palette.accent}
225:                 />
226:               </View>
227:               <AppText variant="title">Tu almacén está vacío</AppText>
228:               <AppText variant="muted" className="text-center">
229:                 Crea tu primer producto para empezar a controlar el stock.
230:               </AppText>
231:               <Button
232:                 label="Crear producto"
233:                 onPress={() => router.push("/product/new")}
234:               />
235:             </Card>
236:           ) : (
237:             <>
238:               <Card className="gap-3">
239:                 <View className="flex-row items-start justify-between gap-3">
240:                   <View className="flex-1 gap-1">
241:                     <AppText variant="title">Stock bajo</AppText>
242:                     <AppText variant="muted">
243:                       Productos en su mínimo o por debajo.
244:                     </AppText>
245:                   </View>
246:                   <Badge
247:                     tone={stats.lowStockCount > 0 ? "danger" : "success"}
248:                     label={
249:                       stats.lowStockCount > 0
250:                         ? `${stats.lowStockCount} en alerta`
251:                         : "Sin alertas"
252:                     }
253:                   />
254:                 </View>
255: 
256:                 {lowStock.length === 0 ? (
257:                   <AppText variant="muted">
258:                     Configura un stock mínimo por producto para activar las
259:                     alertas.
260:                   </AppText>
261:                 ) : (
262:                   <>
263:                     <View className="gap-3">
264:                       {lowStock.slice(0, 3).map((product, index) => (
265:                         <LowStockRow
266:                           key={product.id}
267:                           product={product}
268:                           last={index === Math.min(lowStock.length, 3) - 1}
269:                           onPress={() =>
270:                             router.push({
271:                               pathname: "/product/[id]",
272:                               params: { id: product.id },
273:                             })
274:                           }
275:                         />
276:                       ))}
277:                     </View>
278:                     {lowStock.length > 3 ? (
279:                       <Button
280:                         label="Ver inventario"
281:                         variant="ghost"
282:                         size="sm"
283:                         onPress={() => router.push("/inventory")}
284:                       />
285:                     ) : null}
286:                   </>
287:                 )}
288:               </Card>
289: 
290:               <View className="gap-3">
291:                 <View className="flex-row items-center justify-between gap-3">
292:                   <AppText variant="title">Actividad reciente</AppText>
293:                   <Button
294:                     label="Ver todo"
295:                     variant="ghost"
296:                     size="sm"
297:                     onPress={() => router.push("/movements")}
298:                   />
299:                 </View>
300: 
301:                 {activity.length === 0 ? (
302:                   <Card>
303:                     <AppText variant="muted">
304:                       Aún no hay compras, ventas ni ajustes.
305:                     </AppText>
306:                   </Card>
307:                 ) : (
308:                   activity.map((entry) => (
309:                     <ActivityCard
310:                       key={`${entry.type}-${entry.id}`}
311:                       entry={entry}
312:                     />
313:                   ))
314:                 )}
315:               </View>
316:             </>
317:           )}
318:         </>
319:       ) : null}
320:     </Screen>
321:   );
322: }

(End of file - total 322 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/(tabs)/inventory.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/(tabs)/inventory.tsx</path>
<type>file</type>
<content>
1: import { MaterialCommunityIcons } from "@expo/vector-icons";
2: import { useRouter } from "expo-router";
3: import { useDeferredValue, useState } from "react";
4: import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
5: import { ProductRow } from "@/components/products/product-row";
6: import { AppText, Button, EmptyState, TextField } from "@/components/ui";
7: import { useProducts } from "@/hooks/use-products";
8: import { usePalette } from "@/theme/colors";
9: import { cn } from "@/utils/cn";
10: 
11: type Filter = "all" | "low";
12: 
13: function FilterChip({
14:   label,
15:   active,
16:   onPress,
17: }: {
18:   label: string;
19:   active: boolean;
20:   onPress: () => void;
21: }) {
22:   return (
23:     <Pressable
24:       accessibilityRole="button"
25:       accessibilityState={{ selected: active }}
26:       onPress={onPress}
27:       className={cn(
28:         "rounded-full border px-3 py-2",
29:         active ? "border-accent bg-accent-soft" : "border-border bg-surface",
30:       )}
31:     >
32:       <AppText
33:         variant="caption"
34:         className={cn("font-semibold", active ? "text-accent" : "text-content-muted")}
35:       >
36:         {label}
37:       </AppText>
38:     </Pressable>
39:   );
40: }
41: 
42: export default function InventoryScreen() {
43:   const router = useRouter();
44:   const palette = usePalette();
45:   const [search, setSearch] = useState("");
46:   const [filter, setFilter] = useState<Filter>("all");
47:   const deferredSearch = useDeferredValue(search);
48: 
49:   const { products, loading, error } = useProducts({
50:     search: deferredSearch,
51:     lowStockOnly: filter === "low",
52:   });
53: 
54:   const hasSearch = search.trim().length > 0;
55:   const emptyTitle = hasSearch
56:     ? "Sin resultados"
57:     : filter === "low"
58:       ? "Sin productos por agotarse"
59:       : "Inventario vacío";
60:   const emptyDescription = hasSearch
61:     ? "Prueba con otro nombre."
62:     : filter === "low"
63:       ? "Los productos con stock bajo aparecerán aquí."
64:       : "Crea tu primer producto para empezar a controlar el stock.";
65: 
66:   return (
67:     <View className="flex-1 bg-background">
68:       <FlatList
69:         data={products}
70:         keyExtractor={(item) => item.id}
71:         contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 12 }}
72:         contentInsetAdjustmentBehavior="automatic"
73:         keyboardShouldPersistTaps="handled"
74:         showsVerticalScrollIndicator={false}
75:         ListHeaderComponent={
76:           <View className="gap-3 pb-1">
77:             <TextField
78:               value={search}
79:               onChangeText={setSearch}
80:               placeholder="Buscar por nombre"
81:               autoCapitalize="none"
82:               returnKeyType="search"
83:             />
84:             <View className="flex-row gap-2">
85:               <FilterChip
86:                 label="Todos"
87:                 active={filter === "all"}
88:                 onPress={() => setFilter("all")}
89:               />
90:               <FilterChip
91:                 label="Stock bajo"
92:                 active={filter === "low"}
93:                 onPress={() => setFilter("low")}
94:               />
95:             </View>
96:             {error ? (
97:               <AppText variant="caption" className="text-danger">
98:                 {error}
99:               </AppText>
100:             ) : null}
101:           </View>
102:         }
103:         renderItem={({ item }) => (
104:           <ProductRow
105:             product={item}
106:             onPress={() =>
107:               router.push({ pathname: "/product/[id]", params: { id: item.id } })
108:             }
109:           />
110:         )}
111:         ListEmptyComponent={
112:           loading ? (
113:             <View className="items-center py-12">
114:               <ActivityIndicator color={palette.accent} />
115:             </View>
116:           ) : (
117:             <EmptyState
118:               icon={
119:                 hasSearch
120:                   ? "magnify"
121:                   : filter === "low"
122:                     ? "check-circle-outline"
123:                     : "package-variant-closed"
124:               }
125:               title={emptyTitle}
126:               description={emptyDescription}
127:               action={
128:                 !hasSearch && filter === "all" ? (
129:                   <Button
130:                     label="Crear producto"
131:                     onPress={() => router.push("/product/new")}
132:                   />
133:                 ) : undefined
134:               }
135:             />
136:           )
137:         }
138:         ListFooterComponent={
139:           loading && products.length > 0 ? (
140:             <ActivityIndicator color={palette.accent} style={{ marginTop: 12 }} />
141:           ) : null
142:         }
143:       />
144: 
145:       <Pressable
146:         accessibilityRole="button"
147:         accessibilityLabel="Nuevo producto"
148:         onPress={() => router.push("/product/new")}
149:         className="absolute bottom-6 right-4 h-14 w-14 items-center justify-center rounded-full bg-accent"
150:         style={({ pressed }) => [
151:           { boxShadow: "0 8px 20px rgba(116, 92, 66, 0.28)" },
152:           pressed ? { opacity: 0.85, transform: [{ scale: 0.96 }] } : null,
153:         ]}
154:       >
155:         <MaterialCommunityIcons name="plus" size={26} color={palette.onAccent} />
156:       </Pressable>
157:     </View>
158:   );
159: }

(End of file - total 159 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/(tabs)/history.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/(tabs)/history.tsx</path>
<type>file</type>
<content>
1: import { MaterialCommunityIcons } from "@expo/vector-icons";
2: import { useRouter } from "expo-router";
3: import { useMemo, useState } from "react";
4: import {
5:   ActivityIndicator,
6:   FlatList,
7:   Pressable,
8:   ScrollView,
9:   View,
10: } from "react-native";
11: import { ProductPicker } from "@/components/products/product-picker";
12: import {
13:   AppText,
14:   Badge,
15:   Button,
16:   Card,
17:   EmptyState,
18:   MoneyText,
19: } from "@/components/ui";
20: import type {
21:   HistoryListItem,
22: } from "@/database/repositories/history.repository";
23: import type { HistoryType, Product } from "@/database/types";
24: import { formatDateTime } from "@/database/utils/dates";
25: import { formatQuantity } from "@/database/utils/quantity";
26: import { useHistory } from "@/hooks/use-history";
27: import { usePalette } from "@/theme/colors";
28: import { cn } from "@/utils/cn";
29: 
30: type TypeFilter = "all" | HistoryType;
31: type DateFilter = "all" | "today" | "week" | "month";
32: 
33: const typeOptions: { value: TypeFilter; label: string }[] = [
34:   { value: "all", label: "Todo" },
35:   { value: "purchase", label: "Compras" },
36:   { value: "sale", label: "Ventas" },
37:   { value: "adjustment", label: "Ajustes" },
38: ];
39: 
40: const dateOptions: { value: DateFilter; label: string }[] = [
41:   { value: "all", label: "Todo" },
42:   { value: "today", label: "Hoy" },
43:   { value: "week", label: "7 días" },
44:   { value: "month", label: "30 días" },
45: ];
46: 
47: function resolveSince(filter: DateFilter): number | undefined {
48:   if (filter === "all") return undefined;
49:   if (filter === "today") {
50:     const today = new Date();
51:     today.setHours(0, 0, 0, 0);
52:     return today.getTime();
53:   }
54: 
55:   const days = filter === "week" ? 7 : 30;
56:   return Date.now() - days * 24 * 60 * 60 * 1000;
57: }
58: 
59: function formatDelta(value: number): string {
60:   if (value === 0) return formatQuantity(0);
61:   const formatted = formatQuantity(Math.abs(value));
62:   return value > 0 ? `+${formatted}` : `-${formatted}`;
63: }
64: 
65: function FilterChip({
66:   label,
67:   active,
68:   onPress,
69: }: {
70:   label: string;
71:   active: boolean;
72:   onPress: () => void;
73: }) {
74:   return (
75:     <Pressable
76:       accessibilityRole="button"
77:       accessibilityState={{ selected: active }}
78:       onPress={onPress}
79:       className={cn(
80:         "rounded-full border px-3 py-2",
81:         active ? "border-accent bg-accent-soft" : "border-border bg-surface",
82:       )}
83:     >
84:       <AppText
85:         variant="caption"
86:         className={cn(
87:           "font-semibold",
88:           active ? "text-accent" : "text-content-muted",
89:         )}
90:       >
91:         {label}
92:       </AppText>
93:     </Pressable>
94:   );
95: }
96: 
97: function HistoryCard({
98:   entry,
99:   onPress,
100: }: {
101:   entry: HistoryListItem;
102:   onPress: () => void;
103: }) {
104:   const palette = usePalette();
105:   const isAdjustment = entry.type === "adjustment";
106:   const isRemoval = isAdjustment && entry.quantity < 0;
107:   const color = isAdjustment
108:     ? isRemoval
109:       ? palette.danger
110:       : palette.success
111:     : entry.type === "purchase"
112:       ? palette.warning
113:       : palette.success;
114:   const cardTone = isAdjustment
115:     ? isRemoval
116:       ? "border-danger-border bg-danger-soft"
117:       : "border-success/25 bg-success/10"
118:     : entry.type === "purchase"
119:       ? "border-warning/25 bg-warning/10"
120:       : "border-success/25 bg-success/10";
121:   const badgeTone = isAdjustment
122:     ? isRemoval
123:       ? "danger"
124:       : "success"
125:     : entry.type === "purchase"
126:       ? "warning"
127:       : "success";
128:   const label = isAdjustment
129:     ? "Ajuste"
130:     : entry.type === "purchase"
131:       ? "Compra"
132:       : "Venta";
133: 
134:   return (
135:     <Pressable
136:       accessibilityRole="button"
137:       accessibilityLabel={`Ver detalle de ${label} de ${entry.productName}`}
138:       onPress={onPress}
139:       style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
140:     >
141:       <Card className={cn("gap-3", cardTone)}>
142:         <View className="flex-row items-start justify-between gap-3">
143:           <View className="flex-1 gap-1">
144:             <AppText className="font-semibold" numberOfLines={1}>
145:               {entry.productName}
146:             </AppText>
147:             <AppText variant="caption">{formatDateTime(entry.createdAt)}</AppText>
148:           </View>
149:           <Badge tone={badgeTone} label={label} />
150:         </View>
151: 
152:         <View className="flex-row items-end justify-between gap-3">
153:           <View className="gap-0.5">
154:             <AppText variant="caption">
155:               {isAdjustment ? "Ajuste" : "Cantidad"}
156:             </AppText>
157:             <AppText
158:               className="font-semibold"
159:               style={isAdjustment ? { color } : undefined}
160:             >
161:               {isAdjustment
162:                 ? formatDelta(entry.quantity)
163:                 : formatQuantity(entry.quantity)}{" "}
164:               {entry.productUnit}
165:             </AppText>
166:           </View>
167:           <View className="flex-row items-center gap-2">
168:             <View className="items-end gap-0.5">
169:               <AppText variant="caption">
170:                 {isAdjustment ? "Costo unidad" : "Total"}
171:               </AppText>
172:               <MoneyText
173:                 value={isAdjustment ? entry.unitPrice : entry.total}
174:                 className="font-semibold"
175:               />
176:             </View>
177:             <MaterialCommunityIcons
178:               name="chevron-right"
179:               size={20}
180:               color={palette.contentMuted}
181:             />
182:           </View>
183:         </View>
184: 
185:         {isAdjustment && entry.reason ? (
186:           <AppText variant="caption">{entry.reason}</AppText>
187:         ) : null}
188:       </Card>
189:     </Pressable>
190:   );
191: }
192: 
193: export default function HistoryScreen() {
194:   const router = useRouter();
195:   const palette = usePalette();
196:   const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
197:   const [dateFilter, setDateFilter] = useState<DateFilter>("all");
198:   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
199:   const [pickerVisible, setPickerVisible] = useState(false);
200: 
201:   const since = useMemo(() => resolveSince(dateFilter), [dateFilter]);
202:   const { entries, loading, error } = useHistory({
203:     type: typeFilter === "all" ? undefined : typeFilter,
204:     productId: selectedProduct?.id,
205:     since,
206:   });
207: 
208:   const hasFilters =
209:     typeFilter !== "all" || dateFilter !== "all" || selectedProduct != null;
210: 
211:   function clearFilters() {
212:     setTypeFilter("all");
213:     setDateFilter("all");
214:     setSelectedProduct(null);
215:   }
216: 
217:   return (
218:     <View className="flex-1 bg-background">
219:       <FlatList
220:         data={entries}
221:         keyExtractor={(item) => `${item.type}-${item.id}`}
222:         contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
223:         contentInsetAdjustmentBehavior="automatic"
224:         showsVerticalScrollIndicator={false}
225:         ListHeaderComponent={
226:           <View className="gap-3 pb-1">
227:             <View className="flex-row items-center justify-between gap-3">
228:               <View className="flex-1 gap-1">
229:                 <AppText variant="eyebrow" className="text-accent">
230:                   Historial
231:                 </AppText>
232:                 <AppText variant="title">Movimientos</AppText>
233:                 <AppText variant="muted">
234:                   {entries.length === 1
235:                     ? "1 movimiento registrado"
236:                     : `${entries.length} movimientos registrados`}
237:                 </AppText>
238:               </View>
239:               {hasFilters ? (
240:                 <Button
241:                   label="Limpiar"
242:                   variant="ghost"
243:                   size="sm"
244:                   onPress={clearFilters}
245:                 />
246:               ) : null}
247:             </View>
248: 
249:             <View className="flex-row flex-wrap gap-2">
250:               {typeOptions.map((option) => (
251:                 <FilterChip
252:                   key={option.value}
253:                   label={option.label}
254:                   active={typeFilter === option.value}
255:                   onPress={() => setTypeFilter(option.value)}
256:                 />
257:               ))}
258:             </View>
259: 
260:             <ScrollView
261:               horizontal
262:               showsHorizontalScrollIndicator={false}
263:               contentContainerStyle={{ gap: 8 }}
264:             >
265:               {dateOptions.map((option) => (
266:                 <FilterChip
267:                   key={option.value}
268:                   label={option.label}
269:                   active={dateFilter === option.value}
270:                   onPress={() => setDateFilter(option.value)}
271:                 />
272:               ))}
273:             </ScrollView>
274: 
275:             <Pressable
276:               accessibilityRole="button"
277:               accessibilityLabel="Filtrar por producto"
278:               onPress={() => setPickerVisible(true)}
279:               className="flex-row items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
280:               style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
281:             >
282:               <View className="flex-1 gap-0.5">
283:                 <AppText variant="caption">Producto</AppText>
284:                 <AppText className="font-semibold" numberOfLines={1}>
285:                   {selectedProduct?.name ?? "Todos"}
286:                 </AppText>
287:               </View>
288:               <MaterialCommunityIcons
289:                 name="chevron-down"
290:                 size={20}
291:                 color={palette.contentMuted}
292:               />
293:             </Pressable>
294: 
295:             {error ? (
296:               <AppText variant="caption" className="text-danger">
297:                 {error}
298:               </AppText>
299:             ) : null}
300:           </View>
301:         }
302:         renderItem={({ item }) => (
303:           <HistoryCard
304:             entry={item}
305:             onPress={() =>
306:               router.push({
307:                 pathname: "/history/[type]/[id]",
308:                 params: { type: item.type, id: item.id },
309:               })
310:             }
311:           />
312:         )}
313:         ListEmptyComponent={
314:           loading ? (
315:             <View className="items-center py-12">
316:               <ActivityIndicator color={palette.accent} />
317:             </View>
318:           ) : (
319:             <EmptyState
320:               icon={hasFilters ? "magnify" : "history"}
321:               title={hasFilters ? "Sin resultados" : "Sin historial"}
322:               description={
323:                 hasFilters
324:                   ? "Prueba con otros filtros o limpia la búsqueda."
325:                   : "Cada compra, venta y ajuste quedará guardado con los precios del momento."
326:               }
327:               action={
328:                 hasFilters ? (
329:                   <Button
330:                     label="Limpiar filtros"
331:                     variant="outline"
332:                     onPress={clearFilters}
333:                   />
334:                 ) : (
335:                   <Button
336:                     label="Ir a movimientos"
337:                     onPress={() => router.push("/movements")}
338:                   />
339:                 )
340:               }
341:             />
342:           )
343:         }
344:         ListFooterComponent={
345:           loading && entries.length > 0 ? (
346:             <ActivityIndicator color={palette.accent} style={{ marginTop: 12 }} />
347:           ) : null
348:         }
349:       />
350: 
351:       <ProductPicker
352:         visible={pickerVisible}
353:         selectedId={selectedProduct?.id}
354:         includeArchived
355:         onSelect={(product) => {
356:           setSelectedProduct(product);
357:           setPickerVisible(false);
358:         }}
359:         onClose={() => setPickerVisible(false)}
360:       />
361:     </View>
362:   );
363: }

(End of file - total 363 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/repositories/dashboard.repository.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/repositories/dashboard.repository.ts</path>
<type>file</type>
<content>
1: import type { SQLiteDatabase } from "expo-sqlite";
2: import type { HistoryEntry, HistoryType } from "../types";
3: import { roundMoney } from "../utils/money";
4: import { roundQuantity } from "../utils/quantity";
5: 
6: export interface DashboardStats {
7:   costValue: number;
8:   saleValue: number;
9:   potentialProfit: number;
10:   totalUnits: number;
11:   activeProducts: number;
12:   lowStockCount: number;
13: }
14: 
15: export interface DashboardActivity extends HistoryEntry {
16:   productUnit: string;
17: }
18: 
19: interface StatsRow {
20:   cost_value: number | null;
21:   sale_value: number | null;
22:   total_units: number | null;
23:   active_products: number;
24:   low_stock_count: number;
25: }
26: 
27: interface ActivityRow {
28:   type: HistoryType;
29:   id: string;
30:   product_id: string;
31:   product_name: string;
32:   quantity: number;
33:   total: number | null;
34:   unit_price: number | null;
35:   reason: string | null;
36:   created_at: number;
37:   product_unit: string;
38: }
39: 
40: function mapActivity(row: ActivityRow): DashboardActivity {
41:   return {
42:     type: row.type,
43:     id: row.id,
44:     productId: row.product_id,
45:     productName: row.product_name,
46:     quantity: row.quantity,
47:     total: row.total,
48:     unitPrice: row.unit_price,
49:     reason: row.reason,
50:     createdAt: row.created_at,
51:     productUnit: row.product_unit,
52:   };
53: }
54: 
55: export async function getDashboardStats(
56:   db: SQLiteDatabase,
57: ): Promise<DashboardStats> {
58:   const row = await db.getFirstAsync<StatsRow>(
59:     `SELECT
60:        COALESCE(SUM(stock * COALESCE(current_price, 0)), 0) AS cost_value,
61:        COALESCE(SUM(stock * COALESCE(sale_price, 0)), 0) AS sale_value,
62:        COALESCE(SUM(stock), 0) AS total_units,
63:        COUNT(*) AS active_products,
64:        COALESCE(SUM(
65:          CASE WHEN min_stock > 0 AND stock <= min_stock THEN 1 ELSE 0 END
66:        ), 0) AS low_stock_count
67:      FROM products
68:      WHERE archived_at IS NULL`,
69:   );
70: 
71:   const costValue = roundMoney(row?.cost_value ?? 0);
72:   const saleValue = roundMoney(row?.sale_value ?? 0);
73: 
74:   return {
75:     costValue,
76:     saleValue,
77:     potentialProfit: saleValue - costValue,
78:     totalUnits: roundQuantity(row?.total_units ?? 0),
79:     activeProducts: row?.active_products ?? 0,
80:     lowStockCount: row?.low_stock_count ?? 0,
81:   };
82: }
83: 
84: export async function listRecentActivity(
85:   db: SQLiteDatabase,
86:   limit = 5,
87: ): Promise<DashboardActivity[]> {
88:   const rows = await db.getAllAsync<ActivityRow>(
89:     `SELECT h.*, pr.unit AS product_unit
90:      FROM history h
91:      JOIN products pr ON pr.id = h.product_id
92:      ORDER BY h.created_at DESC
93:      LIMIT ?`,
94:     [limit],
95:   );
96: 
97:   return rows.map(mapActivity);
98: }

(End of file - total 98 lines)
</content>
```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 11.4s)

_Thinking:_

Now let me read the product detail screen (has quick actions likely including sell), product-row, products repository (modified), purchases repository (modified), history detail screen, hooks.

Also check git diff on modified files to understand in-progress changes.

**Tool: bash**

**Input:**
```json
{
  "command": "cd /home/viticomc/Work/mi-almacen && git diff --stat && echo \"=== DIFF ===\" && git diff"
}
```

**Output:**
```
 guide.md                                          |  34 +++--
 src/app/product/[id]/index.tsx                    |  21 +++
 src/components/movements/purchase-form.tsx        | 175 +++++++++++++++-------
 src/components/products/product-form.tsx          | 137 ++++++++---------
 src/components/products/product-row.tsx           |  49 ++++--
 src/database/repositories/products.repository.ts  |  10 ++
 src/database/repositories/purchases.repository.ts |  35 ++++-
 7 files changed, 315 insertions(+), 146 deletions(-)
=== DIFF ===
diff --git a/guide.md b/guide.md
index 58d7f6a..a487422 100644
--- a/guide.md
+++ b/guide.md
@@ -26,13 +26,13 @@ La prioridad es la simplicidad: pocos campos, pocos pasos, una interfaz limpia y
 | Unidad | Campo `unit` / **pesaje**: texto libre escrito por el usuario (`g`, `lb`, `unidad`, `caja`...) |
 | Conversiones | No existen. Compras, ventas y stock usan siempre la unidad del producto |
 | Precio de costo | Se define al registrar una compra, no al crear el producto |
-| Precio de salida | Se calcula con un margen definido por el usuario |
+| Precio de salida | Se calcula con un margen definido por el usuario o se define directamente |
 | Margen máximo | Estrictamente menor a 30% (ley local) |
 | Proveedores | No se incluyen |
 | Valor del stock | Se muestran valor a costo y valor potencial a venta |
 | Stock negativo | Prohibido |
-| Borrado de productos | Suave, para conservar historial |
-| Recalcular salida | Al cambiar el costo se elige entre recalcular con el margen guardado o mantener el precio actual |
+| Borrado de productos | Suave y solo con stock en cero; si hay stock se advierte y se pide ajustarlo |
+| Recalcular salida | Al cambiar el costo se elige entre recalcular con el margen guardado, mantener el precio actual o definir el precio de venta directamente |
 
 ## 3. Modelo de datos
 
@@ -48,7 +48,7 @@ La prioridad es la simplicidad: pocos campos, pocos pasos, una interfaz limpia y
 | `last_price` | INTEGER NULL | Costo anterior por unidad |
 | `current_price` | INTEGER NULL | Costo actual por unidad |
 | `sale_price` | INTEGER NULL | Precio de salida calculado |
-| `margin_percent` | REAL | Margen configurado por el usuario |
+| `margin_percent` | REAL | Margen configurado en la compra (0 = sin definir) |
 | `created_at` | INTEGER | Fecha en milisegundos |
 | `updated_at` | INTEGER | Fecha en milisegundos |
 | `archived_at` | INTEGER NULL | Borrado suave |
@@ -102,20 +102,22 @@ Vista SQL `history` con `UNION ALL` de compras, ventas y ajustes. No se duplican
 
 ### 4.1 Crear producto
 
-Se registran solo: nombre, pesaje/unidad y stock mínimo. Los precios nacen en `NULL`. El margen puede configurarse después.
+Se registran solo: nombre, pesaje/unidad y stock mínimo. Los precios nacen en `NULL` y el margen en `0`. El costo, el margen y el precio de salida se configuran en la primera compra.
 
 ### 4.2 Registrar compra
 
 1. El usuario ingresa producto, cantidad y total pagado.
 2. `unit_cost = round(total / quantity)`.
-3. Antes de confirmar, la interfaz muestra costo anterior, costo nuevo por unidad, margen definido y las dos opciones de precio de salida:
-   - **recalcular** con el margen guardado (redondeando al múltiplo de 5 superior inmediato), o
-   - **mantener** el precio de salida actual.
-4. Mantener el precio solo se permite si el margen efectivo resultante es menor a 30%; si es negativo se advierte.
+3. Antes de confirmar, la interfaz muestra costo anterior, costo nuevo por unidad, margen definido y tres opciones de precio de salida:
+   - **recalcular** con el margen guardado (redondeando al múltiplo de 5 superior inmediato),
+   - **mantener** el precio de salida actual, o
+   - **definir precio de venta** escribiendo directamente el precio final; la interfaz muestra el margen resultante.
+4. Mantener el precio solo se permite si el margen efectivo resultante es menor a 30%; si es negativo se advierte. El precio de venta directo debe ser mayor a `0` y producir un margen menor a `30%`; si queda por debajo del costo se advierte pero se permite.
 5. Al confirmar, en una sola transacción:
    - `last_price = current_price`
    - `current_price = unit_cost`
-   - `sale_price` = precio elegido (recalculado o mantenido)
+   - `margin_percent` = margen guardado, o el margen efectivo del precio de venta directo (`0` si es negativo)
+   - `sale_price` = precio elegido (recalculado, mantenido o definido directamente)
    - `stock = stock + quantity`
    - se guarda la compra con los valores anteriores y nuevos.
 
@@ -127,6 +129,7 @@ Se registran solo: nombre, pesaje/unidad y stock mínimo. Los precios nacen en `
 - Si el múltiplo superior alcanza o supera `30%` de margen efectivo, se usa el múltiplo de 5 inferior más cercano que cumpla la regla.
 - Con margen `0` el precio de salida es el costo redondeado, sin forzar múltiplo de 5.
 - También se puede escribir el precio de salida directamente; la interfaz muestra el margen resultante y lo limita a menos de 30%.
+- Al definir el precio de venta directamente en una compra, el margen efectivo resultante queda guardado en el producto para los siguientes recálculos. Si el margen es negativo se guarda `0`.
 
 ### 4.4 Registrar venta
 
@@ -229,15 +232,16 @@ src/
 ### Módulo 1 — Productos
 
 - CRUD, archivar, búsqueda y filtro de stock bajo.
-- Lista, detalle y formulario de producto.
-- Calculadora de margen y precio de salida.
-- **Criterio:** crear, buscar, editar y archivar productos; margen siempre menor a 30%.
+- Lista, detalle y formulario de datos básicos del producto.
+- El margen y el precio de salida se configuran en la compra, no al crear.
+- **Criterio:** crear, buscar, editar y archivar productos; el margen se define en las compras y siempre queda menor a 30%.
 
 ### Módulo 2 — Compras
 
 - Registro con costo unitario en vivo y vista previa del nuevo precio de salida.
-- Actualización transaccional de stock y precios.
-- **Criterio:** una compra actualiza stock, costo anterior, costo actual y precio de salida.
+- Tres opciones de salida: mantener precio, recalcular con el margen guardado o definir el precio de venta directamente.
+- Actualización transaccional de stock, costos, margen y precio de salida.
+- **Criterio:** una compra actualiza stock, costo anterior, costo actual, margen y precio de salida según la opción elegida.
 
 ### Módulo 3 — Ventas
 
diff --git a/src/app/product/[id]/index.tsx b/src/app/product/[id]/index.tsx
index b381cfe..822cea1 100644
--- a/src/app/product/[id]/index.tsx
+++ b/src/app/product/[id]/index.tsx
@@ -68,8 +68,29 @@ export default function ProductDetailScreen() {
     product.salePrice != null ? product.stock * product.salePrice : null;
 
   const productId = product.id;
+  const stock = product.stock;
+  const unit = product.unit;
 
   function handleArchive() {
+    if (stock > 0) {
+      Alert.alert(
+        "No se puede archivar",
+        `Este producto todavía tiene ${formatQuantity(stock)} ${unit} en stock. Ajusta el stock a cero antes de archivarlo.`,
+        [
+          { text: "Cancelar", style: "cancel" },
+          {
+            text: "Ajustar stock",
+            onPress: () =>
+              router.push({
+                pathname: "/adjustment/new",
+                params: { productId },
+              }),
+          },
+        ],
+      );
+      return;
+    }
+
     Alert.alert(
       "Archivar producto",
       "Dejará de aparecer en el inventario, pero su historial se conserva.",
diff --git a/src/components/movements/purchase-form.tsx b/src/components/movements/purchase-form.tsx
index 8e072ee..7e39b6c 100644
--- a/src/components/movements/purchase-form.tsx
+++ b/src/components/movements/purchase-form.tsx
@@ -46,6 +46,7 @@ interface FormErrors {
   quantity?: string;
   total?: string;
   price?: string;
+  customPrice?: string;
 }
 
 function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
@@ -60,7 +61,7 @@ function SummaryRow({ label, children }: { label: string; children: ReactNode })
 function defaultSalePriceStrategy(product: Product | null): SalePriceStrategy {
   if (product && product.marginPercent > 0) return "margin";
   if (product && product.salePrice != null) return "keep";
-  return "margin";
+  return "custom";
 }
 
 function PriceOption({
@@ -161,6 +162,7 @@ export function PurchaseForm({
   onCancel,
 }: PurchaseFormProps) {
   const insets = useSafeAreaInsets();
+  const palette = usePalette();
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(
     initialProduct ?? null,
   );
@@ -169,33 +171,62 @@ export function PurchaseForm({
   const [salePriceStrategy, setSalePriceStrategy] = useState<SalePriceStrategy>(
     defaultSalePriceStrategy(initialProduct ?? null),
   );
+  const [customPriceInput, setCustomPriceInput] = useState("");
   const [pickerVisible, setPickerVisible] = useState(false);
   const [errors, setErrors] = useState<FormErrors>({});
 
   const quantity = parseQuantityInput(quantityInput);
   const total = parseMoneyInput(totalInput);
+  const customSalePrice = parseMoneyInput(customPriceInput);
   const preview =
     selectedProduct && quantity > 0 && total > 0
-      ? buildPurchasePreview(selectedProduct, quantity, total)
+      ? buildPurchasePreview(selectedProduct, quantity, total, customSalePrice)
       : null;
   const newStock =
     selectedProduct && quantity > 0
       ? roundQuantity(selectedProduct.stock + quantity)
       : null;
-  const hasPriceOptions =
-    preview != null &&
-    (preview.marginSalePrice != null || preview.previousSalePrice != null);
+  const customMargin = preview?.customEffectiveMargin ?? null;
+  const customMarginTone =
+    customMargin == null
+      ? palette.contentMuted
+      : customMargin < 0 || customMargin >= 30
+        ? palette.danger
+        : palette.success;
 
   function handleSelect(product: Product) {
     setSelectedProduct(product);
     setSalePriceStrategy(defaultSalePriceStrategy(product));
-    setErrors((current) => ({ ...current, product: undefined, price: undefined }));
+    setCustomPriceInput("");
+    setErrors((current) => ({
+      ...current,
+      product: undefined,
+      price: undefined,
+      customPrice: undefined,
+    }));
     setPickerVisible(false);
   }
 
   function handlePriceStrategy(strategy: SalePriceStrategy) {
     setSalePriceStrategy(strategy);
-    setErrors((current) => ({ ...current, price: undefined }));
+    setErrors((current) => ({
+      ...current,
+      price: undefined,
+      customPrice: undefined,
+    }));
+
+    if (
+      strategy === "custom" &&
+      customPriceInput.length === 0 &&
+      selectedProduct?.salePrice != null
+    ) {
+      setCustomPriceInput(String(selectedProduct.salePrice));
+    }
+  }
+
+  function handleCustomPriceChange(text: string) {
+    setCustomPriceInput(sanitizeMoneyInput(text));
+    setErrors((current) => ({ ...current, customPrice: undefined }));
   }
 
   function validate(): boolean {
@@ -216,6 +247,13 @@ export function PurchaseForm({
           ? "Este producto no tiene un precio de salida para mantener."
           : "Mantener el precio actual supera el margen máximo del 30%. Recalcula el precio.";
     }
+    if (preview && salePriceStrategy === "custom") {
+      if (customSalePrice <= 0) {
+        next.customPrice = "Ingresa un precio de venta mayor a cero.";
+      } else if (customMargin != null && customMargin >= 30) {
+        next.customPrice = "El margen debe ser menor al 30%.";
+      }
+    }
 
     setErrors(next);
     return Object.keys(next).length === 0;
@@ -229,6 +267,8 @@ export function PurchaseForm({
       quantity,
       total,
       salePriceStrategy,
+      customSalePrice:
+        salePriceStrategy === "custom" ? customSalePrice : undefined,
     });
   }
 
@@ -340,7 +380,7 @@ export function PurchaseForm({
 
             <View className="h-px bg-border" />
 
-            <SummaryRow label="Ganancia definida">
+            <SummaryRow label="Margen guardado">
               <AppText variant="body" className="font-semibold text-accent">
                 {formatPercent(preview.marginPercent)}
               </AppText>
@@ -355,51 +395,86 @@ export function PurchaseForm({
               </AppText>
             </View>
 
-            {hasPriceOptions ? (
-              <View className="gap-2">
-                <PriceOption
-                  title="Recalcular según margen"
-                  description={
-                    preview.marginSalePrice != null
-                      ? `Mantiene el margen definido de ${formatPercent(preview.marginPercent)}.`
-                      : "El producto no tiene un margen mayor a cero."
-                  }
-                  price={preview.marginSalePrice}
-                  margin={preview.marginEffectiveMargin}
-                  selected={salePriceStrategy === "margin"}
-                  disabled={preview.marginSalePrice == null}
-                  onPress={() => handlePriceStrategy("margin")}
-                />
+            <View className="gap-2">
+              <PriceOption
+                title="Recalcular según margen"
+                description={
+                  preview.marginSalePrice != null
+                    ? `Mantiene el margen definido de ${formatPercent(preview.marginPercent)}.`
+                    : "El producto no tiene un margen mayor a cero."
+                }
+                price={preview.marginSalePrice}
+                margin={preview.marginEffectiveMargin}
+                selected={salePriceStrategy === "margin"}
+                disabled={preview.marginSalePrice == null}
+                onPress={() => handlePriceStrategy("margin")}
+              />
+
+              <PriceOption
+                title="Mantener precio actual"
+                description={
+                  preview.previousSalePrice != null
+                    ? "Conserva el precio de salida existente."
+                    : "El producto no tiene un precio de salida actual."
+                }
+                price={preview.previousSalePrice}
+                margin={preview.keptEffectiveMargin}
+                selected={salePriceStrategy === "keep"}
+                disabled={!preview.canKeepPrice}
+                warning={
+                  preview.keptEffectiveMargin != null &&
+                  preview.keptEffectiveMargin < 0
+                    ? "Venderías por debajo del costo."
+                    : preview.keptEffectiveMargin != null &&
+                        preview.keptEffectiveMargin >= 30
+                      ? "Supera el margen máximo del 30%."
+                      : null
+                }
+                onPress={() => handlePriceStrategy("keep")}
+              />
 
-                <PriceOption
-                  title="Mantener precio actual"
-                  description={
-                    preview.previousSalePrice != null
-                      ? "Conserva el precio de salida existente."
-                      : "El producto no tiene un precio de salida actual."
-                  }
-                  price={preview.previousSalePrice}
-                  margin={preview.keptEffectiveMargin}
-                  selected={salePriceStrategy === "keep"}
-                  disabled={!preview.canKeepPrice}
-                  warning={
-                    preview.keptEffectiveMargin != null &&
-                    preview.keptEffectiveMargin < 0
-                      ? "Venderías por debajo del costo."
-                      : preview.keptEffectiveMargin != null &&
-                          preview.keptEffectiveMargin >= 30
-                        ? "Supera el margen máximo del 30%."
-                        : null
-                  }
-                  onPress={() => handlePriceStrategy("keep")}
+              <PriceOption
+                title="Definir precio de venta"
+                description="Escribe el precio final; el margen se calcula automáticamente."
+                price={preview.customSalePrice}
+                margin={preview.customEffectiveMargin}
+                selected={salePriceStrategy === "custom"}
+                disabled={preview.newCost <= 0}
+                warning={
+                  preview.customEffectiveMargin != null &&
+                  preview.customEffectiveMargin < 0
+                    ? "Venderías por debajo del costo."
+                    : preview.customEffectiveMargin != null &&
+                        preview.customEffectiveMargin >= 30
+                      ? "Supera el margen máximo del 30%."
+                      : null
+                }
+                onPress={() => handlePriceStrategy("custom")}
+              />
+            </View>
+
+            {salePriceStrategy === "custom" ? (
+              <View className="gap-2 rounded-xl border border-border bg-background p-3">
+                <TextField
+                  label="Precio de venta"
+                  value={customPriceInput}
+                  onChangeText={handleCustomPriceChange}
+                  keyboardType="number-pad"
+                  placeholder="Ej. 15000"
+                  hint="El margen se calcula automáticamente."
+                  error={errors.customPrice}
                 />
+                <View className="flex-row items-center justify-between gap-3">
+                  <AppText variant="muted">Margen resultante</AppText>
+                  <AppText
+                    className="font-semibold"
+                    style={{ color: customMarginTone }}
+                  >
+                    {formatPercent(customMargin)}
+                  </AppText>
+                </View>
               </View>
-            ) : (
-              <AppText variant="muted">
-                Este producto no tiene margen ni precio de salida configurado. La
-                compra solo actualizará el costo y el stock.
-              </AppText>
-            )}
+            ) : null}
 
             {errors.price ? (
               <AppText variant="caption" className="text-danger">
diff --git a/src/components/products/product-form.tsx b/src/components/products/product-form.tsx
index 31ccf16..cc41a09 100644
--- a/src/components/products/product-form.tsx
+++ b/src/components/products/product-form.tsx
@@ -1,11 +1,3 @@
-import { useState } from "react";
-import {
-  KeyboardAvoidingView,
-  Platform,
-  ScrollView,
-  View,
-} from "react-native";
-import { useSafeAreaInsets } from "react-native-safe-area-context";
 import { AppText, Badge, Button, Card, MoneyText, TextField } from "@/components/ui";
 import type { UpdateProductInput } from "@/database/repositories/products.repository";
 import type { Product } from "@/database/types";
@@ -19,6 +11,14 @@ import {
 } from "@/database/utils/money";
 import { formatQuantity, parseQuantityInput } from "@/database/utils/quantity";
 import { sanitizeDecimalInput, sanitizeMoneyInput } from "@/utils/input";
+import { useState } from "react";
+import {
+  KeyboardAvoidingView,
+  Platform,
+  ScrollView,
+  View,
+} from "react-native";
+import { useSafeAreaInsets } from "react-native-safe-area-context";
 
 interface ProductFormProps {
   mode: "create" | "edit";
@@ -60,6 +60,7 @@ export function ProductForm({
   const insets = useSafeAreaInsets();
   const cost = product?.currentPrice ?? null;
   const hasCost = cost != null && cost > 0;
+  const showPricing = mode === "edit" && hasCost;
 
   const [name, setName] = useState(product?.name ?? "");
   const [unit, setUnit] = useState(product?.unit ?? "");
@@ -157,16 +158,18 @@ export function ProductForm({
     if (parseQuantityInput(minStock) < 0) {
       next.minStock = "El stock mínimo no puede ser negativo.";
     }
-    if (rawMargin < 0 || rawMargin >= 30) {
-      next.margin = "El margen debe estar entre 0% y 29,9%.";
-    }
-    if (cost != null && cost > 0) {
-      if (!salePrice || salePriceValue <= 0) {
-        next.salePrice = "Define el precio de salida.";
-      } else if (salePriceValue < cost) {
-        next.salePrice = "El precio no puede ser menor al costo.";
-      } else if (effectiveMargin(cost, salePriceValue) >= 30) {
-        next.salePrice = "El margen debe ser menor a 30%.";
+    if (showPricing) {
+      if (rawMargin < 0 || rawMargin >= 30) {
+        next.margin = "El margen debe estar entre 0% y 29,9%.";
+      }
+      if (cost != null && cost > 0) {
+        if (!salePrice || salePriceValue <= 0) {
+          next.salePrice = "Define el precio de salida.";
+        } else if (salePriceValue < cost) {
+          next.salePrice = "El precio no puede ser menor al costo.";
+        } else if (effectiveMargin(cost, salePriceValue) >= 30) {
+          next.salePrice = "El margen debe ser menor a 30%.";
+        }
       }
     }
 
@@ -181,8 +184,8 @@ export function ProductForm({
       name: name.trim(),
       unit: unit.trim(),
       minStock: Math.max(0, parseQuantityInput(minStock)),
-      marginPercent: marginValue,
-      salePrice: cost != null && cost > 0 ? salePriceValue : undefined,
+      marginPercent: showPricing ? marginValue : (product?.marginPercent ?? 0),
+      salePrice: showPricing ? salePriceValue : undefined,
     });
   }
 
@@ -227,59 +230,59 @@ export function ProductForm({
             value={minStock}
             onChangeText={(text) => setMinStock(sanitizeDecimalInput(text))}
             keyboardType="decimal-pad"
-            hint="Se muestra una alerta cuando el stock llegue a este valor. 0 = sin alerta."
+            hint="Se muestra una alerta cuando el stock llegue a este valor."
             error={errors.minStock}
           />
-        </Card>
-
-        <Card className="gap-4">
-          <View className="flex-row items-center justify-between gap-3">
-            <AppText variant="title">Ganancia</AppText>
-            <Badge tone="accent" label={formatPercent(marginValue)} />
-          </View>
-
-          <TextField
-            label="Ganancia (%)"
-            value={margin}
-            onChangeText={handleMarginChange}
-            keyboardType="decimal-pad"
-            hint={`Máximo ${formatPercent(MAX_MARGIN_PERCENT)} por ley.`}
-            error={errors.margin}
-          />
-
-          {hasCost ? (
-            <>
-              <TextField
-                label="Precio de salida"
-                value={salePrice}
-                onChangeText={handleSalePriceChange}
-                onBlur={handleSalePriceBlur}
-                keyboardType="number-pad"
-                error={errors.salePrice}
-              />
 
-              <View className="gap-2 rounded-xl bg-background p-3">
-                <AppText variant="caption">Vista previa</AppText>
-                <SummaryRow label="Costo actual" value={cost} />
-                <SummaryRow
-                  label="Precio de venta"
-                  value={salePriceValue > 0 ? salePriceValue : computedPrice}
-                />
-                <View className="flex-row items-center justify-between gap-3">
-                  <AppText variant="muted">Margen efectivo</AppText>
-                  <AppText variant="body" className="font-semibold text-success">
-                    {formatPercent(effective ?? 0)}
-                  </AppText>
-                </View>
-              </View>
-            </>
-          ) : (
+          {!showPricing ? (
             <AppText variant="muted">
-              El costo y el precio de salida se definen al registrar la primera
-              compra. Puedes dejar el margen configurado desde ahora.
+              El costo, el margen y el precio de salida se definen al registrar
+              la primera compra.
             </AppText>
-          )}
+          ) : null}
         </Card>
+
+        {showPricing ? (
+          <Card className="gap-4">
+            <View className="flex-row items-center justify-between gap-3">
+              <AppText variant="title">Ganancia</AppText>
+              <Badge tone="accent" label={formatPercent(marginValue)} />
+            </View>
+
+            <TextField
+              label="Ganancia (%)"
+              value={margin}
+              onChangeText={handleMarginChange}
+              keyboardType="decimal-pad"
+              hint={`Máximo ${formatPercent(MAX_MARGIN_PERCENT)} por ley.`}
+              error={errors.margin}
+            />
+
+            <TextField
+              label="Precio de salida"
+              value={salePrice}
+              onChangeText={handleSalePriceChange}
+              onBlur={handleSalePriceBlur}
+              keyboardType="number-pad"
+              error={errors.salePrice}
+            />
+
+            <View className="gap-2 rounded-xl bg-background p-3">
+              <AppText variant="caption">Vista previa</AppText>
+              <SummaryRow label="Costo actual" value={cost} />
+              <SummaryRow
+                label="Precio de venta"
+                value={salePriceValue > 0 ? salePriceValue : computedPrice}
+              />
+              <View className="flex-row items-center justify-between gap-3">
+                <AppText variant="muted">Margen efectivo</AppText>
+                <AppText variant="body" className="font-semibold text-success">
+                  {formatPercent(effective ?? 0)}
+                </AppText>
+              </View>
+            </View>
+          </Card>
+        ) : null}
       </ScrollView>
 
       <View
diff --git a/src/components/products/product-row.tsx b/src/components/products/product-row.tsx
index eccbe0c..345eef1 100644
--- a/src/components/products/product-row.tsx
+++ b/src/components/products/product-row.tsx
@@ -25,31 +25,56 @@ export function ProductRow({
     >
       <Card
         className={cn(
-          "gap-3",
+          "gap-4",
           isLowStock && "border-danger-border bg-danger-soft",
         )}
       >
-        <View className="flex-row items-start justify-between gap-3">
-          <View className="flex-1 gap-1">
-            <AppText variant="body" className="font-semibold">
+        <View className="flex-row items-start justify-between gap-4">
+          <View className="flex-1 gap-2">
+            <AppText
+              variant="body"
+              className="text-[18px] leading-6 font-semibold"
+              numberOfLines={2}
+            >
               {product.name}
             </AppText>
             <AppText
               variant="caption"
               className={isLowStock ? "text-danger" : undefined}
             >
-              {formatQuantity(product.stock)} {product.unit} · mínimo{" "}
-              {formatQuantity(product.minStock)}
+              Mínimo {formatQuantity(product.minStock)} {product.unit}
+            </AppText>
+            {isLowStock ? (
+              <Badge tone="danger" label="Stock bajo" className="self-start" />
+            ) : null}
+          </View>
+
+          <View className="max-w-[45%] items-end">
+            <AppText variant="eyebrow" className="text-content-muted">
+              Stock
+            </AppText>
+            <AppText
+              className="text-[30px] leading-[34px] font-extrabold"
+              style={{
+                color: isLowStock ? palette.danger : palette.content,
+                fontVariant: ["tabular-nums"],
+              }}
+              numberOfLines={1}
+              adjustsFontSizeToFit
+              minimumFontScale={0.7}
+            >
+              {formatQuantity(product.stock)}
+            </AppText>
+            <AppText
+              variant="caption"
+              className={isLowStock ? "text-danger" : undefined}
+            >
+              {product.unit}
             </AppText>
           </View>
-          {isLowStock ? (
-            <Badge tone="danger" label="Stock bajo" />
-          ) : (
-            <Badge tone="neutral" label={product.unit} />
-          )}
         </View>
 
-        <View className="flex-row items-end justify-between gap-3">
+        <View className="flex-row items-end justify-between gap-3 border-t border-border pt-3">
           <View className="gap-0.5">
             <AppText variant="caption">Costo</AppText>
             <MoneyText value={product.currentPrice} />
diff --git a/src/database/repositories/products.repository.ts b/src/database/repositories/products.repository.ts
index cca8b9b..54ea198 100644
--- a/src/database/repositories/products.repository.ts
+++ b/src/database/repositories/products.repository.ts
@@ -196,6 +196,16 @@ export async function archiveProduct(
   db: SQLiteDatabase,
   id: string,
 ): Promise<void> {
+  const product = await getProduct(db, id);
+  if (!product || product.archivedAt != null) {
+    throw new Error("Producto no encontrado o ya archivado.");
+  }
+  if (product.stock > 0) {
+    throw new Error(
+      "No puedes archivar un producto con stock. Ajusta el stock a cero primero.",
+    );
+  }
+
   const now = Date.now();
   await db.runAsync(
     "UPDATE products SET archived_at = ?, updated_at = ? WHERE id = ? AND archived_at IS NULL",
diff --git a/src/database/repositories/purchases.repository.ts b/src/database/repositories/purchases.repository.ts
index b10c572..c38966f 100644
--- a/src/database/repositories/purchases.repository.ts
+++ b/src/database/repositories/purchases.repository.ts
@@ -12,13 +12,14 @@ import {
   type ProductRow,
 } from "./products.repository";
 
-export type SalePriceStrategy = "margin" | "keep";
+export type SalePriceStrategy = "margin" | "keep" | "custom";
 
 export interface PurchaseInput {
   productId: string;
   quantity: number;
   total: number;
   salePriceStrategy: SalePriceStrategy;
+  customSalePrice?: number;
 }
 
 export interface PurchasePreview {
@@ -33,6 +34,8 @@ export interface PurchasePreview {
   marginSalePrice: number | null;
   marginEffectiveMargin: number | null;
   keptEffectiveMargin: number | null;
+  customSalePrice: number | null;
+  customEffectiveMargin: number | null;
   canKeepPrice: boolean;
 }
 
@@ -77,6 +80,7 @@ export function buildPurchasePreview(
   product: Product,
   quantity: number,
   total: number,
+  customSalePrice?: number,
 ): PurchasePreview {
   const safeQuantity = roundQuantity(quantity);
   const safeTotal = roundMoney(total);
@@ -90,6 +94,14 @@ export function buildPurchasePreview(
     unitCost > 0 && product.salePrice != null && product.salePrice >= 0
       ? effectiveMargin(unitCost, product.salePrice)
       : null;
+  const safeCustomSalePrice =
+    customSalePrice != null && customSalePrice > 0
+      ? roundMoney(customSalePrice)
+      : null;
+  const customEffectiveMargin =
+    safeCustomSalePrice != null && unitCost > 0
+      ? effectiveMargin(unitCost, safeCustomSalePrice)
+      : null;
 
   return {
     product,
@@ -106,6 +118,8 @@ export function buildPurchasePreview(
         ? effectiveMargin(unitCost, marginSalePrice)
         : null,
     keptEffectiveMargin,
+    customSalePrice: safeCustomSalePrice,
+    customEffectiveMargin,
     canKeepPrice:
       keptEffectiveMargin != null && keptEffectiveMargin < 30,
   };
@@ -164,6 +178,8 @@ export async function registerPurchase(
     }
 
     let newSalePrice: number | null;
+    let newMarginPercent = product.marginPercent;
+
     if (input.salePriceStrategy === "keep") {
       if (product.salePrice == null) {
         throw new Error("El producto no tiene un precio de salida para mantener.");
@@ -174,6 +190,20 @@ export async function registerPurchase(
         );
       }
       newSalePrice = product.salePrice;
+    } else if (input.salePriceStrategy === "custom") {
+      const customSalePrice = roundMoney(input.customSalePrice ?? 0);
+      if (customSalePrice <= 0) {
+        throw new Error("Ingresa un precio de venta mayor a cero.");
+      }
+
+      const customMargin = effectiveMargin(unitCost, customSalePrice);
+      if (customMargin >= 30) {
+        throw new Error("El margen debe ser menor al 30%.");
+      }
+
+      newSalePrice = customSalePrice;
+      newMarginPercent =
+        customMargin > 0 ? Math.floor(customMargin * 100) / 100 : 0;
     } else {
       newSalePrice =
         product.marginPercent > 0
@@ -208,10 +238,11 @@ export async function registerPurchase(
        SET last_price = current_price,
            current_price = ?,
            sale_price = ?,
+           margin_percent = ?,
            stock = ?,
            updated_at = ?
        WHERE id = ?`,
-      [unitCost, newSalePrice, newStock, now, product.id],
+      [unitCost, newSalePrice, newMarginPercent, newStock, now, product.id],
     );
 
     created = {

```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/product/[id]/index.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/product/[id]/index.tsx</path>
<type>file</type>
<content>
1: import { Stack, useLocalSearchParams, useRouter } from "expo-router";
2: import { useSQLiteContext } from "expo-sqlite";
3: import { ActivityIndicator, Alert, View } from "react-native";
4: import {
5:   AppText,
6:   Badge,
7:   Button,
8:   Card,
9:   EmptyState,
10:   MoneyText,
11:   Screen,
12: } from "@/components/ui";
13: import { useDataRevision } from "@/database/data-context";
14: import { archiveProduct } from "@/database/repositories/products.repository";
15: import { effectiveMargin, formatPercent } from "@/database/utils/money";
16: import { formatQuantity } from "@/database/utils/quantity";
17: import { useProduct } from "@/hooks/use-products";
18: import { usePalette } from "@/theme/colors";
19: 
20: function SummaryRow({ label, value }: { label: string; value: number | null }) {
21:   return (
22:     <View className="flex-row items-center justify-between gap-3">
23:       <AppText variant="muted">{label}</AppText>
24:       <MoneyText value={value} />
25:     </View>
26:   );
27: }
28: 
29: export default function ProductDetailScreen() {
30:   const params = useLocalSearchParams<{ id: string }>();
31:   const router = useRouter();
32:   const db = useSQLiteContext();
33:   const { refresh } = useDataRevision();
34:   const palette = usePalette();
35:   const { product, loading, error } = useProduct(params.id);
36: 
37:   if (loading) {
38:     return (
39:       <View className="flex-1 items-center justify-center bg-background">
40:         <ActivityIndicator color={palette.accent} />
41:       </View>
42:     );
43:   }
44: 
45:   if (!product) {
46:     return (
47:       <Screen>
48:         <EmptyState
49:           icon="package-variant"
50:           title="Producto no encontrado"
51:           description={error ?? "Puede que haya sido archivado."}
52:           action={
53:             <Button label="Volver" variant="outline" onPress={() => router.back()} />
54:           }
55:         />
56:       </Screen>
57:     );
58:   }
59: 
60:   const isLowStock = product.minStock > 0 && product.stock <= product.minStock;
61:   const margin =
62:     product.currentPrice != null && product.salePrice != null
63:       ? effectiveMargin(product.currentPrice, product.salePrice)
64:       : null;
65:   const costValue =
66:     product.currentPrice != null ? product.stock * product.currentPrice : null;
67:   const saleValue =
68:     product.salePrice != null ? product.stock * product.salePrice : null;
69: 
70:   const productId = product.id;
71:   const stock = product.stock;
72:   const unit = product.unit;
73: 
74:   function handleArchive() {
75:     if (stock > 0) {
76:       Alert.alert(
77:         "No se puede archivar",
78:         `Este producto todavía tiene ${formatQuantity(stock)} ${unit} en stock. Ajusta el stock a cero antes de archivarlo.`,
79:         [
80:           { text: "Cancelar", style: "cancel" },
81:           {
82:             text: "Ajustar stock",
83:             onPress: () =>
84:               router.push({
85:                 pathname: "/adjustment/new",
86:                 params: { productId },
87:               }),
88:           },
89:         ],
90:       );
91:       return;
92:     }
93: 
94:     Alert.alert(
95:       "Archivar producto",
96:       "Dejará de aparecer en el inventario, pero su historial se conserva.",
97:       [
98:         { text: "Cancelar", style: "cancel" },
99:         {
100:           text: "Archivar",
101:           style: "destructive",
102:           onPress: async () => {
103:             try {
104:               await archiveProduct(db, productId);
105:               refresh();
106:               router.back();
107:             } catch (cause) {
108:               Alert.alert(
109:                 "No se pudo archivar",
110:                 cause instanceof Error ? cause.message : "Intenta de nuevo.",
111:               );
112:             }
113:           },
114:         },
115:       ],
116:     );
117:   }
118: 
119:   return (
120:     <>
121:       <Stack.Screen options={{ title: product.name }} />
122:       <Screen>
123:         <Card className="gap-4">
124:           <View className="flex-row items-start justify-between gap-3">
125:             <View className="flex-1 gap-1">
126:               <AppText variant="hero">{product.name}</AppText>
127:               <AppText variant="muted">Unidad: {product.unit}</AppText>
128:             </View>
129:             {isLowStock ? (
130:               <Badge tone="warning" label="Stock bajo" />
131:             ) : (
132:               <Badge tone="success" label="Disponible" />
133:             )}
134:           </View>
135: 
136:           <View className="flex-row gap-3">
137:             <View className="flex-1 gap-0.5 rounded-xl bg-background p-3">
138:               <AppText variant="caption">Stock actual</AppText>
139:               <AppText variant="metric" style={{ fontVariant: ["tabular-nums"] }}>
140:                 {formatQuantity(product.stock)}
141:               </AppText>
142:               <AppText variant="caption">{product.unit}</AppText>
143:             </View>
144:             <View className="flex-1 gap-0.5 rounded-xl bg-background p-3">
145:               <AppText variant="caption">Stock mínimo</AppText>
146:               <AppText variant="metric" style={{ fontVariant: ["tabular-nums"] }}>
147:                 {formatQuantity(product.minStock)}
148:               </AppText>
149:               <AppText variant="caption">
150:                 {product.minStock > 0 ? "Alerta activa" : "Sin alerta"}
151:               </AppText>
152:             </View>
153:           </View>
154:         </Card>
155: 
156:         <Card className="gap-3">
157:           <AppText variant="title">Precios</AppText>
158:           {product.currentPrice == null ? (
159:             <AppText variant="muted">
160:               El precio se define al registrar la primera compra.
161:             </AppText>
162:           ) : (
163:             <>
164:               <SummaryRow label="Costo actual" value={product.currentPrice} />
165:               <SummaryRow label="Último costo" value={product.lastPrice} />
166:               <SummaryRow label="Precio de venta" value={product.salePrice} />
167:               <View className="flex-row items-center justify-between gap-3">
168:                 <AppText variant="muted">Margen efectivo</AppText>
169:                 <AppText variant="body" className="font-semibold text-success">
170:                   {formatPercent(margin)}
171:                 </AppText>
172:               </View>
173:             </>
174:           )}
175:         </Card>
176: 
177:         <Card className="gap-3">
178:           <AppText variant="title">Valor en stock</AppText>
179:           <SummaryRow label="A costo" value={costValue} />
180:           <SummaryRow label="A venta" value={saleValue} />
181:         </Card>
182: 
183:         <View className="gap-3">
184:           <Button
185:             label="Registrar venta"
186:             onPress={() =>
187:               router.push({
188:                 pathname: "/sale/new",
189:                 params: { productId: productId },
190:               })
191:             }
192:           />
193:           <Button
194:             label="Registrar compra"
195:             variant="secondary"
196:             onPress={() =>
197:               router.push({
198:                 pathname: "/purchase/new",
199:                 params: { productId: productId },
200:               })
201:             }
202:           />
203:           <Button
204:             label="Ajustar stock"
205:             variant="outline"
206:             onPress={() =>
207:               router.push({
208:                 pathname: "/adjustment/new",
209:                 params: { productId: productId },
210:               })
211:             }
212:           />
213:           <Button
214:             label="Editar producto"
215:             variant="secondary"
216:             onPress={() =>
217:               router.push({
218:                 pathname: "/product/[id]/edit",
219:                 params: { id: product.id },
220:               })
221:             }
222:           />
223:           <Button label="Archivar producto" variant="outline" onPress={handleArchive} />
224:         </View>
225:       </Screen>
226:     </>
227:   );
228: }

(End of file - total 228 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/history/[type]/[id].tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/history/[type]/[id].tsx</path>
<type>file</type>
<content>
1: import { Stack, useLocalSearchParams, useRouter } from "expo-router";
2: import { useSQLiteContext } from "expo-sqlite";
3: import { useEffect, useState, type ReactNode } from "react";
4: import { ActivityIndicator, View } from "react-native";
5: import {
6:   AppText,
7:   Badge,
8:   Button,
9:   Card,
10:   EmptyState,
11:   MoneyText,
12:   Screen,
13: } from "@/components/ui";
14: import {
15:   getHistoryDetail,
16:   isHistoryType,
17:   type HistoryDetail,
18: } from "@/database/repositories/history.repository";
19: import { formatDateTime } from "@/database/utils/dates";
20: import { formatPercent, roundMoney } from "@/database/utils/money";
21: import { formatQuantity } from "@/database/utils/quantity";
22: import { usePalette } from "@/theme/colors";
23: import { cn } from "@/utils/cn";
24: 
25: function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
26:   return (
27:     <View className="flex-row items-center justify-between gap-3">
28:       <AppText variant="muted">{label}</AppText>
29:       {children}
30:     </View>
31:   );
32: }
33: 
34: function formatDelta(value: number): string {
35:   if (value === 0) return formatQuantity(0);
36:   const formatted = formatQuantity(Math.abs(value));
37:   return value > 0 ? `+${formatted}` : `-${formatted}`;
38: }
39: 
40: export default function HistoryDetailScreen() {
41:   const params = useLocalSearchParams<{ type?: string; id?: string }>();
42:   const router = useRouter();
43:   const db = useSQLiteContext();
44:   const palette = usePalette();
45:   const type = params.type;
46:   const id = params.id;
47: 
48:   const [detail, setDetail] = useState<HistoryDetail | null>(null);
49:   const [loading, setLoading] = useState(
50:     isHistoryType(type) && Boolean(id),
51:   );
52:   const [error, setError] = useState<string | null>(null);
53: 
54:   useEffect(() => {
55:     if (!isHistoryType(type) || !id) return;
56: 
57:     let active = true;
58: 
59:     getHistoryDetail(db, type, id)
60:       .then((row) => {
61:         if (!active) return;
62:         setDetail(row);
63:         setError(null);
64:       })
65:       .catch((cause: unknown) => {
66:         if (!active) return;
67:         setError(
68:           cause instanceof Error
69:             ? cause.message
70:             : "No se pudo cargar el movimiento.",
71:         );
72:       })
73:       .finally(() => {
74:         if (active) setLoading(false);
75:       });
76: 
77:     return () => {
78:       active = false;
79:     };
80:   }, [db, id, type]);
81: 
82:   if (loading) {
83:     return (
84:       <>
85:         <Stack.Screen options={{ title: "Detalle" }} />
86:         <View className="flex-1 items-center justify-center bg-background">
87:           <ActivityIndicator color={palette.accent} />
88:         </View>
89:       </>
90:     );
91:   }
92: 
93:   if (!detail) {
94:     return (
95:       <>
96:         <Stack.Screen options={{ title: "Detalle" }} />
97:         <Screen>
98:           <EmptyState
99:             icon="history"
100:             title="Movimiento no encontrado"
101:             description={error ?? "Puede que ya no esté disponible."}
102:             action={
103:               <Button
104:                 label="Volver"
105:                 variant="outline"
106:                 onPress={() => router.back()}
107:               />
108:             }
109:           />
110:         </Screen>
111:       </>
112:     );
113:   }
114: 
115:   const isAdjustment = detail.kind === "adjustment";
116:   const isRemoval = isAdjustment && detail.quantityDelta < 0;
117:   const label = isAdjustment
118:     ? "Ajuste"
119:     : detail.kind === "purchase"
120:       ? "Compra"
121:       : "Venta";
122:   const cardTone = isAdjustment
123:     ? isRemoval
124:       ? "border-danger-border bg-danger-soft"
125:       : "border-success/25 bg-success/10"
126:     : detail.kind === "purchase"
127:       ? "border-warning/25 bg-warning/10"
128:       : "border-success/25 bg-success/10";
129:   const badgeTone = isAdjustment
130:     ? isRemoval
131:       ? "danger"
132:       : "success"
133:     : detail.kind === "purchase"
134:       ? "warning"
135:       : "success";
136:   const deltaColor = isRemoval ? palette.danger : palette.success;
137: 
138:   return (
139:     <>
140:       <Stack.Screen options={{ title: label }} />
141:       <Screen>
142:         <Card className={cn("gap-3", cardTone)}>
143:           <View className="flex-row items-start justify-between gap-3">
144:             <View className="flex-1 gap-1">
145:               <AppText variant="title">{detail.productName}</AppText>
146:               <AppText variant="muted">{formatDateTime(detail.createdAt)}</AppText>
147:             </View>
148:             <Badge tone={badgeTone} label={label} />
149:           </View>
150:           <AppText variant="caption">
151:             Precios y cantidades congelados al momento del movimiento.
152:           </AppText>
153:         </Card>
154: 
155:         {detail.kind === "purchase" ? (
156:           <>
157:             <Card className="gap-3">
158:               <AppText variant="title">Compra</AppText>
159:               <SummaryRow label="Cantidad">
160:                 <AppText variant="body" className="font-semibold">
161:                   {formatQuantity(detail.quantity)} {detail.productUnit}
162:                 </AppText>
163:               </SummaryRow>
164:               <SummaryRow label="Costo unitario">
165:                 <MoneyText value={detail.unitCost} className="font-semibold" />
166:               </SummaryRow>
167:               <SummaryRow label="Total pagado">
168:                 <MoneyText value={detail.total} className="font-semibold" />
169:               </SummaryRow>
170:             </Card>
171: 
172:             <Card className="gap-3">
173:               <AppText variant="title">Cambios de precio</AppText>
174:               <SummaryRow label="Costo anterior">
175:                 <MoneyText value={detail.previousCost} />
176:               </SummaryRow>
177:               <SummaryRow label="Costo nuevo">
178:                 <MoneyText value={detail.newCost} className="font-semibold" />
179:               </SummaryRow>
180:               <SummaryRow label="Salida anterior">
181:                 <MoneyText value={detail.previousSalePrice} />
182:               </SummaryRow>
183:               <SummaryRow label="Salida nueva">
184:                 <MoneyText
185:                   value={detail.newSalePrice}
186:                   className="font-semibold"
187:                 />
188:               </SummaryRow>
189:             </Card>
190:           </>
191:         ) : null}
192: 
193:         {detail.kind === "sale" ? (
194:           <>
195:             <Card className="gap-3">
196:               <AppText variant="title">Venta</AppText>
197:               <SummaryRow label="Cantidad">
198:                 <AppText variant="body" className="font-semibold">
199:                   {formatQuantity(detail.quantity)} {detail.productUnit}
200:                 </AppText>
201:               </SummaryRow>
202:               <SummaryRow label="Precio unitario">
203:                 <MoneyText value={detail.unitPrice} className="font-semibold" />
204:               </SummaryRow>
205:               <SummaryRow label="Total">
206:                 <MoneyText value={detail.total} className="font-semibold" />
207:               </SummaryRow>
208:             </Card>
209: 
210:             <Card className="gap-3">
211:               <AppText variant="title">Ganancia</AppText>
212:               <SummaryRow label="Costo congelado">
213:                 <MoneyText value={detail.costPrice} />
214:               </SummaryRow>
215:               <SummaryRow label="Margen congelado">
216:                 <AppText variant="body" className="font-semibold">
217:                   {formatPercent(detail.marginPercent)}
218:                 </AppText>
219:               </SummaryRow>
220:               <SummaryRow label="Ganancia">
221:                 <MoneyText
222:                   value={
223:                     detail.costPrice != null
224:                       ? roundMoney(
225:                           detail.quantity *
226:                             (detail.unitPrice - detail.costPrice),
227:                         )
228:                       : null
229:                   }
230:                   className="font-semibold"
231:                   style={{
232:                     color:
233:                       detail.costPrice == null
234:                         ? palette.contentMuted
235:                         : detail.unitPrice < detail.costPrice
236:                           ? palette.danger
237:                           : palette.success,
238:                   }}
239:                 />
240:               </SummaryRow>
241:             </Card>
242:           </>
243:         ) : null}
244: 
245:         {detail.kind === "adjustment" ? (
246:           <Card className="gap-3">
247:             <AppText variant="title">Ajuste</AppText>
248:             <SummaryRow label="Cantidad ajustada">
249:               <AppText
250:                 variant="body"
251:                 className="font-semibold"
252:                 style={{ color: deltaColor }}
253:               >
254:                 {formatDelta(detail.quantityDelta)} {detail.productUnit}
255:               </AppText>
256:             </SummaryRow>
257:             <SummaryRow label="Stock antes">
258:               <AppText variant="body">
259:                 {formatQuantity(detail.stockBefore)} {detail.productUnit}
260:               </AppText>
261:             </SummaryRow>
262:             <SummaryRow label="Stock después">
263:               <AppText variant="body" className="font-semibold">
264:                 {formatQuantity(detail.stockAfter)} {detail.productUnit}
265:               </AppText>
266:             </SummaryRow>
267:             <SummaryRow label="Costo congelado">
268:               <MoneyText value={detail.unitCost} />
269:             </SummaryRow>
270:             <View className="gap-1">
271:               <AppText variant="muted">Motivo</AppText>
272:               <AppText>{detail.reason ?? "Sin motivo registrado."}</AppText>
273:             </View>
274:           </Card>
275:         ) : null}
276:       </Screen>
277:     </>
278:   );
279: }

(End of file - total 279 lines)
</content>
```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 36.4s)

_Thinking:_

Now I understand the app well. The user wants to change the business model: client doesn't need to register sales manually; instead objective is inventory. Every Sunday he counts stock, verifies remaining merchandise, wants to adjust stock to the counted amount, and the difference vs the previous total is recorded as a sale.

So the key feature: a "conteo semanal / inventario" flow where he enters counted stock per product; the app computes delta = counted - stock_before; if counted < stock, the decrease is recorded as a sale (venta) automatically (at sale_price, freezing price), and if counted > stock, record an adjustment (entrada) or purchase? The user says "la diferencia con el total anterior es lo que se registra como venta". So only negative differences are sales. Positive differences (found more than expected) probably should be adjustments (entrada) not sales. Need clarification.

Let me think about what design/product decisions need clarifying:

1. Should there be a "session" concept (weekly count / inventory count)? He counts all products in one session, maybe review and confirm all at once. Would be nicer: "Conteo de inventario" screen listing all products with expected stock and input for counted stock, then confirm → each product with difference creates movement. This is a big feature.

2. What to do when counted > stock (surplus)? Options: adjustment entry (not a sale), or ignore, or record as adjustment with reason "sobrante".

3. Sale pricing: sales generated from count difference should have a price. At sale_price (precio de salida) to compute total, presumably. But he doesn't need sales revenue? Yet stats show value. Could be optional — record difference as sale using current sale_price to keep history/revenue. Need clarify whether "venta" should compute money or just quantity.

4. Should manual sale registration be removed entirely from UI (sales tab/form), or kept hidden? The user says "mi cliente no necesita registrar ventas". Likely remove the sales flow from UI and replace with the count flow. But sale records remain for history/difference.

5. Should purchases remain? Yes, likely, because he stocks merchandise. Actually the objective is inventory — he probably still registers purchases/entradas. Hmm. He counts remaining and difference is sale. But how does stock get added? Purchases. The guide says purchases update stock. If he doesn't use purchases, then stock only changes via counts. The user says "su objetivo es hacer inventario". I should ask whether purchases remain.

6. Historical data: existing sales/movements preserved.

7. Guide.md must be updated first (per AGENTS.md).

Let me also check the components for product picker and hooks to know the shape of count interface. Also the README maybe. Let me read use-products, product-picker, product-form, products repository quickly, and maybe input utils.

Actually I have enough architecture. But important: check whether there is any existing "count" session concept. No, adjustments has per-product "count" mode but via product picker one at a time. The desired flow is a weekly full count.

Let me read products.repository.ts and hooks to understand query capabilities, plus data-context and the purchase form to see existing patterns. Also check `src/app/purchase/new.tsx`.

Also check what "total anterior" means - previous total of stock. The difference = previous stock (system) - counted = units sold.

Let me read remaining relevant files.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/repositories/products.repository.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/repositories/products.repository.ts</path>
<type>file</type>
<content>
1: import type { SQLiteDatabase } from "expo-sqlite";
2: import type { Product } from "../types";
3: import { createId } from "../utils/ids";
4: import {
5:   calculateSalePrice,
6:   clampMargin,
7:   effectiveMargin,
8:   roundMoney,
9: } from "../utils/money";
10: import { roundQuantity } from "../utils/quantity";
11: 
12: export interface ProductInput {
13:   name: string;
14:   unit: string;
15:   minStock: number;
16:   marginPercent: number;
17: }
18: 
19: export interface UpdateProductInput extends ProductInput {
20:   salePrice?: number | null;
21: }
22: 
23: export interface ProductRow {
24:   id: string;
25:   name: string;
26:   unit: string;
27:   stock: number;
28:   min_stock: number;
29:   last_price: number | null;
30:   current_price: number | null;
31:   sale_price: number | null;
32:   margin_percent: number;
33:   created_at: number;
34:   updated_at: number;
35:   archived_at: number | null;
36: }
37: 
38: export function mapProductRow(row: ProductRow): Product {
39:   return {
40:     id: row.id,
41:     name: row.name,
42:     unit: row.unit,
43:     stock: row.stock,
44:     minStock: row.min_stock,
45:     lastPrice: row.last_price,
46:     currentPrice: row.current_price,
47:     salePrice: row.sale_price,
48:     marginPercent: row.margin_percent,
49:     createdAt: row.created_at,
50:     updatedAt: row.updated_at,
51:     archivedAt: row.archived_at,
52:   };
53: }
54: 
55: export async function listProducts(
56:   db: SQLiteDatabase,
57:   options: {
58:     search?: string;
59:     lowStockOnly?: boolean;
60:     includeArchived?: boolean;
61:   } = {},
62: ): Promise<Product[]> {
63:   const clauses: string[] = [];
64:   const params: (string | number)[] = [];
65: 
66:   if (!options.includeArchived) {
67:     clauses.push("archived_at IS NULL");
68:   }
69: 
70:   const search = options.search?.trim();
71:   if (search) {
72:     clauses.push("name LIKE ?");
73:     params.push(`%${search}%`);
74:   }
75: 
76:   if (options.lowStockOnly) {
77:     clauses.push("min_stock > 0 AND stock <= min_stock");
78:   }
79: 
80:   const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
81:   const rows = await db.getAllAsync<ProductRow>(
82:     `SELECT * FROM products ${where} ORDER BY name COLLATE NOCASE ASC`,
83:     params,
84:   );
85: 
86:   return rows.map(mapProductRow);
87: }
88: 
89: export async function getProduct(
90:   db: SQLiteDatabase,
91:   id: string,
92: ): Promise<Product | null> {
93:   const row = await db.getFirstAsync<ProductRow>(
94:     "SELECT * FROM products WHERE id = ?",
95:     id,
96:   );
97:   return row ? mapProductRow(row) : null;
98: }
99: 
100: export async function createProduct(
101:   db: SQLiteDatabase,
102:   input: ProductInput,
103: ): Promise<Product> {
104:   const id = createId("prd");
105:   const now = Date.now();
106:   const margin = clampMargin(input.marginPercent);
107:   const minStock = Math.max(0, roundQuantity(input.minStock));
108: 
109:   await db.runAsync(
110:     `INSERT INTO products (
111:       id, name, unit, stock, min_stock, last_price, current_price,
112:       sale_price, margin_percent, created_at, updated_at, archived_at
113:     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
114:     [
115:       id,
116:       input.name.trim(),
117:       input.unit.trim(),
118:       0,
119:       minStock,
120:       null,
121:       null,
122:       null,
123:       margin,
124:       now,
125:       now,
126:       null,
127:     ],
128:   );
129: 
130:   const product = await getProduct(db, id);
131:   if (!product) throw new Error("No se pudo crear el producto.");
132:   return product;
133: }
134: 
135: export async function updateProduct(
136:   db: SQLiteDatabase,
137:   id: string,
138:   input: UpdateProductInput,
139: ): Promise<Product> {
140:   const existing = await getProduct(db, id);
141:   if (!existing) throw new Error("Producto no encontrado.");
142: 
143:   const margin = clampMargin(input.marginPercent);
144:   let marginPercent = margin;
145:   let salePrice: number | null = null;
146:   const cost = existing.currentPrice;
147: 
148:   if (cost != null && cost > 0) {
149:     const calculated = calculateSalePrice(cost, margin);
150:     const requested =
151:       input.salePrice != null && input.salePrice > 0
152:         ? roundMoney(input.salePrice)
153:         : calculated;
154: 
155:     if (requested === calculated) {
156:       salePrice = calculated;
157:       marginPercent = margin;
158:     } else if (requested < cost) {
159:       salePrice = cost;
160:       marginPercent = 0;
161:     } else {
162:       const effective = effectiveMargin(cost, requested);
163:       if (effective >= 30) {
164:         salePrice = calculated;
165:         marginPercent = margin;
166:       } else {
167:         salePrice = requested;
168:         marginPercent = Math.round(effective * 100) / 100;
169:       }
170:     }
171:   }
172: 
173:   const now = Date.now();
174:   await db.runAsync(
175:     `UPDATE products
176:      SET name = ?, unit = ?, min_stock = ?, margin_percent = ?,
177:          sale_price = ?, updated_at = ?
178:      WHERE id = ?`,
179:     [
180:       input.name.trim(),
181:       input.unit.trim(),
182:       Math.max(0, roundQuantity(input.minStock)),
183:       marginPercent,
184:       salePrice,
185:       now,
186:       id,
187:     ],
188:   );
189: 
190:   const product = await getProduct(db, id);
191:   if (!product) throw new Error("No se pudo actualizar el producto.");
192:   return product;
193: }
194: 
195: export async function archiveProduct(
196:   db: SQLiteDatabase,
197:   id: string,
198: ): Promise<void> {
199:   const product = await getProduct(db, id);
200:   if (!product || product.archivedAt != null) {
201:     throw new Error("Producto no encontrado o ya archivado.");
202:   }
203:   if (product.stock > 0) {
204:     throw new Error(
205:       "No puedes archivar un producto con stock. Ajusta el stock a cero primero.",
206:     );
207:   }
208: 
209:   const now = Date.now();
210:   await db.runAsync(
211:     "UPDATE products SET archived_at = ?, updated_at = ? WHERE id = ? AND archived_at IS NULL",
212:     [now, now, id],
213:   );
214: }

(End of file - total 214 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/hooks/use-products.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/hooks/use-products.ts</path>
<type>file</type>
<content>
1: import { useSQLiteContext } from "expo-sqlite";
2: import { useEffect, useState } from "react";
3: import { useDataRevision } from "@/database/data-context";
4: import {
5:   getProduct,
6:   listProducts,
7: } from "@/database/repositories/products.repository";
8: import type { Product } from "@/database/types";
9: 
10: export function useProducts(
11:   options: {
12:     search?: string;
13:     lowStockOnly?: boolean;
14:     includeArchived?: boolean;
15:   } = {},
16: ) {
17:   const db = useSQLiteContext();
18:   const { revision } = useDataRevision();
19:   const search = options.search ?? "";
20:   const lowStockOnly = options.lowStockOnly ?? false;
21:   const includeArchived = options.includeArchived ?? false;
22: 
23:   const [products, setProducts] = useState<Product[]>([]);
24:   const [loading, setLoading] = useState(true);
25:   const [error, setError] = useState<string | null>(null);
26: 
27:   useEffect(() => {
28:     let active = true;
29: 
30:     listProducts(db, { search, lowStockOnly, includeArchived })
31:       .then((rows) => {
32:         if (!active) return;
33:         setProducts(rows);
34:         setError(null);
35:       })
36:       .catch((cause: unknown) => {
37:         if (!active) return;
38:         setError(
39:           cause instanceof Error ? cause.message : "No se pudieron cargar los productos.",
40:         );
41:       })
42:       .finally(() => {
43:         if (active) setLoading(false);
44:       });
45: 
46:     return () => {
47:       active = false;
48:     };
49:   }, [db, includeArchived, revision, search, lowStockOnly]);
50: 
51:   return { products, loading, error };
52: }
53: 
54: export function useProduct(id: string | undefined) {
55:   const db = useSQLiteContext();
56:   const { revision } = useDataRevision();
57: 
58:   const [product, setProduct] = useState<Product | null>(null);
59:   const [loading, setLoading] = useState(true);
60:   const [error, setError] = useState<string | null>(null);
61: 
62:   useEffect(() => {
63:     if (!id) return;
64: 
65:     let active = true;
66: 
67:     getProduct(db, id)
68:       .then((row) => {
69:         if (!active) return;
70:         setProduct(row);
71:         setError(null);
72:       })
73:       .catch((cause: unknown) => {
74:         if (!active) return;
75:         setError(
76:           cause instanceof Error ? cause.message : "No se pudo cargar el producto.",
77:         );
78:       })
79:       .finally(() => {
80:         if (active) setLoading(false);
81:       });
82: 
83:     return () => {
84:       active = false;
85:     };
86:   }, [db, id, revision]);
87: 
88:   return {
89:     product: id ? product : null,
90:     loading: id ? loading : false,
91:     error: id ? error : null,
92:   };
93: }

(End of file - total 93 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/data-context.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/data-context.tsx</path>
<type>file</type>
<content>
1: import {
2:   createContext,
3:   useCallback,
4:   useContext,
5:   useMemo,
6:   useState,
7:   type PropsWithChildren,
8: } from "react";
9: 
10: interface DataContextValue {
11:   revision: number;
12:   refresh: () => void;
13: }
14: 
15: const DataContext = createContext<DataContextValue | null>(null);
16: 
17: export function DataProvider({ children }: PropsWithChildren) {
18:   const [revision, setRevision] = useState(0);
19:   const refresh = useCallback(() => setRevision((current) => current + 1), []);
20:   const value = useMemo(() => ({ revision, refresh }), [revision, refresh]);
21: 
22:   return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
23: }
24: 
25: export function useDataRevision(): DataContextValue {
26:   const context = useContext(DataContext);
27:   if (!context) {
28:     throw new Error("useDataRevision debe usarse dentro de DataProvider");
29:   }
30:   return context;
31: }

(End of file - total 31 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/components/products/product-picker.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/components/products/product-picker.tsx</path>
<type>file</type>
<content>
1: import { useDeferredValue, useState } from "react";
2: import {
3:   ActivityIndicator,
4:   FlatList,
5:   Modal,
6:   Pressable,
7:   View,
8: } from "react-native";
9: import { SafeAreaView } from "react-native-safe-area-context";
10: import { AppText, EmptyState, TextField } from "@/components/ui";
11: import type { Product } from "@/database/types";
12: import { formatMoney } from "@/database/utils/money";
13: import { formatQuantity } from "@/database/utils/quantity";
14: import { useProducts } from "@/hooks/use-products";
15: import { usePalette } from "@/theme/colors";
16: import { cn } from "@/utils/cn";
17: 
18: export function ProductPicker({
19:   visible,
20:   selectedId,
21:   includeArchived = false,
22:   onClose,
23:   onSelect,
24: }: {
25:   visible: boolean;
26:   selectedId?: string;
27:   includeArchived?: boolean;
28:   onClose: () => void;
29:   onSelect: (product: Product) => void;
30: }) {
31:   const palette = usePalette();
32:   const [search, setSearch] = useState("");
33:   const deferredSearch = useDeferredValue(search);
34:   const { products, loading } = useProducts({
35:     search: deferredSearch,
36:     includeArchived,
37:   });
38: 
39:   return (
40:     <Modal
41:       visible={visible}
42:       animationType="slide"
43:       presentationStyle="pageSheet"
44:       onRequestClose={onClose}
45:     >
46:       <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
47:         <View className="flex-row items-center justify-between gap-3 border-b border-border px-4 py-3">
48:           <AppText variant="title">Elegir producto</AppText>
49:           <Pressable accessibilityRole="button" onPress={onClose}>
50:             <AppText className="font-semibold text-accent">Cerrar</AppText>
51:           </Pressable>
52:         </View>
53: 
54:         <View className="px-4 pt-3">
55:           <TextField
56:             value={search}
57:             onChangeText={setSearch}
58:             placeholder="Buscar por nombre"
59:             autoCapitalize="none"
60:             returnKeyType="search"
61:           />
62:         </View>
63: 
64:         <FlatList
65:           data={products}
66:           keyExtractor={(item) => item.id}
67:           contentContainerStyle={{ padding: 16, gap: 8 }}
68:           keyboardShouldPersistTaps="handled"
69:           showsVerticalScrollIndicator={false}
70:           renderItem={({ item }) => (
71:             <Pressable
72:               accessibilityRole="button"
73:               accessibilityState={{ selected: item.id === selectedId }}
74:               onPress={() => onSelect(item)}
75:               className={cn(
76:                 "gap-1 rounded-xl border p-3",
77:                 item.id === selectedId
78:                   ? "border-accent bg-accent-soft"
79:                   : "border-border bg-surface",
80:               )}
81:             >
82:               <AppText className="font-semibold">{item.name}</AppText>
83:               <AppText variant="caption">
84:                 {formatQuantity(item.stock)} {item.unit} · costo{" "}
85:                 {formatMoney(item.currentPrice)}
86:                 {item.archivedAt ? " · archivado" : ""}
87:               </AppText>
88:             </Pressable>
89:           )}
90:           ListEmptyComponent={
91:             loading ? (
92:               <View className="items-center py-10">
93:                 <ActivityIndicator color={palette.accent} />
94:               </View>
95:             ) : (
96:               <EmptyState
97:                 icon="package-variant-closed"
98:                 title={search ? "Sin resultados" : "Sin productos"}
99:                 description={
100:                   search
101:                     ? "Prueba con otro nombre."
102:                     : "Crea un producto antes de registrar movimientos."
103:                 }
104:               />
105:             )
106:           }
107:         />
108:       </SafeAreaView>
109:     </Modal>
110:   );
111: }

(End of file - total 111 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/app/purchase/new.tsx"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/app/purchase/new.tsx</path>
<type>file</type>
<content>
1: import { useLocalSearchParams, useRouter } from "expo-router";
2: import { useSQLiteContext } from "expo-sqlite";
3: import { useState } from "react";
4: import { ActivityIndicator, Alert, View } from "react-native";
5: import { PurchaseForm } from "@/components/movements/purchase-form";
6: import { useDataRevision } from "@/database/data-context";
7: import {
8:   registerPurchase,
9:   type PurchaseInput,
10: } from "@/database/repositories/purchases.repository";
11: import { useProduct } from "@/hooks/use-products";
12: import { usePalette } from "@/theme/colors";
13: 
14: export default function NewPurchaseScreen() {
15:   const params = useLocalSearchParams<{ productId?: string }>();
16:   const router = useRouter();
17:   const db = useSQLiteContext();
18:   const { refresh } = useDataRevision();
19:   const palette = usePalette();
20:   const { product, loading } = useProduct(params.productId);
21:   const [saving, setSaving] = useState(false);
22: 
23:   if (params.productId && loading) {
24:     return (
25:       <View className="flex-1 items-center justify-center bg-background">
26:         <ActivityIndicator color={palette.accent} />
27:       </View>
28:     );
29:   }
30: 
31:   async function handleSubmit(input: PurchaseInput) {
32:     setSaving(true);
33:     try {
34:       await registerPurchase(db, input);
35:       refresh();
36:       router.back();
37:     } catch (cause) {
38:       Alert.alert(
39:         "No se pudo registrar",
40:         cause instanceof Error ? cause.message : "Intenta de nuevo.",
41:       );
42:     } finally {
43:       setSaving(false);
44:     }
45:   }
46: 
47:   return (
48:     <PurchaseForm
49:       key={product?.id ?? "new"}
50:       initialProduct={product}
51:       submitting={saving}
52:       onSubmit={handleSubmit}
53:       onCancel={() => router.back()}
54:     />
55:   );
56: }

(End of file - total 56 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/viticomc/Work/mi-almacen/src/database/repositories/purchases.repository.ts"
}
```

**Output:**
```
<path>/home/viticomc/Work/mi-almacen/src/database/repositories/purchases.repository.ts</path>
<type>file</type>
<content>
1: import type { SQLiteDatabase } from "expo-sqlite";
2: import type { Product, Purchase } from "../types";
3: import { createId } from "../utils/ids";
4: import {
5:   calculateSalePrice,
6:   effectiveMargin,
7:   roundMoney,
8: } from "../utils/money";
9: import { roundQuantity } from "../utils/quantity";
10: import {
11:   mapProductRow,
12:   type ProductRow,
13: } from "./products.repository";
14: 
15: export type SalePriceStrategy = "margin" | "keep" | "custom";
16: 
17: export interface PurchaseInput {
18:   productId: string;
19:   quantity: number;
20:   total: number;
21:   salePriceStrategy: SalePriceStrategy;
22:   customSalePrice?: number;
23: }
24: 
25: export interface PurchasePreview {
26:   product: Product;
27:   quantity: number;
28:   total: number;
29:   unitCost: number;
30:   previousCost: number | null;
31:   newCost: number;
32:   previousSalePrice: number | null;
33:   marginPercent: number;
34:   marginSalePrice: number | null;
35:   marginEffectiveMargin: number | null;
36:   keptEffectiveMargin: number | null;
37:   customSalePrice: number | null;
38:   customEffectiveMargin: number | null;
39:   canKeepPrice: boolean;
40: }
41: 
42: export interface PurchaseListItem extends Purchase {
43:   productName: string;
44:   productUnit: string;
45: }
46: 
47: interface PurchaseRow {
48:   id: string;
49:   product_id: string;
50:   quantity: number;
51:   total: number;
52:   unit_cost: number;
53:   previous_cost: number | null;
54:   new_cost: number;
55:   previous_sale_price: number | null;
56:   new_sale_price: number | null;
57:   created_at: number;
58:   product_name: string;
59:   product_unit: string;
60: }
61: 
62: function mapPurchase(row: PurchaseRow): PurchaseListItem {
63:   return {
64:     id: row.id,
65:     productId: row.product_id,
66:     quantity: row.quantity,
67:     total: row.total,
68:     unitCost: row.unit_cost,
69:     previousCost: row.previous_cost,
70:     newCost: row.new_cost,
71:     previousSalePrice: row.previous_sale_price,
72:     newSalePrice: row.new_sale_price,
73:     createdAt: row.created_at,
74:     productName: row.product_name,
75:     productUnit: row.product_unit,
76:   };
77: }
78: 
79: export function buildPurchasePreview(
80:   product: Product,
81:   quantity: number,
82:   total: number,
83:   customSalePrice?: number,
84: ): PurchasePreview {
85:   const safeQuantity = roundQuantity(quantity);
86:   const safeTotal = roundMoney(total);
87:   const unitCost =
88:     safeQuantity > 0 && safeTotal > 0 ? roundMoney(safeTotal / safeQuantity) : 0;
89:   const marginSalePrice =
90:     unitCost > 0 && product.marginPercent > 0
91:       ? calculateSalePrice(unitCost, product.marginPercent)
92:       : null;
93:   const keptEffectiveMargin =
94:     unitCost > 0 && product.salePrice != null && product.salePrice >= 0
95:       ? effectiveMargin(unitCost, product.salePrice)
96:       : null;
97:   const safeCustomSalePrice =
98:     customSalePrice != null && customSalePrice > 0
99:       ? roundMoney(customSalePrice)
100:       : null;
101:   const customEffectiveMargin =
102:     safeCustomSalePrice != null && unitCost > 0
103:       ? effectiveMargin(unitCost, safeCustomSalePrice)
104:       : null;
105: 
106:   return {
107:     product,
108:     quantity: safeQuantity,
109:     total: safeTotal,
110:     unitCost,
111:     previousCost: product.currentPrice,
112:     newCost: unitCost,
113:     previousSalePrice: product.salePrice,
114:     marginPercent: product.marginPercent,
115:     marginSalePrice,
116:     marginEffectiveMargin:
117:       marginSalePrice != null
118:         ? effectiveMargin(unitCost, marginSalePrice)
119:         : null,
120:     keptEffectiveMargin,
121:     customSalePrice: safeCustomSalePrice,
122:     customEffectiveMargin,
123:     canKeepPrice:
124:       keptEffectiveMargin != null && keptEffectiveMargin < 30,
125:   };
126: }
127: 
128: export async function listPurchases(
129:   db: SQLiteDatabase,
130:   limit = 50,
131: ): Promise<PurchaseListItem[]> {
132:   const rows = await db.getAllAsync<PurchaseRow>(
133:     `SELECT
134:        pu.*,
135:        pr.name AS product_name,
136:        pr.unit AS product_unit
137:      FROM purchases pu
138:      JOIN products pr ON pr.id = pu.product_id
139:      ORDER BY pu.created_at DESC
140:      LIMIT ?`,
141:     [limit],
142:   );
143: 
144:   return rows.map(mapPurchase);
145: }
146: 
147: export async function registerPurchase(
148:   db: SQLiteDatabase,
149:   input: PurchaseInput,
150: ): Promise<Purchase> {
151:   const quantity = roundQuantity(input.quantity);
152:   const total = roundMoney(input.total);
153: 
154:   if (quantity <= 0) {
155:     throw new Error("La cantidad debe ser mayor a cero.");
156:   }
157:   if (total <= 0) {
158:     throw new Error("El total pagado debe ser mayor a cero.");
159:   }
160: 
161:   let created: Purchase | null = null;
162: 
163:   await db.withExclusiveTransactionAsync(async (txn) => {
164:     const productRow = await txn.getFirstAsync<ProductRow>(
165:       "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
166:       input.productId,
167:     );
168: 
169:     if (!productRow) {
170:       throw new Error("Producto no encontrado o archivado.");
171:     }
172: 
173:     const product = mapProductRow(productRow);
174:     const unitCost = roundMoney(total / quantity);
175: 
176:     if (unitCost <= 0) {
177:       throw new Error("El costo unitario debe ser mayor a cero.");
178:     }
179: 
180:     let newSalePrice: number | null;
181:     let newMarginPercent = product.marginPercent;
182: 
183:     if (input.salePriceStrategy === "keep") {
184:       if (product.salePrice == null) {
185:         throw new Error("El producto no tiene un precio de salida para mantener.");
186:       }
187:       if (effectiveMargin(unitCost, product.salePrice) >= 30) {
188:         throw new Error(
189:           "Mantener el precio actual supera el margen máximo del 30%. Recalcula el precio.",
190:         );
191:       }
192:       newSalePrice = product.salePrice;
193:     } else if (input.salePriceStrategy === "custom") {
194:       const customSalePrice = roundMoney(input.customSalePrice ?? 0);
195:       if (customSalePrice <= 0) {
196:         throw new Error("Ingresa un precio de venta mayor a cero.");
197:       }
198: 
199:       const customMargin = effectiveMargin(unitCost, customSalePrice);
200:       if (customMargin >= 30) {
201:         throw new Error("El margen debe ser menor al 30%.");
202:       }
203: 
204:       newSalePrice = customSalePrice;
205:       newMarginPercent =
206:         customMargin > 0 ? Math.floor(customMargin * 100) / 100 : 0;
207:     } else {
208:       newSalePrice =
209:         product.marginPercent > 0
210:           ? calculateSalePrice(unitCost, product.marginPercent)
211:           : null;
212:     }
213:     const newStock = roundQuantity(product.stock + quantity);
214:     const id = createId("pur");
215:     const now = Date.now();
216: 
217:     await txn.runAsync(
218:       `INSERT INTO purchases (
219:         id, product_id, quantity, total, unit_cost, previous_cost,
220:         new_cost, previous_sale_price, new_sale_price, created_at
221:       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
222:       [
223:         id,
224:         product.id,
225:         quantity,
226:         total,
227:         unitCost,
228:         product.currentPrice,
229:         unitCost,
230:         product.salePrice,
231:         newSalePrice,
232:         now,
233:       ],
234:     );
235: 
236:     await txn.runAsync(
237:       `UPDATE products
238:        SET last_price = current_price,
239:            current_price = ?,
240:            sale_price = ?,
241:            margin_percent = ?,
242:            stock = ?,
243:            updated_at = ?
244:        WHERE id = ?`,
245:       [unitCost, newSalePrice, newMarginPercent, newStock, now, product.id],
246:     );
247: 
248:     created = {
249:       id,
250:       productId: product.id,
251:       quantity,
252:       total,
253:       unitCost,
254:       previousCost: product.currentPrice,
255:       newCost: unitCost,
256:       previousSalePrice: product.salePrice,
257:       newSalePrice,
258:       createdAt: now,
259:     };
260:   });
261: 
262:   if (!created) {
263:     throw new Error("No se pudo registrar la compra.");
264:   }
265: 
266:   return created;
267: }

(End of file - total 267 lines)
</content>
```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 137.3s)

_Thinking:_

Now I have a thorough understanding. Let me clarify the design choices with the user before writing the plan. The core ambiguity:

1. Weekly count flow: one screen with all products, or per product?
2. What to do with positive differences (counted > system). Options: adjustment entry, ignore, ask each.
3. Should the generated sale use the current sale_price to compute money total? Or quantity-only sale with no monetary value?
4. Should the manual "Registrar venta" flow be removed from UI? And the "Ventas" tab in Movimientos?
5. Do purchases remain as the way to add stock? How does stock enter initially? (Maybe he registers "entradas"/compras.) Actually if he only counts, when new merchandise arrives he'd count up → positive difference = adjustment entry. Then he doesn't need purchases at all. Hmm, but prices... He may still want to record cost when buying. Need to ask.

Given the instruction says ask clarifying questions when weighing tradeoffs. I should ask a focused set of questions, then produce a plan.

Let me use the question tool. But I also need to present plan eventually. Since user asked for a change; plan mode. I'll ask ~4 questions with options.

Let me formulate:

Q1: ¿Cómo quieres que sea el flujo de conteo?
- Conteo semanal de todos los productos en una sola pantalla (recomendado): lista con stock del sistema, campo "contado", confirmar todo junto.
- Producto por producto: elegir producto y ajustar como ahora.
- Ambos.

Q2: ¿Qué hacer cuando el conteo es MAYOR al stock del sistema (sobrante)?
- Registrar ajuste de entrada (recomendado) — no es venta.
- Preguntar en cada caso.
- Ignorar / solo cuadrado sin movimiento.

Q3: ¿La "venta" generada por la diferencia debe calcular dinero?
- Sí, con el precio de salida actual congelado (recomendado) — total = diferencia × precio de salida.
- Solo cantidad, sin dinero.
- Usar costo en lugar de precio de salida.

Q4: ¿Qué hacemos con el registro manual de ventas actual?
- Eliminarlo de la interfaz (recomendado) y dejar solo el conteo; historial conserva ventas.
- Mantenerlo escondido/accesible como opción avanzada.
- Mantenerlo.

Q5: ¿Las compras/entradas siguen existiendo? How stock increases.
- Sí, se mantienen para registrar mercancía que entra con su costo (recomendado).
- No, todo se maneja con conteos (los sobrantes son entradas) y el costo se edita en el producto.

Maybe Q5 overlaps Q2. I can combine.

Also worth noting: a "count" that produces sales may require sale_price; products without sale_price? Then sale total null? Could block or record quantity only. Ask in Q3 perhaps.

I'll ask 5 questions max. The question tool supports multiple questions. Let me do it.

Actually, I should be careful: The user speaks Spanish. Respond in Spanish. The plan should be in Spanish.

Let me ask questions now.

He revisado toda la app y `guide.md`. Antes de armar el plan necesito confirmar 5 decisiones de producto, porque cambian bastante el alcance.

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "¿Cómo quieres que funcione el conteo semanal en la interfaz?",
      "header": "Flujo de conteo",
      "options": [
        {
          "label": "Conteo de todos a la vez (Recomendado)",
          "description": "Una pantalla con la lista de productos: stock del sistema, campo \"contado\" y un solo botón para confirmar todo el conteo del domingo."
        },
        {
          "label": "Producto por producto",
          "description": "Se elige un producto a la vez y se digita lo contado, como el ajuste por conteo actual."
        },
        {
          "label": "Ambos flujos",
          "description": "Pantalla de conteo general y también acceso rápido desde el detalle de cada producto."
        }
      ]
    },
    {
      "question": "Cuando lo contado es MAYOR que el stock del sistema (sobrante), ¿qué debe pasar?",
      "header": "Diferencias positivas",
      "options": [
        {
          "label": "Registrar ajuste de entrada (Recomendado)",
          "description": "Se suma la diferencia al stock y queda en el historial como ajuste, con motivo \"sobrante de conteo\"."
        },
        {
          "label": "Preguntar caso por caso",
          "description": "En la vista previa se elige si el sobrante es entrada, error de conteo o se descarta."
        },
        {
          "label": "No generar movimiento",
          "description": "Solo se iguala el stock al valor contado sin dejar registro de la diferencia."
        }
      ]
    },
    {
      "question": "La venta generada por una diferencia negativa, ¿debe calcular dinero?",
      "header": "Valor de la venta",
      "options": [
        {
          "label": "Sí, con precio de salida (Recomendado)",
          "description": "total = diferencia × sale_price congelado. Si el producto no tiene precio de salida, se pide definirlo o se registra solo cantidad."
        },
        {
          "label": "Solo cantidad, sin dinero",
          "description": "La venta registra únicamente las unidades que faltan; los totales monetarios quedan en cero/nulos."
        },
        {
          "label": "Usar el costo",
          "description": "Se valoriza la diferencia con current_price en lugar del precio de salida."
        }
      ]
    },
    {
      "question": "¿Qué hacemos con el registro manual de ventas actual?",
      "header": "Venta manual",
      "options": [
        {
          "label": "Eliminarlo de la interfaz (Recomendado)",
          "description": "Se quita \"Nueva venta\" y el modo Ventas de Movimientos; las ventas solo nacen del conteo. El historial sigue mostrándolas."
        },
        {
          "label": "Dejarlo como opción avanzada",
          "description": "Se mantiene pero escondido/secundario, por si alguna vez necesita vender algo puntual."
        },
        {
          "label": "Mantenerlo igual",
          "description": "El conteo se agrega como función nueva y la venta manual sigue visible."
        }
      ]
    },
    {
      "question": "¿Las compras/entradas siguen existiendo como forma de sumar stock y fijar costos?",
      "header": "Compras",
      "options": [
        {
          "label": "Sí, se mantienen (Recomendado)",
          "description": "Cuando llega mercancía se registra la compra con su costo; el conteo solo corrige faltantes/sobrantes."
        },
        {
          "label": "No, todo se maneja con conteos",
          "description": "La mercancía que entra se refleja como sobrante en el conteo y el costo se edita en el producto."
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "¿Cómo quieres que funcione el conteo semanal en la interfaz?"="Conteo de todos a la vez (Recomendado)", "Cuando lo contado es MAYOR que el stock del sistema (sobrante), ¿qué debe pasar?"="la diferencia del conteo se debe guardar como una venta conjunta de todos los productos", "La venta generada por una diferencia negativa, ¿debe calcular dinero?"="Sí, con precio de salida (Recomendado)", "¿Qué hacemos con el registro manual de ventas actual?"="Eliminarlo de la interfaz (Recomendado)", "¿Las compras/entradas siguen existiendo como forma de sumar stock y fijar costos?"="la compra se mantienen como estan y van directo al stock , lo que se debe cambiar es el sistema de registrar ventas". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 49.6s)

---

## User

continua

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 36.8s)

---

## User

continua

---

## Assistant (Plan · DeepSeek V4.1 Flash Free · 15.2s)

---

## User

continua

---

## Assistant (Plan · Big Pickle · 83.7s)

---

## User

continua

---

## Assistant (Plan · Big Pickle · 42.7s)

---

