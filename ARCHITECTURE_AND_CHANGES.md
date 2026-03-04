# Event-Op-App – Arquitectura y cambios realizados

## 1. Estructura de carpetas propuesta

```
src/
├── adapters/
│   └── storageAdapter.js       # Abstraction de persistencia (AsyncStorage hoy; API mañana)
├── constants/
│   └── ticketStates.js         # Estados y transiciones del motor de tickets
├── context/
│   ├── AuthContext.js
│   ├── EventContext.js
│   ├── NotificationContext.js
│   └── SyncContext.js          # Cola de sincronización híbrida
├── repositories/
│   ├── eventRepository.js      # Capa de datos eventos
│   └── ticketRepository.js    # Capa de datos tickets
├── services/
│   ├── LocationService.js     # Existente
│   ├── AuthService.js         # Existente
│   ├── QrHashService.js       # Hash QR y validación offline
│   ├── LogService.js          # Logs locales y exportación
│   └── SyncService.js         # Cola pendingActions, reintentos
├── components/
├── screens/
├── styles/
└── utils/
```

- **adapters/**: un solo punto para cambiar AsyncStorage por una API sin tocar pantallas.
- **repositories/**: capa de datos; hoy delegan al adapter, mañana pueden llamar a un API client.
- **services/**: lógica de negocio reutilizable (QR, logs, sync).
- **constants/**: estados de tickets y reglas de transición.

---

## 2. Lista de cambios técnicos realizados

| Área | Cambio |
|------|--------|
| **Persistencia** | `storageAdapter` centraliza lectura/escritura; EventContext sigue escribiendo también en AsyncStorage (no se elimina). |
| **Tickets** | Motor de estados: CREATED → RESERVED → PAID → USED | EXPIRED. Transiciones válidas en `ticketStates.js`. Nuevos tickets se crean en PAID. |
| **QR** | QR con hash: `hash(eventId + ticketId + secret + timestamp)`. Validación 100% offline; un solo uso; hashes usados en `@used_qr_hashes`. |
| **Sync** | Cola `pendingActions` en AsyncStorage, reintentos (máx. 5), resolución por timestamp. SyncContext expone `pendingCount` y `refreshPendingCount`. |
| **Menú** | Drawer con secciones "Modo usuario" (Explorar, Mi cuenta, Mis eventos) y "Modo organizador" (Organizar un evento, Gestionar eventos). |
| **Logs** | LogService: categorías ERROR, PURCHASE, VALIDATION, SYNC, APP. Exportación JSON/TXT desde Mi perfil. |
| **Wizard** | Público/Privado con dos checkboxes (ninguno por defecto); validación obligatoria. Tipo de lugar + Nombre del lugar en lugar de tipos de sede. Fecha DD/MM/YYYY con máscara; hora HH:MM 24h con validación. |
| **Pago** | Métodos: Tarjeta débito, Tarjeta crédito, Billetera virtual. Modal billetera: Alias, Concepto (código único), Monto, botón "Copiar todo". |
| **Localidades** | Deduplicación por clave normalizada (label + lat + lon) en LocationService. |
| **Mis entradas** | Filtro por `userId` y estados PAID/USED; persistencia vía storageAdapter + AsyncStorage. |

---

## 3. Explicación breve

### Sincronización híbrida
- Las acciones se encolan en `@pending_actions` con tipo, payload y timestamp.
- `SyncService`: `enqueueAction`, `getPendingActions`, `processQueueLocal` (hoy sin backend, solo vacía cola con applyEventUpdate/applyTicketUpdate opcionales).
- Reintentos automáticos hasta MAX_RETRIES; resolución por timestamp lista para cuando exista backend.

### Motor de tickets
- Estados: CREATED, RESERVED, PAID, USED, EXPIRED. Transiciones válidas en `ticketStates.js`.
- En compra se crean tickets en PAID. Validación QR hace PAID → USED y marca el hash como usado.
- `getTicketsForUser` devuelve solo tickets con estado PAID o USED (y mismo userId). Compatibilidad con estados legacy `active`/`used`.

### Fix “Mis entradas”
- Se muestran solo entradas con estado PAID o USED y que pertenecen al usuario (`userId`).
- Persistencia: `saveTickets` escribe en storageAdapter y en AsyncStorage.
- Carga inicial lee de ambos para no perder datos ya guardados.

---

## 4. Conclusión del estado del proyecto

- **Estable**: Funcionalidades existentes (exploración, wizard, compra, QR, notificaciones) se mantienen; AsyncStorage no se eliminó.
- **Offline-first**: Datos y cola en local; validación QR offline con hash y un solo uso.
- **Lista para escalar**: Capas adapters/repositories/services permiten sustituir AsyncStorage por API sin tocar pantallas.
- **Monetizable**: Flujo de pago con débito/crédito/billetera y modal de transferencia con “Copiar todo”.
- **Android**: Sin dependencias que impidan uso en Android; permisos y almacenamiento ya considerados (location, etc.).

Para backend futuro: implementar un `apiAdapter` que reemplace las llamadas de `storageAdapter` por HTTP y procesar la cola de `SyncService` contra el servidor.
