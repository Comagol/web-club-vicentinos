# Backend Arquitectura Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Express backend skeleton with JWT auth (httpOnly cookies), RBAC middleware, and the socios/carnet module fully implemented as the reference pattern for all future modules.

**Architecture:** Express + TypeScript organized by domain module. Shared utilities (errors, validation, prisma singleton, asyncHandler) live in `src/shared/`. Each module folder (auth, socios, etc.) is self-contained with routes → controller → service → schemas. Modules not yet built expose a 501 stub router. Tests use Vitest + Supertest against the real Postgres DB, matching the existing `beforeEach(cleanDatabase)` pattern.

**Tech Stack:** Express 4, Zod 3, jsonwebtoken 9, bcryptjs 2, cookie-parser, helmet, cors, Supertest 7, tsx (dev server)

## Global Constraints

- Node.js + TypeScript, `"strict": true`, `"module": "CommonJS"`, `"target": "ES2022"`
- All async route handlers wrapped with `asyncHandler` — no bare try/catch in controllers
- Cookies: `httpOnly: true`, `secure: true` only in production, `sameSite: 'strict'`
- Error responses always shaped: `{ "error": { "message": "...", "code": "..." } }`
- Tests hit the real Postgres DB (docker-compose.yml already in place); no mocking
- `fileParallelism: false` in vitest (already configured); tests are sequential
- Prisma singleton imported from `src/shared/prisma.ts` (never instantiate PrismaClient elsewhere in src/)
- Test helper `cleanDatabase` imported from `test/helpers/prisma.ts` (already exists)

---

### Task 1: Project scaffolding, shared utilities, and stub structure

**Files:**
- Modify: `backend/package.json`
- Modify: `backend/tsconfig.json`
- Modify: `backend/.env`
- Modify: `backend/.env.example`
- Modify: `backend/vitest.config.ts`
- Create: `backend/src/config/env.ts`
- Create: `backend/src/shared/errors.ts`
- Create: `backend/src/shared/asyncHandler.ts`
- Create: `backend/src/shared/validate.ts`
- Create: `backend/src/shared/prisma.ts`
- Create: `backend/src/shared/errorHandler.ts`
- Create: `backend/src/shared/stubRouter.ts`
- Create: `backend/src/app.ts`
- Create: `backend/src/server.ts`
- Create: `backend/src/modules/auth/` (empty dir placeholder — populated in Task 2)
- Create: `backend/src/modules/socios/` (empty dir placeholder — populated in Task 3)
- Create: `backend/src/modules/solicitudes/solicitudes.routes.ts` (stub)
- Create: `backend/src/modules/operativo/operativo.routes.ts` (stub)
- Create: `backend/src/modules/boutique/boutique.routes.ts` (stub)
- Create: `backend/src/modules/institucional/institucional.routes.ts` (stub)
- Create: `backend/src/modules/pagos/coelsa.formatter.ts` (stub)
- Create: `backend/src/modules/pagos/coelsa.parser.ts` (stub)
- Create: `backend/src/modules/pagos/pagos.routes.ts` (stub)
- Create: `backend/src/integrations/external-system/parser.ts` (stub)
- Create: `backend/src/integrations/external-system/importer.ts` (stub)

**Interfaces:**
- Produces: `createApp()` from `src/app.ts` — used by `server.ts` and all smoke tests
- Produces: `AppError`, `NotFoundError`, `ForbiddenError`, `UnauthorizedError`, `ValidationError` from `src/shared/errors.ts`
- Produces: `asyncHandler(fn)` from `src/shared/asyncHandler.ts`
- Produces: `validate(schema)` from `src/shared/validate.ts`
- Produces: `prisma` singleton from `src/shared/prisma.ts`
- Produces: `errorHandler` from `src/shared/errorHandler.ts`

- [ ] **Step 1: Install dependencies**

```bash
cd backend
npm install express cors helmet cookie-parser jsonwebtoken bcryptjs zod
npm install --save-dev @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/bcryptjs @types/supertest supertest tsx
```

Expected: `package.json` updated, no errors.

- [ ] **Step 2: Update package.json scripts**

Replace the `scripts` section in `backend/package.json`:

```json
{
  "name": "vicentinos-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Update tsconfig.json to include src/**

Replace `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src", "test", "prisma"]
}
```

- [ ] **Step 4: Add JWT secrets to .env and .env.example**

Add to `backend/.env`:
```
JWT_ACCESS_SECRET=dev-access-secret-change-in-prod
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-prod
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

