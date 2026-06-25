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
    const cookies: string[] = (res.headers["set-cookie"] as unknown as string[]) ?? [];
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

  it("returns 401 for deactivated user", async () => {
    const passwordHash = await bcrypt.hash("pass", 12);
    await prisma.usuario.create({
      data: { email: "inactive@example.com", passwordHash, activo: false },
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "inactive@example.com", password: "pass" });

    expect(res.status).toBe(401);
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
    const cookies: string[] = (login.headers["set-cookie"] as unknown as string[]) ?? [];

    const res = await request(app).get("/auth/me").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe("admin@example.com");
    expect(res.body.usuario.roles).toContain("ADMIN");
    expect(res.body.usuario.id).toBeDefined();
    expect(res.body.usuario.sub).toBeUndefined();
    expect(res.body.usuario.iat).toBeUndefined();
  });
});

describe("POST /auth/refresh", () => {
  it("issues new tokens when refresh cookie is valid", async () => {
    await createUsuario("refresh@example.com", "pass", "SOCIO");

    const login = await request(app)
      .post("/auth/login")
      .send({ email: "refresh@example.com", password: "pass" });
    const cookies: string[] = (login.headers["set-cookie"] as unknown as string[]) ?? [];

    const res = await request(app).post("/auth/refresh").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    const newCookies: string[] = (res.headers["set-cookie"] as unknown as string[]) ?? [];
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
    const cookies: string[] = (res.headers["set-cookie"] as unknown as string[]) ?? [];
    expect(cookies.some((c) => c.includes("accessToken=;") || c.includes("refreshToken=;"))).toBe(true);
  });
});
