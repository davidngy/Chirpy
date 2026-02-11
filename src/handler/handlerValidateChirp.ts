import { Response, Request } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    })

    req.on("end", () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch(error) {
            res.status(400).send("Invalid JSON")
        }
        const chirp = parsedBody.body;
        if(chirp.length > 140) {
            res.status(400).send({"error": "Chirp is too long"})
        }
        res.status(200).send({"valid": true})
    })
}