Add the same keys (without values) to `backend/.env.example`:
```
DATABASE_URL="postgresql://vicentinos:vicentinos@localhost:5432/vicentinos_dev?schema=public"
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

- [ ] **Step 5: Update vitest.config.ts to inject test env vars**

Replace `backend/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    testTimeout: 15000,
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
      JWT_ACCESS_SECRET: "test-access-secret",
      JWT_REFRESH_SECRET: "test-refresh-secret",
      PORT: "3001",
      CORS_ORIGIN: "http://localhost:5173",
    },
  },
});
```

- [ ] **Step 6: Create src/config/env.ts**

```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
```

- [ ] **Step 7: Create src/shared/errors.ts**

```ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string = "APP_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details: unknown[] = []) {
    super(message, 422, "VALIDATION_ERROR");
  }
}
```

- [ ] **Step 8: Create src/shared/asyncHandler.ts**

```ts
import { Request, Response, NextFunction } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler =
  (fn: AsyncFn) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
```

- [ ] **Step 9: Create src/shared/validate.ts**

```ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "./errors";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationError("Validation failed", err.errors));
      } else {
        next(err);
      }
    }
  };
```

- [ ] **Step 10: Create src/shared/prisma.ts**

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

- [ ] **Step 11: Create src/shared/errorHandler.ts**

```ts
import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError, ValidationError } from "./errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    res.status(422).json({
      error: { message: err.message, code: err.code, details: err.details },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: { message: "Not found", code: "NOT_FOUND" } });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ error: { message: "Already exists", code: "CONFLICT" } });
      return;
    }
  }

  console.error(err);
  res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
}
```

- [ ] **Step 12: Create src/shared/stubRouter.ts**

```ts
import { Router } from "express";

export function createStubRouter(): Router {
  const router = Router();
  router.all("*", (_req, res) => {
    res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } });
  });
  return router;
}
```

- [ ] **Step 13: Create stub module routes (solicitudes, operativo, boutique, institucional)**

`backend/src/modules/solicitudes/solicitudes.routes.ts`:
```ts
export { createStubRouter as solicitudesRouter } from "../../shared/stubRouter";
```

Wait — that won't work as a named export alias. Use this pattern instead.

`backend/src/modules/solicitudes/solicitudes.routes.ts`:
```ts
import { createStubRouter } from "../../shared/stubRouter";
export const solicitudesRouter = createStubRouter();
```

`backend/src/modules/operativo/operativo.routes.ts`:
```ts
import { createStubRouter } from "../../shared/stubRouter";
export const operativoRouter = createStubRouter();
```

`backend/src/modules/boutique/boutique.routes.ts`:
```ts
import { createStubRouter } from "../../shared/stubRouter";
export const boutiqueRouter = createStubRouter();
```

`backend/src/modules/institucional/institucional.routes.ts`:
```ts
import { createStubRouter } from "../../shared/stubRouter";
export const institucionalRouter = createStubRouter();
```

- [ ] **Step 14: Create pagos stubs**

`backend/src/modules/pagos/coelsa.formatter.ts`:
```ts
// TODO: implement once Banco Macro / Prisma COELSA spec is obtained.
// Input: cuotas with socio CBU data; Output: file buffer in COELSA layout.
export function generarLineas(_cuotas: unknown[]): Buffer {
  throw new Error("CoelsaFormatter not implemented: awaiting COELSA spec from Banco Macro / Prisma");
}
```

`backend/src/modules/pagos/coelsa.parser.ts`:
```ts
// TODO: implement once Banco Macro / Prisma COELSA rendicion spec is obtained.
// Input: rendicion file buffer; Output: array of { cbu, resultado: 'PAGADA' | 'VENCIDA' }.
export function parsear(_buffer: Buffer): { cbu: string; resultado: "PAGADA" | "VENCIDA" }[] {
  throw new Error("CoelsaParser not implemented: awaiting rendicion spec from Banco Macro / Prisma");
}
```

`backend/src/modules/pagos/pagos.routes.ts`:
```ts
import { createStubRouter } from "../../shared/stubRouter";
export const pagosRouter = createStubRouter();
```

- [ ] **Step 15: Create integration stubs**

`backend/src/integrations/external-system/parser.ts`:
```ts
// TODO: implement once a sample file from the external management system is obtained.
export function parseExternalFile(_buffer: Buffer): unknown[] {
  throw new Error("ExternalSystemParser not implemented: awaiting sample file");
}
```

`backend/src/integrations/external-system/importer.ts`:
```ts
// TODO: wire up once parser is implemented.
// Performs upsert of socios/cuotas from parsed external system data.
export async function importFromFile(_buffer: Buffer): Promise<{ creados: number; actualizados: number; errores: string[] }> {
  throw new Error("ExternalSystemImporter not implemented");
}
```

- [ ] **Step 16: Write the failing health-check test**

Create `backend/test/app.smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

