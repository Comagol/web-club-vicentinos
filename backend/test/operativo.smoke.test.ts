// backend/test/operativo.smoke.test.ts
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { prisma, cleanDatabase } from "./helpers/prisma";

beforeEach(cleanDatabase);
afterAll(async () => prisma.$disconnect());

describe("Módulo operativo", () => {
  it("creates a tarea, moves it through states, and records history without blocking on a limitante", async () => {
    const jefeUsuario = await prisma.usuario.create({
      data: { email: "jefe@example.com", passwordHash: "hash" }
    });
    const empleadoUsuario = await prisma.usuario.create({
      data: { email: "empleado@example.com", passwordHash: "hash" }
    });
    const empleado = await prisma.empleado.create({
      data: { usuarioId: empleadoUsuario.id, nombre: "Omar", apellido: "Lopez", area: "MANTENIMIENTO" }
    });

    const tarea = await prisma.tarea.create({
      data: {
        area: "MANTENIMIENTO",
        titulo: "Arreglar luz del quincho",
        asignadoAEmpleadoId: empleado.id,
        creadoPorUsuarioId: jefeUsuario.id
      }
    });

    await prisma.tarea.update({
      where: { id: tarea.id },
      data: { estado: "CON_LIMITANTE", notaLimitante: "Falta repuesto" }
    });
    await prisma.tareaHistorial.create({
      data: {
        tareaId: tarea.id,
        estadoAnterior: "PENDIENTE",
        estadoNuevo: "CON_LIMITANTE",
        usuarioId: empleadoUsuario.id,
        comentario: "Falta repuesto"
      }
    });

    const tareaActualizada = await prisma.tarea.findUniqueOrThrow({
      where: { id: tarea.id },
      include: { historial: true }
    });

    expect(tareaActualizada.estado).toBe("CON_LIMITANTE");
    expect(tareaActualizada.historial).toHaveLength(1);
  });
});
