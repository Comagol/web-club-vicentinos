import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./shared/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { sociosRouter } from "./modules/socios/socios.routes";
import { verificarRouter } from "./modules/socios/verificar.routes";
import { solicitudesRouter } from "./modules/solicitudes/solicitudes.routes";
import { operativoRouter } from "./modules/operativo/operativo.routes";
import { boutiqueRouter } from "./modules/boutique/boutique.routes";
import { institucionalRouter } from "./modules/institucional/institucional.routes";
import { pagosRouter } from "./modules/pagos/pagos.routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/auth", authRouter);
  app.use("/verificar", verificarRouter);
  app.use("/socios", sociosRouter);
  app.use("/solicitudes", solicitudesRouter);
  app.use("/tareas", operativoRouter);
  app.use("/productos", boutiqueRouter);
  app.use("/pedidos", boutiqueRouter);
  app.use("/noticias", institucionalRouter);
  app.use("/resultados", institucionalRouter);
  app.use("/pagos", pagosRouter);

  app.use(errorHandler);

  return app;
}
