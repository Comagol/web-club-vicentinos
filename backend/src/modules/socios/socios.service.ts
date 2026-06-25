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
