import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { prisma, cleanDatabase } from "./helpers/prisma";

beforeEach(cleanDatabase);
afterAll(async () => prisma.$disconnect());

describe("Personas y autenticación", () => {
  it("creates a socio with a category and links a tutor to a menor without login", async () => {
    const categoria = await prisma.categoriaSocio.create({
      data: { nombre: "deportivo_rugby" }
    });

    const tutorUsuario = await prisma.usuario.create({
      data: { email: "tutor@example.com", passwordHash: "hash" }
    });

    const tutor = await prisma.socio.create({
      data: {
        usuarioId: tutorUsuario.id,
        numeroSocio: "0001",
        nombre: "Juan",
        apellido: "Perez",
        fechaNacimiento: new Date("1985-01-01"),
        categoriaSocioId: categoria.id
      }
    });

    const menor = await prisma.socio.create({
      data: {
        numeroSocio: "0002",
        nombre: "Pedro",
        apellido: "Perez",
        fechaNacimiento: new Date("2015-01-01"),
        categoriaSocioId: categoria.id,
        tutorId: tutor.id
      }
    });

    expect(menor.usuarioId).toBeNull();
    expect(menor.tutorId).toBe(tutor.id);

    const menorConTutor = await prisma.socio.findUniqueOrThrow({
      where: { id: menor.id },
      include: { tutor: true }
    });
    expect(menorConTutor.tutor?.id).toBe(tutor.id);
  });

  it("links two socios as a matrimonio group", async () => {
    const categoria = await prisma.categoriaSocio.create({
      data: { nombre: "matrimonio" }
    });
    const a = await prisma.socio.create({
      data: {
        numeroSocio: "0010",
        nombre: "Ana",
        apellido: "Gomez",
        fechaNacimiento: new Date("1980-01-01"),
        categoriaSocioId: categoria.id
      }
    });
    const b = await prisma.socio.create({
      data: {
        numeroSocio: "0011",
        nombre: "Luis",
        apellido: "Gomez",
        fechaNacimiento: new Date("1979-01-01"),
        categoriaSocioId: categoria.id
      }
    });

    const grupo = await prisma.grupoFamiliar.create({
      data: {
        tipo: "MATRIMONIO",
        miembros: { create: [{ socioId: a.id }, { socioId: b.id }] }
      },
      include: { miembros: true }
    });

    expect(grupo.miembros).toHaveLength(2);
  });

  it("rejects two roles with the same value for the same usuario", async () => {
    const usuario = await prisma.usuario.create({
      data: { email: "admin@example.com", passwordHash: "hash" }
    });
    await prisma.usuarioRol.create({ data: { usuarioId: usuario.id, rol: "ADMIN" } });

    await expect(
      prisma.usuarioRol.create({ data: { usuarioId: usuario.id, rol: "ADMIN" } })
    ).rejects.toThrow();
  });
});
