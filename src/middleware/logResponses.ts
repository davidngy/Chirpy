import { Request, Response, NextFunction } from "express";

export function logResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    console.log(res.statusMessage);
    if (res.statusCode > 300) {
      console.log(
        `[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`,
      );
    }
  });
  next();
}
