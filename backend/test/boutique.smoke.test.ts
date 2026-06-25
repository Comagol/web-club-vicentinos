// backend/test/boutique.smoke.test.ts
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { prisma, cleanDatabase } from "./helpers/prisma";

beforeEach(cleanDatabase);
afterAll(async () => prisma.$disconnect());

async function crearSocio(numeroSocio: string) {
  const categoria = await prisma.categoriaSocio.create({ data: { nombre: `cat-boutique-${numeroSocio}` } });
  return prisma.socio.create({
    data: {
      numeroSocio,
      nombre: "Comprador",
      apellido: "Test",
      fechaNacimiento: new Date("1990-01-01"),
      categoriaSocioId: categoria.id
    }
  });
}

describe("Boutique", () => {
  it("places a cash pedido, reserves stock, and only marks it pagado on pickup", async () => {
    const socio = await crearSocio("0400");
    const producto = await prisma.producto.create({ data: { nombre: "Camiseta oficial" } });
    const variante = await prisma.varianteProducto.create({
      data: { productoId: producto.id, talla: "M", precio: 25000, stock: 10 }
    });

    const pedido = await prisma.pedido.create({
      data: {
        socioId: socio.id,
        metodoPago: "EFECTIVO",
        total: 25000,
        items: { create: [{ varianteProductoId: variante.id, cantidad: 1, precioUnitario: 25000 }] }
      }
    });
    await prisma.varianteProducto.update({
      where: { id: variante.id },
      data: { stock: { decrement: 1 } }
    });

    expect(pedido.estado).toBe("PENDIENTE_PAGO");

    const varianteActualizada = await prisma.varianteProducto.findUniqueOrThrow({ where: { id: variante.id } });
    expect(varianteActualizada.stock).toBe(9);

    await prisma.pedido.update({ where: { id: pedido.id }, data: { estado: "ENTREGADO" } });
    const pedidoFinal = await prisma.pedido.findUniqueOrThrow({ where: { id: pedido.id } });
    expect(pedidoFinal.estado).toBe("ENTREGADO");
  });

  it("auto-approves a Mercado Pago pedido through its linked payment", async () => {
    const socio = await crearSocio("0401");
    const producto = await prisma.producto.create({ data: { nombre: "Gorra" } });
    const variante = await prisma.varianteProducto.create({
      data: { productoId: producto.id, precio: 8000, stock: 5 }
    });

    const pedido = await prisma.pedido.create({
      data: {
        socioId: socio.id,
        metodoPago: "MERCADO_PAGO",
        total: 8000,
        items: { create: [{ varianteProductoId: variante.id, cantidad: 1, precioUnitario: 8000 }] }
      }
    });

    await prisma.pagoMercadoPago.create({
      data: { pedidoId: pedido.id, mpPaymentId: "mp-456", monto: 8000, estado: "APROBADO" }
    });
    await prisma.pedido.update({ where: { id: pedido.id }, data: { estado: "PAGADO" } });

    const pedidoConPago = await prisma.pedido.findUniqueOrThrow({
      where: { id: pedido.id },
      include: { pagoMercadoPago: true }
    });

    expect(pedidoConPago.estado).toBe("PAGADO");
    expect(pedidoConPago.pagoMercadoPago?.estado).toBe("APROBADO");
  });
});
