// backend/test/cuotas.smoke.test.ts
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { prisma, cleanDatabase } from "./helpers/prisma";

beforeEach(cleanDatabase);
afterAll(async () => prisma.$disconnect());

async function crearSocio(numeroSocio: string) {
  const categoria = await prisma.categoriaSocio.create({ data: { nombre: `cat-${numeroSocio}` } });
  return prisma.socio.create({
    data: {
      numeroSocio,
      nombre: "Test",
      apellido: "Socio",
      fechaNacimiento: new Date("1990-01-01"),
      categoriaSocioId: categoria.id
    }
  });
}

describe("Cuotas y pagos", () => {
  it("rejects a duplicate cuota for the same socio, mes and año", async () => {
    const socio = await crearSocio("0200");
    await prisma.cuota.create({
      data: {
        socioId: socio.id,
        mes: 6,
        anio: 2026,
        monto: 15000,
        fechaVencimiento: new Date("2026-06-10")
      }
    });

    await expect(
      prisma.cuota.create({
        data: {
          socioId: socio.id,
          mes: 6,
          anio: 2026,
          monto: 15000,
          fechaVencimiento: new Date("2026-06-10")
        }
      })
    ).rejects.toThrow();
  });

  it("approves a cuota via a Mercado Pago payment", async () => {
    const socio = await crearSocio("0201");
    const cuota = await prisma.cuota.create({
      data: {
        socioId: socio.id,
        mes: 6,
        anio: 2026,
        monto: 15000,
        fechaVencimiento: new Date("2026-06-10")
      }
    });

    const pago = await prisma.pagoMercadoPago.create({
      data: { cuotaId: cuota.id, mpPaymentId: "mp-123", monto: 15000, estado: "APROBADO" }
    });

    await prisma.cuota.update({
      where: { id: cuota.id },
      data: { estado: "PAGADA", metodo: "MERCADO_PAGO", fechaPago: new Date() }
    });

    const cuotaActualizada = await prisma.cuota.findUniqueOrThrow({
      where: { id: cuota.id },
      include: { pagoMercadoPago: true }
    });

    expect(cuotaActualizada.estado).toBe("PAGADA");
    expect(cuotaActualizada.pagoMercadoPago?.id).toBe(pago.id);
  });
});
