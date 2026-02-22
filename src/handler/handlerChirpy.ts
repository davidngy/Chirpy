import { Response, Request } from "express";
import { BadRequestError } from "../error/httpErrors.js";
import { createChirpy } from "../db/queries/chirpy.js";

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
  return cleanedBody
}

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string
  };
  const params: parameters = req.body;
  const cleandeChirp = validateChirp(params.body)
  const userId = params.userId
  console.log(cleandeChirp)
  const response = await createChirpy({body: cleandeChirp, userId: userId})
  console.log(response)
  return res.status(201).json(response);
}