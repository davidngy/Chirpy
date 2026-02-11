import { Request, Response } from "express";
import { config } from "../config.js";
export async function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  res.status(200).send(`Hits: ${config.fileserverHits}`);
}
