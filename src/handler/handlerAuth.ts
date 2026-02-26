import * as argon2 from "argon2";
import { Response, Request } from "express";
import { getUserByEmail } from "../db/queries/users.js";

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

export async function handlerLogin(req: Request, res: Response) {
  type parameter = {
    password: string;
    email: string;
  };
  const params: parameter = req.body;
  const email = params.email;
  const passwordInput = params.password;
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
  res.status(200).json({
    "id": user.id,
    "createdAt": user.createdAt,
    "updatedAt": user.updatedAt,
    "email": user.email
  })
}