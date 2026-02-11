import { Request, Response } from "express";
import { config } from "../config.js";
export async function handlerMetricsReset(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  config.fileserverHits = 0;
  res.status(200).send(`Hit: ${config.fileserverHits}`);
}
