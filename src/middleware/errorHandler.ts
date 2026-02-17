import { NextFunction, Response, Request } from "express";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../error/httpErrors.js";
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  if (err instanceof NotFoundError) {
    statusCode = 404;
    res.status(statusCode).send({ error: err.message });
  } else if (err instanceof BadRequestError) {
    statusCode = 400;
    res.status(statusCode).send({ error: err.message });
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    res.status(statusCode).send({ error: err.message });
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    res.status(statusCode).send({ error: err.message });
  }
  if (statusCode === 500) {
    console.log(err.message);
  }
}