describe("App", () => {
  it("GET /health returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("unknown route returns 501 for stub modules", async () => {
    const res = await request(app).get("/solicitudes/anything");
    expect(res.status).toBe(501);
  });
});
```

- [ ] **Step 17: Run the test — expect it to FAIL (app.ts not created yet)**

```bash
cd backend && npm test -- --reporter=verbose 2>&1 | head -40
```

Expected: compile error or `Cannot find module '../src/app'`.

- [ ] **Step 18: Create src/app.ts**

This file imports auth and socios routers but they don't exist yet. Use a try/require pattern — no, that's messy. Instead, create temporary placeholder exports now:

Create `backend/src/modules/auth/auth.routes.ts` (temporary, will be replaced in Task 2):
```ts
import { Router } from "express";
export const authRouter = Router();
authRouter.all("*", (_req, res) => res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } }));
```

Create `backend/src/modules/socios/socios.routes.ts` (temporary, will be replaced in Task 3):
```ts
import { Router } from "express";
export const sociosRouter = Router();
sociosRouter.all("*", (_req, res) => res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } }));
```

Create `backend/src/modules/socios/verificar.routes.ts` (temporary, will be replaced in Task 3):
```ts
import { Router } from "express";
export const verificarRouter = Router();
verificarRouter.all("*", (_req, res) => res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } }));
```

Now create `backend/src/app.ts`:
```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./shared/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { sociosRouter } from "./modules/socios/socios.routes";
import { verificarRouter } from "./modules/socios/verificar.routes";
import { solicitudesRouter } from "./modules/solicitudes/solicitudes.routes";
import { operativoRouter } from "./modules/operativo/operativo.routes";
import { boutiqueRouter } from "./modules/boutique/boutique.routes";
import { institucionalRouter } from "./modules/institucional/institucional.routes";
import { pagosRouter } from "./modules/pagos/pagos.routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/auth", authRouter);
  app.use("/verificar", verificarRouter);
  app.use("/socios", sociosRouter);
  app.use("/solicitudes", solicitudesRouter);
  app.use("/tareas", operativoRouter);
  app.use("/productos", boutiqueRouter);
  app.use("/pedidos", boutiqueRouter);
  app.use("/noticias", institucionalRouter);
  app.use("/resultados", institucionalRouter);
  app.use("/pagos", pagosRouter);

  app.use(errorHandler);

  return app;
}
```

- [ ] **Step 19: Create src/server.ts**

```ts
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();
app.listen(Number(env.PORT), () => {
  console.log(`Server running on port ${env.PORT}`);
});
```

- [ ] **Step 20: Run the health-check test — expect PASS**

```bash
cd backend && npm test -- --reporter=verbose 2>&1 | grep -E "PASS|FAIL|✓|✗|Error"
```

Expected: `GET /health returns 200` PASS, `unknown route returns 501` PASS.

- [ ] **Step 21: Commit**

```bash
cd backend && git add -A && git commit -m "feat: express scaffolding, shared utilities, stub modules"
```

---

### Task 2: Auth module (login / refresh / logout / me)

**Files:**
- Replace: `backend/src/modules/auth/auth.routes.ts` (was temporary stub)
- Create: `backend/src/modules/auth/jwt.ts`
- Create: `backend/src/modules/auth/rbac.ts`
- Create: `backend/src/modules/auth/auth.schemas.ts`
- Create: `backend/src/modules/auth/auth.service.ts`
- Create: `backend/src/modules/auth/auth.controller.ts`
- Create: `backend/test/auth.smoke.test.ts`

**Interfaces:**
- Consumes: `AppError`, `UnauthorizedError`, `ForbiddenError` from `src/shared/errors.ts`
- Consumes: `asyncHandler` from `src/shared/asyncHandler.ts`
- Consumes: `validate` from `src/shared/validate.ts`
- Consumes: `prisma` from `src/shared/prisma.ts`
- Consumes: `env` from `src/config/env.ts`
- Produces: `requireAuth` middleware from `src/modules/auth/rbac.ts` — attaches `req.user: { sub: string, email: string, roles: string[] }`
- Produces: `requireRole(...roles: string[])` middleware factory from `src/modules/auth/rbac.ts`
- Produces: `AccessPayload` type from `src/modules/auth/jwt.ts`

- [ ] **Step 1: Write the failing auth smoke tests**

Create `backend/test/auth.smoke.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createApp } from "../src/app";
import { prisma, cleanDatabase } from "./helpers/prisma";

const app = createApp();

beforeEach(cleanDatabase);
afterAll(() => prisma.$disconnect());

async function createUsuario(email: string, password: string, rol: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  const usuario = await prisma.usuario.create({ data: { email, passwordHash } });
  await prisma.usuarioRol.create({ data: { usuarioId: usuario.id, rol: rol as any } });
  return usuario;
}

