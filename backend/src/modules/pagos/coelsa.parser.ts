// TODO: implement once Banco Macro / Prisma COELSA rendicion spec is obtained.
// Input: rendicion file buffer; Output: array of { cbu, resultado: 'PAGADA' | 'VENCIDA' }.
export function parsear(_buffer: Buffer): { cbu: string; resultado: "PAGADA" | "VENCIDA" }[] {
  throw new Error("CoelsaParser not implemented: awaiting rendicion spec from Banco Macro / Prisma");
}
