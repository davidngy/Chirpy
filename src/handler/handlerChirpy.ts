import { Response, Request } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../error/httpErrors.js";
import {
  createChirpy,
  getChirp,
  deleteChirp,
  getChirps,
} from "../db/queries/chirpy.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
function validateChirp(chirp: string) {
  const forbidden = ["kerfuffle", "sharbert", "fornax"];
  if (chirp.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }
  const chirpArray = chirp.split(" ");
  const cleanedBodyArr = [];
  for (const word of chirpArray) {
    if (forbidden.includes(word.toLowerCase())) {
      cleanedBodyArr.push("****");
    } else {
      cleanedBodyArr.push(word);
    }
  }
  const cleanedBody = cleanedBodyArr.join(" ");
  return cleanedBody;
}

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };
  const params: parameters = req.body;
  const cleandeChirp = validateChirp(params.body);
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  const response = await createChirpy({ body: cleandeChirp, userId: userId });
  res.status(201).json(response);
}

export async function handlerGetChirps(req: Request, res: Response) {
  let authorId = "";
  let sort = "asc";
  if (typeof req.query.sort === "string") {
    sort = req.query.sort;
  }
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }

  const chirpies = await getChirps(authorId, sort);
  res.status(200).json(chirpies);
}

export async function handlerGetChirp(req: Request, res: Response) {
  const chirpId = req.params.id as string;
  const chirp = await getChirp(chirpId);
  if (!chirp.length) {
    throw new NotFoundError("Non existing chirp");
  }
  res.status(200).json(chirp[0]);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const chirpId = req.params.chirpId;
  if (typeof chirpId !== "string") {
    throw new BadRequestError("Invalid chirp id");
  }
  const bearerToken = getBearerToken(req);
  const userId = validateJWT(bearerToken, config.jwt.secret);
  const chirp = await getChirp(chirpId);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }
  const deleted = await deleteChirp(chirpId, userId);
  if (!deleted) {
    throw new ForbiddenError("Not allowed to delete");
  }
  res.sendStatus(204);
}