describe("POST /auth/login", () => {
  it("returns 200 with usuario and sets httpOnly cookies for valid credentials", async () => {
    await createUsuario("socio@example.com", "pass123", "SOCIO");

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "socio@example.com", password: "pass123" });

    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe("socio@example.com");
    expect(res.body.usuario.roles).toContain("SOCIO");
    const cookies: string[] = res.headers["set-cookie"] ?? [];
    expect(cookies.some((c) => c.startsWith("accessToken="))).toBe(true);
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
    expect(cookies.every((c) => c.includes("HttpOnly"))).toBe(true);
  });

  it("returns 401 for wrong password", async () => {
    await createUsuario("user@example.com", "correct", "SOCIO");

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@example.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 for unknown email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ghost@example.com", password: "pass" });

    expect(res.status).toBe(401);
  });

  it("returns 422 for missing email", async () => {
    const res = await request(app).post("/auth/login").send({ password: "pass" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /auth/me", () => {
  it("returns 401 without cookie", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns authenticated user data when cookie is valid", async () => {
    await createUsuario("admin@example.com", "pass", "ADMIN");

    const login = await request(app)
      .post("/auth/login")
      .send({ email: "admin@example.com", password: "pass" });
    const cookies: string[] = login.headers["set-cookie"];

    const res = await request(app).get("/auth/me").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe("admin@example.com");
    expect(res.body.usuario.roles).toContain("ADMIN");
  });
});

describe("POST /auth/refresh", () => {
  it("issues new tokens when refresh cookie is valid", async () => {
    await createUsuario("refresh@example.com", "pass", "SOCIO");

    const login = await request(app)
      .post("/auth/login")
      .send({ email: "refresh@example.com", password: "pass" });
    const cookies: string[] = login.headers["set-cookie"];

    const res = await request(app).post("/auth/refresh").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    const newCookies: string[] = res.headers["set-cookie"] ?? [];
    expect(newCookies.some((c) => c.startsWith("accessToken="))).toBe(true);
  });

  it("returns 401 without refresh cookie", async () => {
    const res = await request(app).post("/auth/refresh");
    expect(res.status).toBe(401);
  });
});

describe("POST /auth/logout", () => {
  it("clears auth cookies", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.status).toBe(200);
    const cookies: string[] = res.headers["set-cookie"] ?? [];
    expect(cookies.some((c) => c.includes("accessToken=;") || c.includes("accessToken=;"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (auth routes still stub)**

```bash
cd backend && npm test test/auth.smoke.test.ts -- --reporter=verbose 2>&1 | tail -20
```

Expected: `POST /auth/login returns 200...` FAIL — status 501.

- [ ] **Step 3: Create src/modules/auth/jwt.ts**

```ts
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export interface AccessPayload {
  sub: string;
  email: string;
  roles: string[];
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(sub: string): string {
  return jwt.sign({ sub }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
}
```

- [ ] **Step 4: Create src/modules/auth/rbac.ts**

```ts
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../../shared/errors";
import { verifyAccessToken, AccessPayload } from "./jwt";

declare global {
  namespace Express {
    interface Request {
      user?: AccessPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    next(new UnauthorizedError());
    return;
  }
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedError("Token inválido o expirado"));
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRoles = req.user?.roles ?? [];
    if (!roles.some((r) => userRoles.includes(r))) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}
```

- [ ] **Step 5: Create src/modules/auth/auth.schemas.ts**

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

- [ ] **Step 6: Create src/modules/auth/auth.service.ts**

```ts
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { UnauthorizedError } from "../../shared/errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken, AccessPayload } from "./jwt";

export async function login(email: string, password: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!usuario || !usuario.activo) throw new UnauthorizedError("Credenciales inválidas");

  const valid = await bcrypt.compare(password, usuario.passwordHash);
  if (!valid) throw new UnauthorizedError("Credenciales inválidas");

  const roles = usuario.roles.map((r) => r.rol as string);
  const payload: AccessPayload = { sub: usuario.id, email: usuario.email, roles };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(usuario.id),
    usuario: { id: usuario.id, email: usuario.email, roles },
  };
}

export async function refresh(refreshToken: string) {
  const { sub } = verifyRefreshToken(refreshToken);

  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: sub },
    include: { roles: true },
  });

  const roles = usuario.roles.map((r) => r.rol as string);
  const payload: AccessPayload = { sub: usuario.id, email: usuario.email, roles };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(usuario.id),
  };
}
```

- [ ] **Step 7: Create src/modules/auth/auth.controller.ts**

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { UnauthorizedError } from "../../shared/errors";
import * as authService from "./auth.service";

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, usuario } = await authService.login(
    req.body.email,
    req.body.password
  );
  res.cookie("accessToken", accessToken, { ...COOKIE_BASE, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...COOKIE_BASE, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ usuario });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) throw new UnauthorizedError();
  const { accessToken, refreshToken } = await authService.refresh(token);
  res.cookie("accessToken", accessToken, { ...COOKIE_BASE, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...COOKIE_BASE, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ ok: true });
});

export const logoutHandler = (_req: Request, res: Response): void => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ usuario: req.user });
});
```

- [ ] **Step 8: Replace src/modules/auth/auth.routes.ts (was temporary stub)**

```ts
import { Router } from "express";
import { validate } from "../../shared/validate";
import { requireAuth } from "./rbac";
import { loginSchema } from "./auth.schemas";
import { loginHandler, refreshHandler, logoutHandler, meHandler } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), loginHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", requireAuth, meHandler);
```

- [ ] **Step 9: Run auth tests — expect all PASS**

```bash
cd backend && npm test test/auth.smoke.test.ts -- --reporter=verbose 2>&1 | tail -30
```

Expected: all 8 auth tests PASS.

- [ ] **Step 10: Run full test suite to confirm no regressions**

```bash
cd backend && npm test -- --reporter=verbose 2>&1 | tail -20
```

Expected: all previous smoke tests still PASS plus auth tests PASS.

- [ ] **Step 11: Commit**

```bash
cd backend && git add -A && git commit -m "feat: auth module with JWT cookies, requireAuth and requireRole middlewares"
```

---

### Task 3: Socios module + carnet digital + /verificar/:token

**Files:**
- Replace: `backend/src/modules/socios/socios.routes.ts` (was temporary stub)
- Replace: `backend/src/modules/socios/verificar.routes.ts` (was temporary stub)
- Create: `backend/src/modules/socios/socios.schemas.ts`
- Create: `backend/src/modules/socios/socios.service.ts`
- Create: `backend/src/modules/socios/socios.controller.ts`
- Create: `backend/test/socios-carnet.smoke.test.ts`

**Interfaces:**
- Consumes: `requireAuth`, `requireRole` from `src/modules/auth/rbac.ts`
- Consumes: `AccessPayload` from `src/modules/auth/jwt.ts`
- Consumes: `asyncHandler` from `src/shared/asyncHandler.ts`
- Consumes: `validate` from `src/shared/validate.ts`
- Consumes: `prisma` from `src/shared/prisma.ts`
- Consumes: `NotFoundError`, `ForbiddenError` from `src/shared/errors.ts`

- [ ] **Step 1: Write the failing socios smoke tests**

Create `backend/test/socios-carnet.smoke.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createApp } from "../src/app";
import { prisma, cleanDatabase } from "./helpers/prisma";

