import { NextFunction, Response, Request } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.error("Something went wrong on our end");
    res.status(500).json({
        "error": "Something went wrong on our end"
    });
}

