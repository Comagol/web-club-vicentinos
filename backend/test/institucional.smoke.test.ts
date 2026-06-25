// backend/test/institucional.smoke.test.ts
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { prisma, cleanDatabase } from "./helpers/prisma";

beforeEach(cleanDatabase);
afterAll(async () => prisma.$disconnect());

describe("Institucional, noticias y resultados", () => {
  it("publishes a noticia authored by a usuario", async () => {
    const autor = await prisma.usuario.create({
      data: { email: "prensa@example.com", passwordHash: "hash" }
    });

    const noticia = await prisma.noticia.create({
      data: {
        titulo: "El primer equipo gana el clásico",
        contenido: "Resumen del partido...",
        autorUsuarioId: autor.id,
        publicado: true
      }
    });

    expect(noticia.publicado).toBe(true);
  });

  it("records a resultado for a division in a temporada", async () => {
    const division = await prisma.division.create({
      data: { deporte: "HOCKEY", categoria: "Primera", nivel: "PLANTEL_SUPERIOR", tira: "A" }
    });
    const temporada = await prisma.temporada.create({ data: { anio: 2026 } });

    const resultado = await prisma.resultado.create({
      data: {
        divisionId: division.id,
        temporadaId: temporada.id,
        rival: "Club Rival",
        fecha: new Date("2026-05-10"),
        condicion: "LOCAL",
        resultadoPropio: 3,
        resultadoRival: 1
      }
    });

    expect(resultado.resultadoPropio).toBeGreaterThan(resultado.resultadoRival);
  });
});
