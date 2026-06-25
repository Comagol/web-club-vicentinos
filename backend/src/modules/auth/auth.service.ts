import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { UnauthorizedError } from "../../shared/errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken, AccessPayload } from "./jwt";

export async function login(email: string, password: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!usuario || !usuario.activo) throw new UnauthorizedError("Credenciales inválidas");

  const valid = await bcrypt.compare(password, usuario.passwordHash);
  if (!valid) throw new UnauthorizedError("Credenciales inválidas");

  const roles = usuario.roles.map((r) => r.rol as string);
  const payload: AccessPayload = { sub: usuario.id, email: usuario.email, roles };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(usuario.id),
    usuario: { id: usuario.id, email: usuario.email, roles },
  };
}

export async function refresh(refreshToken: string) {
  const { sub } = verifyRefreshToken(refreshToken);

  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: sub },
    include: { roles: true },
  });

  if (!usuario.activo) throw new UnauthorizedError("Credenciales inválidas");

  const roles = usuario.roles.map((r) => r.rol as string);
  const payload: AccessPayload = { sub: usuario.id, email: usuario.email, roles };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(usuario.id),
  };
}
