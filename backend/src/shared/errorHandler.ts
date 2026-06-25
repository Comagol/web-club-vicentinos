import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError, ValidationError } from "./errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    res.status(422).json({
      error: { message: err.message, code: err.code, details: err.details },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: { message: "Not found", code: "NOT_FOUND" } });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ error: { message: "Already exists", code: "CONFLICT" } });
      return;
    }
  }

  console.error(err);
  res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
}
