import { Router } from "express";
import { requireAuth, requireRole } from "../auth/rbac";
import { validate, validateQuery } from "../../shared/validate";
import { createSocioSchema, updateSocioSchema, listSociosQuerySchema } from "./socios.schemas";
import {
  getSociosHandler,
  getSocioByIdHandler,
  getCarnetHandler,
  createSocioHandler,
  updateSocioHandler,
  getCuotasHandler,
} from "./socios.controller";

export const sociosRouter = Router();

sociosRouter.get("/", requireAuth, requireRole("ADMIN", "COMISION_DIRECTIVA"), validateQuery(listSociosQuerySchema), getSociosHandler);
sociosRouter.post("/", requireAuth, requireRole("ADMIN"), validate(createSocioSchema), createSocioHandler);
sociosRouter.get("/:id", requireAuth, requireRole("ADMIN", "COMISION_DIRECTIVA"), getSocioByIdHandler);
sociosRouter.patch("/:id", requireAuth, requireRole("ADMIN"), validate(updateSocioSchema), updateSocioHandler);
sociosRouter.get("/:id/cuotas", requireAuth, requireRole("ADMIN", "COMISION_DIRECTIVA"), getCuotasHandler);
sociosRouter.get("/:id/carnet", requireAuth, getCarnetHandler);
