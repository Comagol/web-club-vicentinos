import { Router } from "express";
export const verificarRouter = Router();
verificarRouter.all("/{*path}", (_req, res) => res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } }));
