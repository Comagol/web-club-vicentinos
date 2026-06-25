# Backend Architecture Design
**Date:** 2026-06-25
**Project:** Vicentinos — Club de Rugby y Hockey
**Status:** Approved

---

## 1. Stack

| Concern | Decision |
|---|---|
| Runtime | Node.js + TypeScript |1
| Framework | Express |
| ORM | Prisma (already in place from chat1) |
| Database | PostgreSQL (Docker locally, Supabase for staging/prod) |
| Validation | Zod |
| Auth | JWT access + refresh tokens in httpOnly cookies |
| Password hashing | bcrypt (cost factor 12) |
| Security headers | helmet |
| Testing | Vitest + Supertest against real Postgres test DB |

---

## 2. Folder Structure

```
backend/
  src/
    app.ts                        # Express app: middleware, route mounting
    server.ts                     # http.listen entrypoint
    config/
      env.ts                      # parsed and typed env vars (throws on missing)
    shared/
      errors.ts                   # AppError hierarchy
      errorHandler.ts             # centralized Express error middleware
      validate.ts                 # Zod validation middleware factory
      prisma.ts                   # singleton PrismaClient
      asyncHandler.ts             # wraps async handlers, forwards errors to next()
    modules/
      auth/
        auth.routes.ts
        auth.controller.ts
        auth.service.ts
        auth.schemas.ts
        jwt.ts                    # sign/verify access & refresh tokens
        rbac.ts                   # requireAuth, requireRole middlewares
      socios/
        socios.routes.ts
        socios.controller.ts
        socios.service.ts
        socios.schemas.ts
      solicitudes/
        solicitudes.routes.ts     # stub (501) until implemented
      operativo/
        operativo.routes.ts       # stub (501) until implemented
      boutique/
        boutique.routes.ts        # stub (501) until implemented
      institucional/
        institucional.routes.ts   # stub (501) until implemented
      pagos/
        pagos.routes.ts
        pagos.controller.ts
        pagos.service.ts
        coelsa.formatter.ts       # TODO: implement when Macro/Prisma spec available
        coelsa.parser.ts          # TODO: implement when Macro/Prisma spec available
    integrations/
      external-system/
        parser.ts                 # TODO: implement when sample file obtained
        importer.ts               # upserts socios/cuotas from parsed file
  test/
    helpers/
      prisma.ts                   # existing cleanDatabase helper
    *.smoke.test.ts               # existing smoke tests (unchanged)
    auth.smoke.test.ts            # new
    socios-carnet.smoke.test.ts   # new
```

Each module is self-contained: routes → controller (HTTP concerns only) → service (business logic, Prisma calls) → schemas (Zod). Modules not yet built expose a single `501 Not Implemented` router mounted in `app.ts` so the full route surface exists from day one.

---

## 3. Authentication

### Tokens
- **Access token:** JWT, 15-minute expiry, signed with `JWT_ACCESS_SECRET`
- **Refresh token:** JWT, 7-day expiry, signed with `JWT_REFRESH_SECRET`
- Both delivered as `httpOnly; Secure; SameSite=Strict` cookies — never in response body or localStorage

### Login flow
1. `POST /auth/login` — validates email/password with bcrypt
2. Loads `UsuarioRol[]` for the user
3. Signs access + refresh tokens, sets both cookies
4. Responds `{ usuario: { id, email, roles[] } }` (for frontend role-based rendering)

### Refresh flow
- `POST /auth/refresh` — reads refresh cookie, verifies signature, issues new token pair (rotation)
- Expired or invalid refresh → 401 (frontend redirects to login)

### Logout
- `POST /auth/logout` — clears both cookies (maxAge=0)

### Middleware
- `requireAuth` — reads access cookie, verifies JWT, attaches `req.user = { id, email, roles[] }`, calls `next()`. Invalid/absent → 401.
- `requireRole(...roles)` — after `requireAuth`, checks `req.user.roles` includes at least one of the required roles. Fails → 403.

### CORS
`credentials: true` + explicit `origin` (never `*`).

---

## 4. RBAC

Two-layer approach:

