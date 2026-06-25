import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../../shared/errors";
import { verifyAccessToken, AccessPayload } from "./jwt";

declare global {
  namespace Express {
    interface Request {
      user?: AccessPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    next(new UnauthorizedError());
    return;
  }
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedError("Token inválido o expirado"));
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRoles = req.user?.roles ?? [];
    if (!roles.some((r) => userRoles.includes(r))) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}
