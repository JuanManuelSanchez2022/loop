# LOOP – Sistema visual y UX

## Paleta (theme)

- **Background:** `#0F172A`
- **Surface / Cards:** `#111827`
- **Secondary surface:** `#1F2937`
- **Texto:** `#F9FAFB` / secundario `#9CA3AF`
- **Primario (acciones):** `#22C55E`
- **Error:** `#EF4444` · **Warning:** `#F59E0B` · **Info:** `#38BDF8`
- **Organizador:** `#38BDF8`

Definido en `src/styles/colors.js` y reexportado por `src/styles/theme.js`.

## Tipografía

- **Title:** 24px semi-bold  
- **Subtitle:** 16–18px  
- **Body:** 14–16px  
- **Meta (fecha, lugar):** 12–13px  

Definido en `src/styles/typography.js`. Se mantienen alias `h1`, `h2`, `h3`, `body`, `caption` para no romper código existente.

## Componentes base

En `src/components/`:

- **AppContainer** – Contenedor con SafeArea y fondo
- **Card** – Superficie con borderRadius 16, opcional `onPress`
- **PrimaryButton** – CTA verde, altura mínima 44px
- **SecondaryButton** – Secundario con borde
- **Input** – Campo con label/error, placeholder visible (Android)
- **Badge** – Variantes: `primary`, `success`, `error`, `warning`, `info`, `organizer`, `default`
- **Divider** – Línea separadora

Todos usan `RADIUS` 12–16 y `TOUCH_MIN` 44.

## Pantallas tocadas

- **Explorar:** Cards destacados con imagen superior, nombre, fecha/hora/lugar, badges Gratis|Pago y Público|Privado. Categorías y ubicación con nuevo tema.
- **Eventos (lista):** Card por evento con imagen superior, título, meta, badges. Input de búsqueda con componente `Input`.
- **Mis entradas:** Estilo wallet; QR grande, nombre evento, fecha/hora, estado (Pagada / Usada / Expirada). `extraData` en `FlatList` para que la lista se actualice al cambiar tickets.
- **Drawer:** Modo usuario vs Modo organizador; sección organizador con badge “Organizador” y color `organizer` en ítems activos.

## Formularios (ya alineados al spec anterior)

- Público/Privado: dos checkboxes, validación.
- Lugar: inputs “Tipo de lugar” y “Nombre del lugar”.
- Fecha DD/MM/YYYY y hora HH:MM con máscara/validación.
- Localidades sin duplicados (LocationService).

## Pagos

- Opciones: Tarjeta débito, Tarjeta crédito, Billetera virtual.
- Modal billetera: Alias, Concepto, Monto, “Copiar todo”.

## Compatibilidad

- Sin nuevas dependencias.
- Sin TypeScript.
- AsyncStorage y Context API sin cambios.
- Tema único vía `theme.js`; todas las pantallas que importan `COLORS`/`TYPOGRAPHY` de `theme` usan ya el sistema visual unificado.
