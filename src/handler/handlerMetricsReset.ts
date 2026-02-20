import { Request, Response } from "express";
import { config } from "../config.js";
export async function handlerMetricsReset(req: Request, res: Response) {
  config.api.fileserverHits = 0;
  res.write("Hits reset to 0");
  res.end();
}
