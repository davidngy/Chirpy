import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./handlerAuth.js";
import type { NewUser } from "../db/schema.js";
export async function handlerCreateUser(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string
  };

  const params: parameter = req.body;
  const email = params.email;
  const password = params.password
  if (!email || !password) {
    return res.status(400).json({
      error: "email and password are required",
    });
  }
  const hash = await hashPassword(password)
  const response = await createUser({ email: email, hashedPw: hash})
  type NewUserWithoutPw = Omit<NewUser, "hashedPw">;
  const userWithoutPw: NewUserWithoutPw = {
    id: response.id,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    email: response.email
  }
  res.status(201).json(userWithoutPw);
}