const app = createApp();

beforeEach(cleanDatabase);
afterAll(() => prisma.$disconnect());

async function loginAs(email: string, password: string, rol: string): Promise<string[]> {
  const passwordHash = await bcrypt.hash(password, 12);
  const usuario = await prisma.usuario.create({ data: { email, passwordHash } });
  await prisma.usuarioRol.create({ data: { usuarioId: usuario.id, rol: rol as any } });
  const res = await request(app).post("/auth/login").send({ email, password });
  return res.headers["set-cookie"] as string[];
}

async function loginAsWithId(email: string, password: string, rol: string): Promise<{ cookies: string[]; usuarioId: string }> {
  const passwordHash = await bcrypt.hash(password, 12);
  const usuario = await prisma.usuario.create({ data: { email, passwordHash } });
  await prisma.usuarioRol.create({ data: { usuarioId: usuario.id, rol: rol as any } });
  const res = await request(app).post("/auth/login").send({ email, password });
  return { cookies: res.headers["set-cookie"] as string[], usuarioId: usuario.id };
}

describe("GET /socios", () => {
  it("returns 401 without auth", async () => {
    const res = await request(app).get("/socios");
    expect(res.status).toBe(401);
  });

  it("returns 403 for SOCIO role", async () => {
    const cookies = await loginAs("socio@example.com", "pass", "SOCIO");
    const res = await request(app).get("/socios").set("Cookie", cookies);
    expect(res.status).toBe(403);
  });

  it("returns 200 with socios array for ADMIN", async () => {
    const cookies = await loginAs("admin@example.com", "pass", "ADMIN");
    const res = await request(app).get("/socios").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.socios)).toBe(true);
  });
});

