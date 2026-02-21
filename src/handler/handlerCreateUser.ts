import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
export async function handlerCreateUser(req: Request, res: Response) {
  type parameter = {
    email: string;
  };

  const params: parameter = req.body;
  const email = params.email;
  if (!email) {
    return res.status(400).json({
      error: "Email is required",
    });
  }
  const response = await createUser({ email: email})
  res.status(201).json(response);
}
