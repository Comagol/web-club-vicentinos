// backend/test/solicitudes.smoke.test.ts
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { prisma, cleanDatabase } from "./helpers/prisma";

beforeEach(cleanDatabase);
afterAll(async () => prisma.$disconnect());

describe("Solicitudes", () => {
  it("creates a reserva de espacio request and chains a resubmission after rejection", async () => {
    const usuario = await prisma.usuario.create({
      data: { email: "socio@example.com", passwordHash: "hash" }
    });
    const espacio = await prisma.espacio.create({ data: { nombre: "Quincho", capacidad: 40 } });

    const original = await prisma.solicitud.create({
      data: {
        origen: "SOCIO",
        tipo: "RESERVA_ESPACIO",
        creadoPorUsuarioId: usuario.id,
        estado: "RECHAZADO",
        notaRechazo: "Horario superpuesto con otra reserva",
        reservaEspacio: {
          create: {
            espacioId: espacio.id,
            fecha: new Date("2026-07-01"),
            horaInicio: "18:00",
            horaFin: "22:00",
            uso: "PERSONAL"
          }
        }
      }
    });

    const reenvio = await prisma.solicitud.create({
      data: {
        origen: "SOCIO",
        tipo: "RESERVA_ESPACIO",
        creadoPorUsuarioId: usuario.id,
        solicitudPadreId: original.id,
        reservaEspacio: {
          create: {
            espacioId: espacio.id,
            fecha: new Date("2026-07-01"),
            horaInicio: "12:00",
            horaFin: "16:00",
            uso: "PERSONAL"
          }
        }
      }
    });

    const cadena = await prisma.solicitud.findUniqueOrThrow({
      where: { id: original.id },
      include: { reenvio: true }
    });

    expect(cadena.reenvio?.id).toBe(reenvio.id);
  });

  it("creates an actividad recaudatoria under a subcomisión with one inscripción", async () => {
    const usuario = await prisma.usuario.create({
      data: { email: "subcomision@example.com", passwordHash: "hash" }
    });
    const subcomision = await prisma.subcomision.create({ data: { nombre: "Subcomisión de Boutique" } });
    const categoria = await prisma.categoriaSocio.create({ data: { nombre: "activo-2" } });
    const socio = await prisma.socio.create({
      data: {
        numeroSocio: "0300",
        nombre: "Carla",
        apellido: "Ruiz",
        fechaNacimiento: new Date("1995-01-01"),
        categoriaSocioId: categoria.id
      }
    });

    const solicitud = await prisma.solicitud.create({
      data: {
        origen: "SUBCOMISION",
        tipo: "ACTIVIDAD_RECAUDATORIA",
        creadoPorUsuarioId: usuario.id,
        subcomisionId: subcomision.id,
        estado: "APROBADO",
        actividadRecaudatoria: {
          create: {
            subcomisionId: subcomision.id,
            nombre: "Cena de pastas",
            fecha: new Date("2026-08-15"),
            cupo: 100,
            precio: 5000
          }
        }
      },
      include: { actividadRecaudatoria: true }
    });

    await prisma.inscripcionActividad.create({
      data: {
        actividadId: solicitud.actividadRecaudatoria!.id,
        socioId: socio.id,
        estadoPago: "PAGADO"
      }
    });

    const inscripciones = await prisma.inscripcionActividad.findMany({
      where: { actividadId: solicitud.actividadRecaudatoria!.id }
    });
    expect(inscripciones).toHaveLength(1);
  });
});
