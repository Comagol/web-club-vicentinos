// backend/test/helpers/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Order matters: each table must be deleted before any table it has a
// foreign key pointing to (topological sort of the FK graph). In particular
// PagoMercadoPago references both Cuota and Pedido, so it must be deleted
// before either of those, not after.
const TABLES_IN_DELETE_ORDER = [
  "UsuarioRol",
  "GrupoFamiliarMiembro",
  "SocioDivisionTemporada",
  "SubcomisionMiembro",
  "TarifaCuota",
  "MedioPagoAdherido",
  "ArchivoRendicion",
  "PagoMercadoPago",
  "ReservaEspacio",
  "InscripcionActividad",
  "TareaHistorial",
  "ItemPedido",
  "Noticia",
  "Resultado",
  "GrupoFamiliar",
  "Division",
  "Temporada",
  "ArchivoDebito",
  "Cuota",
  "Pedido",
  "Espacio",
  "ActividadRecaudatoria",
  "Tarea",
  "VarianteProducto",
  "Solicitud",
  "Empleado",
  "Producto",
  "Socio",
  "Subcomision",
  "Usuario",
  "CategoriaSocio"
];

export async function cleanDatabase(): Promise<void> {
  for (const table of TABLES_IN_DELETE_ORDER) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
  }
}