**Layer 1 — middleware per route (who can call this endpoint):**
```ts
router.post('/solicitudes', requireAuth, requireRole('SOCIO', 'SUBCOMISION'), createSolicitud)
router.patch('/solicitudes/:id/aprobar', requireAuth, requireRole('COMISION_DIRECTIVA'), aprobarSolicitud)
```

**Layer 2 — fine-grained rules in the service (what can be done with this specific entity):**
```ts
// SolicitudService.aprobar()
if (solicitud.estado !== 'PENDIENTE')
  throw new AppError('Solo se pueden aprobar solicitudes pendientes', 400)

// SolicitudService.create()
if (tipo === 'ACTIVIDAD_RECAUDATORIA' && origen !== 'SUBCOMISION')
  throw new ForbiddenError('Solo la subcomisión puede iniciar actividades recaudatorias')
```

Middleware only checks role. Business invariants live in the service and throw typed errors.

---

## 5. Error Handling

### AppError hierarchy
```
AppError(message, statusCode, code?)
  ├── NotFoundError       → 404  / NOT_FOUND
  ├── ForbiddenError      → 403  / FORBIDDEN
  ├── UnauthorizedError   → 401  / UNAUTHORIZED
  └── ValidationError     → 422  / VALIDATION_ERROR
```

### Centralized error handler (last Express middleware)
Always responds:
```json
{ "error": { "message": "...", "code": "NOT_FOUND", "details": [] } }
```

- Zod errors → transformed to `ValidationError` by the validation middleware
- Known Prisma errors (P2002 unique constraint, P2025 not found) → mapped to `AppError` in a Prisma wrapper utility
- Unexpected errors → 500 without stack trace in production

### asyncHandler
Wraps all async route handlers so rejections propagate to the error handler without try/catch in every controller:
```ts
router.get('/socios/:id', requireAuth, asyncHandler(sociosController.getById))
```

---

## 6. Endpoints

### Auth
```
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me          [requireAuth]
```

### Socios
```
GET   /socios          [ADMIN, COMISION_DIRECTIVA]  — listado con filtros
GET   /socios/:id      [ADMIN, COMISION_DIRECTIVA]  — perfil completo
POST  /socios          [ADMIN]                      — crear socio
PATCH /socios/:id      [ADMIN]                      — editar datos
GET   /socios/:id/cuotas   [ADMIN, COMISION_DIRECTIVA]
GET   /socios/:id/carnet   [requireAuth]            — datos del carnet (SOCIO ve el suyo, ADMIN/CD ven cualquiera)
```

### Carnet público
```
GET /verificar/:token  — sin auth, datos no sensibles en tiempo real
```

### Solicitudes
```
GET    /solicitudes              [requireAuth]               — filtrado por rol
POST   /solicitudes              [SOCIO, SUBCOMISION]
GET    /solicitudes/:id          [requireAuth]
PATCH  /solicitudes/:id/aprobar  [COMISION_DIRECTIVA]
PATCH  /solicitudes/:id/rechazar [COMISION_DIRECTIVA]
```

### Operativo
```
GET   /tareas              [requireAuth]          — EMPLEADO ve solo las suyas
POST  /tareas              [JEFE_AREA, ADMIN]
PATCH /tareas/:id/estado   [EMPLEADO, JEFE_AREA]
```

### Boutique
```
GET  /productos            — público
GET  /productos/:id        — público
POST /pedidos              [SOCIO]
GET  /pedidos/:id          [SOCIO owner, ENCARGADO_BOUTIQUE, ADMIN]
PATCH /pedidos/:id/estado  [ENCARGADO_BOUTIQUE, ADMIN]
```

### Institucional (público)
```
GET  /noticias
GET  /noticias/:id
POST /noticias             [ADMIN, COMISION_DIRECTIVA]
GET  /resultados
POST /resultados           [ADMIN, COMISION_DIRECTIVA]
```

### Pagos / débito automático
```
GET  /pagos/debito/archivo?mes=&anio=   [ADMIN]   — genera si no existe, devuelve como attachment
POST /pagos/rendicion                   [ADMIN]   — multipart: { archivoDebitoId, file }
```

