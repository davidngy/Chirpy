import { Response, Request } from "express";
import { BadRequestError } from "../error/httpErrors.js";
export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };
  const params: parameters = req.body;
  const forbidden = ["kerfuffle", "sharbert", "fornax"];
  const chirp = params.body;
  console.log(req.body);
  console.log(chirp);
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
  res.status(200).send({ cleanedBody: cleanedBody });
}

