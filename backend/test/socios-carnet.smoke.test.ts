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
  return (res.headers["set-cookie"] as unknown as string[]) ?? [];
}

async function loginAsWithId(email: string, password: string, rol: string): Promise<{ cookies: string[]; usuarioId: string }> {
  const passwordHash = await bcrypt.hash(password, 12);
  const usuario = await prisma.usuario.create({ data: { email, passwordHash } });
  await prisma.usuarioRol.create({ data: { usuarioId: usuario.id, rol: rol as any } });
  const res = await request(app).post("/auth/login").send({ email, password });
  return { cookies: (res.headers["set-cookie"] as unknown as string[]) ?? [], usuarioId: usuario.id };
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