describe("POST /socios", () => {
  it("returns 401 without auth", async () => {
    const res = await request(app).post("/socios").send({});
    expect(res.status).toBe(401);
  });

  it("creates a socio and returns 201", async () => {
    const cookies = await loginAs("admin@example.com", "pass", "ADMIN");
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "deportivo_rugby" } });

    const res = await request(app)
      .post("/socios")
      .set("Cookie", cookies)
      .send({
        nombre: "Juan",
        apellido: "Pérez",
        fechaNacimiento: "1990-01-01T00:00:00.000Z",
        numeroSocio: "0001",
        categoriaSocioId: categoria.id,
      });

    expect(res.status).toBe(201);
    expect(res.body.socio.nombre).toBe("Juan");
    expect(res.body.socio.numeroSocio).toBe("0001");
    expect(res.body.socio.tokenQr).toBeDefined();
  });

  it("returns 422 for missing required fields", async () => {
    const cookies = await loginAs("admin2@example.com", "pass", "ADMIN");
    const res = await request(app).post("/socios").set("Cookie", cookies).send({ nombre: "Solo" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /socios/:id/carnet", () => {
  it("returns carnet data for ADMIN", async () => {
    const cookies = await loginAs("admin@example.com", "pass", "ADMIN");
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "deportivo_hockey" } });

    const created = await request(app)
      .post("/socios")
      .set("Cookie", cookies)
      .send({
        nombre: "Ana",
        apellido: "García",
        fechaNacimiento: "1995-06-15T00:00:00.000Z",
        numeroSocio: "0002",
        categoriaSocioId: categoria.id,
      });

    const socioId = created.body.socio.id;
    const res = await request(app).get(`/socios/${socioId}/carnet`).set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body.carnet.nombre).toBe("Ana");
    expect(res.body.carnet.apellido).toBe("García");
    expect(res.body.carnet.habilitacionEstacionamiento).toBe(true);
    expect(res.body.carnet.tokenQr).toBeDefined();
    expect(res.body.carnet.vigencia).toHaveProperty("mes");
    expect(res.body.carnet.vigencia).toHaveProperty("anio");
  });

  it("returns 403 when SOCIO requests carnet not linked to their account", async () => {
    const adminCookies = await loginAs("admin@example.com", "pass", "ADMIN");
    const socioCookies = await loginAs("socio@example.com", "pass", "SOCIO");
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "no_deportivo" } });

    const created = await request(app)
      .post("/socios")
      .set("Cookie", adminCookies)
      .send({
        nombre: "Otro",
        apellido: "Socio",
        fechaNacimiento: "1985-01-01T00:00:00.000Z",
        numeroSocio: "0003",
        categoriaSocioId: categoria.id,
      });

    const socioId = created.body.socio.id;
    const res = await request(app).get(`/socios/${socioId}/carnet`).set("Cookie", socioCookies);
    expect(res.status).toBe(403);
  });

  it("SOCIO can access their own carnet when linked to the socio record", async () => {
    const { cookies, usuarioId } = await loginAsWithId("misocio@example.com", "pass", "SOCIO");
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "deportivo_rugby" } });

    const socio = await prisma.socio.create({
      data: {
        nombre: "Mi",
        apellido: "Socio",
        fechaNacimiento: new Date("2000-01-01"),
        numeroSocio: "0010",
        categoriaSocioId: categoria.id,
        usuarioId,
      },
    });

    const res = await request(app).get(`/socios/${socio.id}/carnet`).set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.carnet.nombre).toBe("Mi");
  });

  it("returns 404 for unknown socio id", async () => {
    const cookies = await loginAs("admin@example.com", "pass", "ADMIN");
    const res = await request(app)
      .get("/socios/00000000-0000-0000-0000-000000000000/carnet")
      .set("Cookie", cookies);
    expect(res.status).toBe(404);
  });
});

