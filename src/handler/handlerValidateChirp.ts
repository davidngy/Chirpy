import { Response, Request } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    const forbidden = ["kerfuffle", "sharbert", "fornax"];
    const chirp = req.body;
    if(chirp.length > 140) {
        throw new Error("Chirp is too long");
    }
    const chirpArray = chirp.split(" ");
    const cleanedBodyArr = [];
    for(const word of chirpArray) {
        if(forbidden.includes(word.toLowerCase())) {
            cleanedBodyArr.push("****");
        } else {
            cleanedBodyArr.push(word);
        }
    }
    const cleanedBody = cleanedBodyArr.join(" ");
    res.status(200).send({"cleanedBody": cleanedBody})
}