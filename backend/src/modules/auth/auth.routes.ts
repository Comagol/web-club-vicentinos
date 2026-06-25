import { Router } from "express";
import { validate } from "../../shared/validate";
import { requireAuth } from "./rbac";
import { loginSchema } from "./auth.schemas";
import { loginHandler, refreshHandler, logoutHandler, meHandler } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), loginHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", requireAuth, meHandler);
