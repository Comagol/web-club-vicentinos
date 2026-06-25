// TODO: wire up once parser is implemented.
// Performs upsert of socios/cuotas from parsed external system data.
export async function importFromFile(_buffer: Buffer): Promise<{ creados: number; actualizados: number; errores: string[] }> {
  throw new Error("ExternalSystemImporter not implemented");
}
