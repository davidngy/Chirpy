import { Response, Request } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    let body = "";
    const forbidden = ["kerfuffle", "sharbert", "fornax"];

    req.on("data", (chunk) => {
        body += chunk;
    })

    req.on("end", () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch(error) {
            res.status(400).send("Invalid JSON")
            return;
        }
        const chirp = parsedBody.body;
        if(chirp.length > 140) {
            res.status(400).send({"error": "Chirp is too long"})
            return;
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
    })
}