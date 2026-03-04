# Checklist vs especificación Event-Op-App

| # | Requisito | Implementación | Ubicación |
|---|-----------|----------------|-----------|
| **1** | **Sincronización híbrida** | | |
| 1.1 | Cola local pendingActions | ✅ | `SyncService.js`: `enqueueAction`, `getPendingActions`, `@pending_actions` |
| 1.2 | Reintentos automáticos | ✅ | `SyncService.js`: `incrementRetry`, MAX_RETRIES=5 |
| 1.3 | Resolución por timestamp | ✅ | `getPendingActions` ordena por timestamp; `processQueueLocal` listo para backend |
| 1.4 | No eliminar AsyncStorage | ✅ | EventContext escribe en adapter + AsyncStorage |
| **2** | **Motor de estados de tickets** | | |
| 2.1 | CREATED → RESERVED → PAID → USED → EXPIRED | ✅ | `constants/ticketStates.js` |
| 2.2 | Transiciones válidas solamente | ✅ | `canTransition()` en ticketStates.js |
| 2.3 | Persistencia completa | ✅ | saveTickets + storageAdapter + AsyncStorage |
| 2.4 | Usado por Mis entradas y validación QR | ✅ | getTicketsForUser (PAID/USED), validateTicket (PAID→USED) |
| **3** | **QR offline + hash local** | | |
| 3.1 | hash(eventId + ticketId + secret + timestamp) | ✅ | `QrHashService.js`: generateQrPayload, parseQrPayload |
| 3.2 | Validación 100% offline | ✅ | validateTicket usa parseQrPayload + userTickets locales |
| 3.3 | Un solo uso | ✅ | markQrAsUsed / isQrAlreadyUsed, @used_qr_hashes |
| **4** | **Modo Organizador** | | |
| 4.1 | Modo organizador en menú | ✅ | Drawer: sección "Modo organizador" |
| 4.2 | Organizar un evento / Gestionar eventos | ✅ | Items en drawer bajo Modo organizador |
| 4.3 | Separar Modo usuario / Modo organizador | ✅ | CustomDrawerContent con sectionLabel para cada uno |
| **5** | **Logs + exportación** | | |
| 5.1 | Logs errores, compras, validaciones, sync | ✅ | LogService: appendLog(category), categorías ERROR, PURCHASE, VALIDATION, SYNC |
| 5.2 | Exportables JSON / TXT | ✅ | exportLogsAsJson, exportLogsAsTxt; ProfileScreen botones JSON/TXT |
| **6** | **Backend futuro** | | |
| 6.1 | services / repositories / adapters | ✅ | Carpetas y archivos creados |
| 6.2 | Reemplazar AsyncStorage por API sin tocar pantallas | ✅ | storageAdapter único punto; repositories usan adapter |
| **UX** | **Modificaciones funcionales** | | |
| UX.1 | Público/Privado: dos checkboxes, ninguno por defecto, validación | ✅ | CreateEventWizard step 1: checkboxRow, nextStep validación |
| UX.2 | Input Tipo de lugar + Nombre del lugar (sin tipos de sede) | ✅ | CreateEventWizard: placeType, placeName; eliminado VENUE_TYPES |
| UX.3 | Fecha DD/MM/YYYY, máscara y validación | ✅ | formatters: formatDateInput, isValidDateDDMMYYYY |
| UX.4 | Hora HH:MM 24h, máscara y validación | ✅ | formatters: formatTimeInput, isValidTimeHHMM |
| UX.5 | Localidades sin duplicados, normalizar | ✅ | LocationService.searchLocalidad: dedup por normLabel|lat|lon |
| UX.6 | Tarjeta débito, crédito, Billetera virtual | ✅ | UserEventDetailScreen: opciones de pago |
| UX.7 | Billetera: modal Alias, Concepto, Monto, "Copiar todo" | ✅ | WalletTransferModal + Clipboard.setString |
| UX.8 | Mis entradas: PAID, userId, persistencia correcta | ✅ | getTicketsForUser filtra userId + PAID/USED; saveTickets dual |

Documento completo: **ARCHITECTURE_AND_CHANGES.md**.
