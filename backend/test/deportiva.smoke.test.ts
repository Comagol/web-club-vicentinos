// backend/test/deportiva.smoke.test.ts
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { prisma, cleanDatabase } from "./helpers/prisma";

beforeEach(cleanDatabase);
afterAll(async () => prisma.$disconnect());

describe("Organización deportiva", () => {
  it("tracks a socio's division across two seasons without losing history", async () => {
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "deportivo_rugby" } });
    const socio = await prisma.socio.create({
      data: {
        numeroSocio: "0100",
        nombre: "Mateo",
        apellido: "Diaz",
        fechaNacimiento: new Date("2012-01-01"),
        categoriaSocioId: categoria.id
      }
    });

    const m12 = await prisma.division.create({
      data: { deporte: "RUGBY", categoria: "M12", nivel: "INFANTILES" }
    });
    const m13 = await prisma.division.create({
      data: { deporte: "RUGBY", categoria: "M13", nivel: "INFANTILES" }
    });
    const temporada2025 = await prisma.temporada.create({ data: { anio: 2025 } });
    const temporada2026 = await prisma.temporada.create({ data: { anio: 2026 } });

    await prisma.socioDivisionTemporada.create({
      data: { socioId: socio.id, divisionId: m12.id, temporadaId: temporada2025.id }
    });
    await prisma.socioDivisionTemporada.create({
      data: { socioId: socio.id, divisionId: m13.id, temporadaId: temporada2026.id }
    });

    const historial = await prisma.socioDivisionTemporada.findMany({
      where: { socioId: socio.id },
      include: { division: true, temporada: true },
      orderBy: { temporada: { anio: "asc" } }
    });

    expect(historial).toHaveLength(2);
    expect(historial[0].division.categoria).toBe("M12");
    expect(historial[1].division.categoria).toBe("M13");
  });

  it("adds a socio as a member of a subcomisión", async () => {
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "activo" } });
    const socio = await prisma.socio.create({
      data: {
        numeroSocio: "0101",
        nombre: "Lucia",
        apellido: "Fernandez",
        fechaNacimiento: new Date("1990-01-01"),
        categoriaSocioId: categoria.id
      }
    });
    const subcomision = await prisma.subcomision.create({ data: { nombre: "Subcomisión de Hockey" } });

    await prisma.subcomisionMiembro.create({
      data: { subcomisionId: subcomision.id, socioId: socio.id }
    });

    const miembros = await prisma.subcomisionMiembro.findMany({ where: { subcomisionId: subcomision.id } });
    expect(miembros).toHaveLength(1);
  });
});
