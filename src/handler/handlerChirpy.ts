import { Response, Request } from "express";
import { BadRequestError } from "../error/httpErrors.js";
import { createChirpy, getAllChipies, getChirp } from "../db/queries/chirpy.js";
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
  const chirpies = await getAllChipies();
  res.status(200).json(chirpies);
}

export async function handlerGetChirp(req: Request, res: Response) {
  const chirpId = req.params.id as string;
  const chirp = await getChirp(chirpId);
  if (!chirp.length) {
    return res.status(400).json({
      error: "Invalid Chirp",
    });
  }
  res.status(200).json(chirp[0]);
}