describe("GET /verificar/:token", () => {
  it("returns public carnet data without auth", async () => {
    const cookies = await loginAs("admin@example.com", "pass", "ADMIN");
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "deportivo_rugby" } });

    const created = await request(app)
      .post("/socios")
      .set("Cookie", cookies)
      .send({
        nombre: "Carlos",
        apellido: "López",
        fechaNacimiento: "1988-03-20T00:00:00.000Z",
        numeroSocio: "0005",
        categoriaSocioId: categoria.id,
      });

    const { tokenQr } = created.body.socio;

    const res = await request(app).get(`/verificar/${tokenQr}`);
    expect(res.status).toBe(200);
    expect(res.body.carnet.nombre).toBe("Carlos");
    expect(res.body.carnet.estadoMembresia).toBeDefined();
    expect(res.body.carnet.habilitacionEstacionamiento).toBe(true);
    expect(res.body.carnet).not.toHaveProperty("tokenQr");
    expect(res.body.carnet).not.toHaveProperty("numeroSocio");
  });

  it("returns 404 for unknown token", async () => {
    const res = await request(app).get("/verificar/token-desconocido");
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (socios routes still stub)**

```bash
cd backend && npm test test/socios-carnet.smoke.test.ts -- --reporter=verbose 2>&1 | tail -20
```

Expected: all tests FAIL with status 501.

- [ ] **Step 3: Create src/modules/socios/socios.schemas.ts**

```ts
import { z } from "zod";

export const createSocioSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  fechaNacimiento: z.string().datetime(),
  numeroSocio: z.string().min(1),
  categoriaSocioId: z.string().uuid(),
  usuarioId: z.string().uuid().optional(),
  tutorId: z.string().uuid().optional(),
  fotoUrl: z.string().url().optional(),
});

export const updateSocioSchema = createSocioSchema.partial();

export type CreateSocioInput = z.infer<typeof createSocioSchema>;
export type UpdateSocioInput = z.infer<typeof updateSocioSchema>;
```

- [ ] **Step 4: Create src/modules/socios/socios.service.ts**

```ts
import { prisma } from "../../shared/prisma";
import { NotFoundError, ForbiddenError } from "../../shared/errors";
import { AccessPayload } from "../auth/jwt";
import { CreateSocioInput, UpdateSocioInput } from "./socios.schemas";

export async function getSocios(filters: { nombre?: string; estado?: string }) {
  return prisma.socio.findMany({
    where: {
      ...(filters.nombre && {
        nombre: { contains: filters.nombre, mode: "insensitive" },
      }),
      ...(filters.estado && { estadoMembresia: filters.estado as any }),
    },
    include: { categoriaSocio: true },
    orderBy: { apellido: "asc" },
  });
}

export async function getSocioById(id: string) {
  return prisma.socio.findUniqueOrThrow({
    where: { id },
    include: {
      categoriaSocio: true,
      usuario: { select: { email: true, activo: true } },
    },
  });
}

export async function getCarnet(id: string, requester: AccessPayload) {
  const canSeeAny =
    requester.roles.includes("ADMIN") ||
    requester.roles.includes("COMISION_DIRECTIVA");

  if (!canSeeAny) {
    const linked = await prisma.socio.findUnique({
      where: { id, usuarioId: requester.sub },
    });
    if (!linked) throw new ForbiddenError();
  }

  const socio = await prisma.socio.findUniqueOrThrow({
    where: { id },
    include: { categoriaSocio: true },
  });

  const habilitacionEstacionamiento = await calcularHabilitacionEstacionamiento(id);
  const now = new Date();

  return {
    nombre: socio.nombre,
    apellido: socio.apellido,
    fotoUrl: socio.fotoUrl,
    numeroSocio: socio.numeroSocio,
    categoria: socio.categoriaSocio.nombre,
    estadoMembresia: socio.estadoMembresia,
    habilitacionEstacionamiento,
    tokenQr: socio.tokenQr,
    vigencia: { mes: now.getMonth() + 1, anio: now.getFullYear() },
  };
}

export async function getCarnetPublico(token: string) {
  const socio = await prisma.socio.findUnique({
    where: { tokenQr: token },
    include: { categoriaSocio: true },
  });
  if (!socio) throw new NotFoundError("Token inválido");

  const habilitacionEstacionamiento = await calcularHabilitacionEstacionamiento(socio.id);

  return {
    nombre: socio.nombre,
    apellido: socio.apellido,
    fotoUrl: socio.fotoUrl,
    categoria: socio.categoriaSocio.nombre,
    estadoMembresia: socio.estadoMembresia,
    habilitacionEstacionamiento,
  };
}

async function calcularHabilitacionEstacionamiento(socioId: string): Promise<boolean> {
  const now = new Date();
  const periods = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { mes: d.getMonth() + 1, anio: d.getFullYear() };
  });

  const vencidas = await prisma.cuota.count({
    where: {
      socioId,
      estado: "VENCIDA",
      OR: periods.map((p) => ({ mes: p.mes, anio: p.anio })),
    },
  });

  return vencidas === 0;
}

export async function createSocio(data: CreateSocioInput) {
  return prisma.socio.create({
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      fechaNacimiento: new Date(data.fechaNacimiento),
      numeroSocio: data.numeroSocio,
      categoriaSocioId: data.categoriaSocioId,
      usuarioId: data.usuarioId,
      tutorId: data.tutorId,
      fotoUrl: data.fotoUrl,
    },
    include: { categoriaSocio: true },
  });
}

export async function updateSocio(id: string, data: UpdateSocioInput) {
  return prisma.socio.update({
    where: { id },
    data: {
      ...data,
      ...(data.fechaNacimiento && { fechaNacimiento: new Date(data.fechaNacimiento) }),
    },
    include: { categoriaSocio: true },
  });
}

export async function getCuotas(socioId: string) {
  await prisma.socio.findUniqueOrThrow({ where: { id: socioId } });
  return prisma.cuota.findMany({
    where: { socioId },
    orderBy: [{ anio: "desc" }, { mes: "desc" }],
  });
}
```

- [ ] **Step 5: Create src/modules/socios/socios.controller.ts**

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import * as sociosService from "./socios.service";

export const getSociosHandler = asyncHandler(async (req: Request, res: Response) => {
  const { nombre, estado } = req.query as Record<string, string>;
  const socios = await sociosService.getSocios({ nombre, estado });
  res.json({ socios });
});

export const getSocioByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const socio = await sociosService.getSocioById(req.params.id);
  res.json({ socio });
});

