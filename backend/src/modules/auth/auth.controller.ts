import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { UnauthorizedError } from "../../shared/errors";
import * as authService from "./auth.service";

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, usuario } = await authService.login(
    req.body.email,
    req.body.password
  );
  res.cookie("accessToken", accessToken, { ...COOKIE_BASE, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...COOKIE_BASE, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ usuario });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) throw new UnauthorizedError();
  const { accessToken, refreshToken } = await authService.refresh(token);
  res.cookie("accessToken", accessToken, { ...COOKIE_BASE, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...COOKIE_BASE, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ ok: true });
});

export const logoutHandler = (_req: Request, res: Response): void => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  res.json({ usuario: { id: user.sub, email: user.email, roles: user.roles } });
});
