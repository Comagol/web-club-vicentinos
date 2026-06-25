// backend/test/helpers/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Only list tables that exist in the current migration. DELETE FROM a table
// before its migration runs would throw "relation does not exist" in Postgres.
// Errors (including FK violations or connection drops) must propagate—do not catch.
// When adding new models (tasks 3-9): extend this list with the new tables in
// topologically correct position (child tables before parent tables they reference).
const TABLES_IN_DELETE_ORDER = [
  "UsuarioRol",
  "SocioDivisionTemporada",
  "SubcomisionMiembro",
  "GrupoFamiliarMiembro",
  "GrupoFamiliar",
  "Division",
  "Temporada",
  "InscripcionActividad",
  "ActividadRecaudatoria",
  "ReservaEspacio",
  "Espacio",
  "Solicitud",
  "Subcomision",
  "Empleado",
  "PagoMercadoPago",
  "Cuota",
  "MedioPagoAdherido",
  "ArchivoRendicion",
  "ArchivoDebito",
  "Socio",
  "Usuario",
  "TarifaCuota",
  "CategoriaSocio"
];

export async function cleanDatabase(): Promise<void> {
  for (const table of TABLES_IN_DELETE_ORDER) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
  }
}
