import { Router } from "express";

export function createStubRouter(): Router {
  const router = Router();
  router.all("/{*path}", (_req, res) => {
    res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } });
  });
  return router;
}
