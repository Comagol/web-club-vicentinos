import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import * as sociosService from "./socios.service";

export const getSociosHandler = asyncHandler(async (req: Request, res: Response) => {
  const { nombre, estado } = req.query as Record<string, string>;
  const socios = await sociosService.getSocios({ nombre, estado });
  res.json({ socios });
});

export const getSocioByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const socio = await sociosService.getSocioById(req.params["id"] as string);
  res.json({ socio });
});

export const getCarnetHandler = asyncHandler(async (req: Request, res: Response) => {
  const carnet = await sociosService.getCarnet(req.params["id"] as string, req.user!);
  res.json({ carnet });
});

export const createSocioHandler = asyncHandler(async (req: Request, res: Response) => {
  const socio = await sociosService.createSocio(req.body);
  res.status(201).json({ socio });
});

export const updateSocioHandler = asyncHandler(async (req: Request, res: Response) => {
  const socio = await sociosService.updateSocio(req.params["id"] as string, req.body);
  res.json({ socio });
});

export const getCuotasHandler = asyncHandler(async (req: Request, res: Response) => {
  const cuotas = await sociosService.getCuotas(req.params["id"] as string);
  res.json({ cuotas });
});

export const getCarnetPublicoHandler = asyncHandler(async (req: Request, res: Response) => {
  const carnet = await sociosService.getCarnetPublico(req.params["token"] as string);
  res.json({ carnet });
});