export const getCarnetHandler = asyncHandler(async (req: Request, res: Response) => {
  const carnet = await sociosService.getCarnet(req.params.id, req.user!);
  res.json({ carnet });
});

export const createSocioHandler = asyncHandler(async (req: Request, res: Response) => {
  const socio = await sociosService.createSocio(req.body);
  res.status(201).json({ socio });
});

export const updateSocioHandler = asyncHandler(async (req: Request, res: Response) => {
  const socio = await sociosService.updateSocio(req.params.id, req.body);
  res.json({ socio });
});

export const getCuotasHandler = asyncHandler(async (req: Request, res: Response) => {
  const cuotas = await sociosService.getCuotas(req.params.id);
  res.json({ cuotas });
});

export const getCarnetPublicoHandler = asyncHandler(async (req: Request, res: Response) => {
  const carnet = await sociosService.getCarnetPublico(req.params.token);
  res.json({ carnet });
});
```

- [ ] **Step 6: Replace src/modules/socios/socios.routes.ts**

```ts
import { Router } from "express";
import { requireAuth, requireRole } from "../auth/rbac";
import { validate } from "../../shared/validate";
import { createSocioSchema, updateSocioSchema } from "./socios.schemas";
import {
  getSociosHandler,
  getSocioByIdHandler,
  getCarnetHandler,
  createSocioHandler,
  updateSocioHandler,
  getCuotasHandler,
} from "./socios.controller";

export const sociosRouter = Router();

sociosRouter.get("/", requireAuth, requireRole("ADMIN", "COMISION_DIRECTIVA"), getSociosHandler);
sociosRouter.post("/", requireAuth, requireRole("ADMIN"), validate(createSocioSchema), createSocioHandler);
sociosRouter.get("/:id", requireAuth, requireRole("ADMIN", "COMISION_DIRECTIVA"), getSocioByIdHandler);
sociosRouter.patch("/:id", requireAuth, requireRole("ADMIN"), validate(updateSocioSchema), updateSocioHandler);
sociosRouter.get("/:id/cuotas", requireAuth, requireRole("ADMIN", "COMISION_DIRECTIVA"), getCuotasHandler);
sociosRouter.get("/:id/carnet", requireAuth, getCarnetHandler);
```

- [ ] **Step 7: Replace src/modules/socios/verificar.routes.ts**

```ts
import { Router } from "express";
import { getCarnetPublicoHandler } from "./socios.controller";

export const verificarRouter = Router();
verificarRouter.get("/:token", getCarnetPublicoHandler);
```

- [ ] **Step 8: Run socios tests — expect all PASS**

```bash
cd backend && npm test test/socios-carnet.smoke.test.ts -- --reporter=verbose 2>&1 | tail -30
```

Expected: all socios-carnet tests PASS.

- [ ] **Step 9: Run full test suite — expect all PASS**

```bash
cd backend && npm test -- --reporter=verbose 2>&1 | tail -30
```

Expected: all tests across all smoke test files PASS. Zero failures.

- [ ] **Step 10: Commit**

```bash
cd backend && git add -A && git commit -m "feat: socios module with carnet digital and public /verificar/:token endpoint"
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered by |
|---|---|
| Stack (Express, Prisma, Zod, bcrypt, helmet, CORS) | Task 1 |
| Folder structure by domain module | Task 1 |
| JWT access + refresh in httpOnly cookies | Task 2 |
| `requireAuth` + `requireRole` middlewares | Task 2 |
| RBAC layer 1 (middleware) + layer 2 (service) | Task 2 (middleware), Task 3 (ownership in service) |
| AppError hierarchy + centralized error handler | Task 1 |
| Zod validation middleware | Task 1 |
| Prisma error mapping (P2025 → 404, P2002 → 409) | Task 1 |
| `GET /socios/:id/carnet` with ownership check | Task 3 |
| `GET /verificar/:token` public, no auth | Task 3 |
| `habilitacionEstacionamiento` derived from cuotas (last 3 months) | Task 3 |
| `tokenQr` not in public carnet response | Task 3 (service returns only public fields) |
| Stub routes for solicitudes, operativo, boutique, institucional | Task 1 |
| `CoelsaFormatter`/`CoelsaParser` as explicit stubs | Task 1 |
| External system integration as stub | Task 1 |
| `POST /pagos/rendicion` and `GET /pagos/debito/archivo` | Stub in Task 1 (pagos.routes.ts = stubRouter) |

**No placeholders:** All code blocks are complete. No TBD or TODO in task steps.

**Type consistency:** `AccessPayload` defined in `jwt.ts` (Task 2), used in `rbac.ts` (Task 2) and `socios.service.ts` (Task 3). `CreateSocioInput`/`UpdateSocioInput` defined in `socios.schemas.ts`, used in `socios.service.ts`. `authRouter`/`sociosRouter`/`verificarRouter` exports match exact names imported in `app.ts`.
