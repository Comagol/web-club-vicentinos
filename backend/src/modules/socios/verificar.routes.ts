import { Router } from "express";
import { getCarnetPublicoHandler } from "./socios.controller";

export const verificarRouter = Router();
verificarRouter.get("/:token", getCarnetPublicoHandler);
