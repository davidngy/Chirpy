import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import {
  getBearerToken,
  hashPassword,
  makeJWT,
  checkPasswordHash,
  validateJWT,
} from "../auth.js";
import type { NewUser } from "../db/schema.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { insertRefreshtoken, lookUpToken } from "../db/queries/refresh.js";
import { makeRefreshToken } from "../auth.js";
import { BadRequestError, UnauthorizedError } from "../error/httpErrors.js";
import { updateUserCredentials } from "../db/queries/users.js";
export async function handlerCreateUser(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
  };

  const params: parameter = req.body;
  const email = params.email;
  const password = params.password;
  if (!email || !password) {
    return res.status(400).json({
      error: "email and password are required",
    });
  }
  const hash = await hashPassword(password);
  const response = await createUser({ email: email, hashedPw: hash });
  type NewUserWithoutPw = Omit<NewUser, "hashedPw">;
  const userWithoutPw: NewUserWithoutPw = {
    id: response.id,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    email: response.email,
  };
  res.status(201).json(userWithoutPw);
}

export async function handlerLogin(req: Request, res: Response) {
  type parameter = {
    password: string;
    email: string;
  };

  const params: parameter = req.body;
  const email = params.email;
  const passwordInput = params.password;
  const expiresInSeconds = config.jwt.defaultDuration;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({
      error: "No user found with that email!",
    });
  }
  const pwIsSame = await checkPasswordHash(passwordInput, user.hashedPw);
  if (pwIsSame !== true) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const accessToken = makeJWT(user.id, expiresInSeconds, config.jwt.secret);
  const refreshToken = makeRefreshToken();

  await insertRefreshtoken(refreshToken, user.id);

  res.status(200).json({
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: accessToken,
    refreshToken: refreshToken,
  });
}

export async function handlerUpdateUserCredentials(
  req: Request,
  res: Response,
) {
  type parameters = {
    email: string;
    password: string;
  };
  const body: parameters = req.body;
  if (!body.password || !body.email) {
    throw new BadRequestError("Missing required fields");
  }
  const bearerToken = getBearerToken(req);
  const userId = validateJWT(bearerToken, config.jwt.secret);
  const hashedPw = await hashPassword(body.password);
  const newCredentials = await updateUserCredentials(
    userId,
    body.email,
    hashedPw,
  );
  res.status(200).json({
    id: newCredentials.id,
    createdAt: newCredentials.createdAt,
    updatedAt: newCredentials.updatedAt,
    email: newCredentials.email,
  });
}
