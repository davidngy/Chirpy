import { Request, Response } from "express";
import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../error/httpErrors.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";
export async function handlerUpgradeUserToRed(req: Request, res: Response) {
  type parameter = {
    event: string;
    data: {
      userId: string;
    };
  };
  const body: parameter = req.body;
  const polkaKey = getAPIKey(req);
  if (polkaKey !== config.polka.key) {
    throw new UnauthorizedError("Invalid api key");
  }
  if (body.event !== "user.upgraded") {
    return res.sendStatus(204);
  }
  const user = await upgradeUserToChirpyRed(body.data.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.sendStatus(204);
}
