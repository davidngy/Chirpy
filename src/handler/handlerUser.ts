import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword, makeJWT } from "../auth.js";
import type { NewUser } from "../db/schema.js";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { config } from "../config.js";
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
    expiresInSeconds?: number;
  };
  const params: parameter = req.body;
  const email = params.email;
  const passwordInput = params.password;
  let expiresInSeconds = params.expiresInSeconds;
  if (!expiresInSeconds) {
    expiresInSeconds = config.jwt.defaultDuration;
  }
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

  res.status(200).json({
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: accessToken,
  });
}
