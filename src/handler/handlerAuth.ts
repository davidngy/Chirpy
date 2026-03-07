import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { lookUpToken, revokeRefreshToken } from "../db/queries/refresh.js";
import { UnauthorizedError } from "../error/httpErrors.js";
import { config } from "../config.js";
export async function handlerRefresh(req: Request, res: Response) {
  const bearerToken = getBearerToken(req);
  const refreshToken = await lookUpToken(bearerToken);
  if (
    !refreshToken ||
    refreshToken.revokedAt ||
    refreshToken.expiresAt < new Date()
  ) {
    throw new UnauthorizedError("Invalid refresh token");
  }
  const accessToken = makeJWT(
    refreshToken.userId,
    config.jwt.defaultDuration,
    config.jwt.secret,
  );

  res.status(200).json({ token: accessToken });
}

export async function handlerRevoke(req: Request, res: Response) {
  const bearerToken = getBearerToken(req);
  const refreshToken = await lookUpToken(bearerToken);
  if (
    !refreshToken ||
    refreshToken.revokedAt ||
    refreshToken.expiresAt < new Date()
  ) {
    throw new UnauthorizedError("Invalid refresh token");
  }
  await revokeRefreshToken(bearerToken, new Date());
  res.sendStatus(204);
}
