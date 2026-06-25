// backend/test/helpers/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Order matters: each table must be deleted before any table it has a
// foreign key pointing to (topological sort of the FK graph). Only include
// tables that have been defined so far.
const TABLES_IN_DELETE_ORDER = [
  "UsuarioRol",
  "GrupoFamiliarMiembro",
  "GrupoFamiliar",
  "Empleado",
  "Socio",
  "Usuario",
  "CategoriaSocio"
];

export async function cleanDatabase(): Promise<void> {
  for (const table of TABLES_IN_DELETE_ORDER) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
    } catch (error: any) {
      // Ignore errors from deleting tables that don't exist yet
      // The full error list will be added as more migrations are created
    }
  }
}
