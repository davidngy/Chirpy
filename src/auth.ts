import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError, BadRequestError } from "./error/httpErrors.js";
import { Request } from "express";
import { randomBytes } from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
  const hash = await argon2.hash(password);
  return hash;
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  if (await argon2.verify(hash, password)) {
    return true;
  } else {
    return false;
  }
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;
  const payload = {
    iss: "chirpy",
    sub: userID,
    iat: iat,
    exp: exp,
  };
  const token = jwt.sign(payload, secret, { algorithm: "HS256" });
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const payload = jwt.verify(tokenString, secret) as JwtPayload;
    if (!payload.sub) {
      throw new UnauthorizedError("Token missing subject");
    }
    return payload.sub;
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function getBearerToken(req: Request): string {
  const bearerToken = req.get("Authorization");
  if (!bearerToken) {
    throw new UnauthorizedError("Authorization header missing");
  }
  const splitAuth = bearerToken.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
}

export function makeRefreshToken(): string {
  const token = randomBytes(32).toString("hex");
  return token;
}
