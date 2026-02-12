import { NextFunction, Response, Request } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.error("Uh oh, spaghetti-o");
    res.status(500).json({
        "error": "Something went wrong on our end"
    });
}