---

## 7. Carnet Digital

### GET /socios/:id/carnet (autenticado)
Acceso: el SOCIO puede ver su propio carnet (ownership check en el service: `req.user.socio.id === id`). ADMIN y COMISION_DIRECTIVA pueden ver cualquier carnet.

Resuelve en el service:
- Datos base del socio: nombre, apellido, fotoUrl, numeroSocio, categoriaSocio
- `estadoMembresia`: campo en BD, actualizado automáticamente por el procesador de rendición
- `habilitacionEstacionamiento`: derivado en runtime — `true` si no hay `Cuota` con estado `VENCIDA` en los últimos 3 períodos calendario (comparación por `mes+anio`, no rolling days)
- `tokenQr`: UUID estable ya existente en el schema (campo `Socio.tokenQr`)
- `vigencia`: mes y año actuales (calculado al servir, no persistido)

### GET /verificar/:token (público, sin auth)
- Busca el socio por `Socio.tokenQr`
- Responde solo con datos no sensibles: nombre, apellido, fotoUrl, categoriaSocio, estadoMembresia, habilitacionEstacionamiento
- La URL embebida en el QR del carnet apunta a esta ruta

---

## 8. Módulo de Pagos / Archivo COELSA

### Arquitectura del módulo
```
pagos/
  pagos.routes.ts
  pagos.controller.ts
  pagos.service.ts
  coelsa.formatter.ts   ← TODO: layout real cuando se obtenga spec de Macro/Prisma
  coelsa.parser.ts      ← TODO: layout real cuando se obtenga spec de Macro/Prisma
```

### Flujo de generación
1. `PagosService.generarArchivoDebito(mes, anio)`
2. Busca cuotas `PENDIENTE` del período con método `DEBITO_AUTOMATICO`
3. Llama `CoelsaFormatter.generarLineas(cuotas[])` (único lugar con el layout real)
4. Persiste registro `ArchivoDebito` en BD
5. Devuelve stream/buffer para descarga

### Flujo de procesamiento de rendición
1. `PagosService.procesarRendicion(archivoDebitoId, fileBuffer)`
2. Parsea con `CoelsaParser.parsear(buffer)` (único lugar con el layout real)
3. Actualiza cada `Cuota` a `PAGADA` o `VENCIDA`
4. Recalcula `estadoMembresia` del socio si acumula ≥2 cuotas `VENCIDA`
5. Marca `ArchivoRendicion.procesado = true`
6. Stub de notificación al socio (loguea por ahora, se implementa con email/push después)

### TODOs explícitos
- `CoelsaFormatter.generarLineas()` — pendiente spec de Macro/Prisma
- `CoelsaParser.parsear()` — pendiente spec de Macro/Prisma
- Notificaciones al socio — stub que loguea
- Umbral de morosidad — hardcodeado en 2 cuotas vencidas, hacer configurable

---

## 9. Integración con Sistema de Gestión Externo

El sistema externo no expone API. La integración depende de obtener un archivo de muestra que genere ese sistema para entender su formato y construir un parser/importer.

```
integrations/
  external-system/
    parser.ts     ← TODO: implementar cuando se obtenga archivo de muestra
    importer.ts   ← hace upsert de socios/cuotas en BD a partir del archivo parseado
```

**Endpoint cuando esté listo:**
```
POST /admin/importar   [ADMIN]
  body: multipart/form-data { file }
  → parsea, valida, upsert, responde con resumen { creados, actualizados, errores[] }
```

Por ahora el módulo existe como estructura vacía con comentario `TODO`.

---

## 10. Módulos implementados en este chat (referencia)

| Módulo | Estado |
|---|---|
| auth (login/refresh/logout/me) | Implementado completo |
| socios + carnet + /verificar/:token | Implementado completo |
| solicitudes | Stub 501 |
| operativo | Stub 501 |
| boutique | Stub 501 |
| institucional | Stub 501 |
| pagos/COELSA | Arquitectura + stubs de formatter/parser |
| integración externa | Estructura + stub |
