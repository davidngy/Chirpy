import { NextFunction, Response, Request } from "express";

export async function validateChirp(req: Request, res: Response, next: NextFunction) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    })

    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
        } catch(error) {
            res.status(400).send("Invalid JSON")
        }
    })
}