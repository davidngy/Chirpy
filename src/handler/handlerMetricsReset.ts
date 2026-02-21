import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";
import { ForbiddenError } from "../error/httpErrors.js";
export async function handlerMetricsReset(req: Request, res: Response) {
  config.api.fileserverHits = 0;
  if(config.db.platform !== "dev"){
    throw new ForbiddenError("no rights to do this")
  }
  await deleteUsers()
  res.status(200)
  res.write("Hits reset to 0");
  res.end();
}
