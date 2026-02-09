import express from "express";
import { handlerReadiness } from "./handlerReadiness.js";
const app = express();
const PORT = 8080;

app.use(express.static("."));
app.use(express.static("./assets/logo.png"));
app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
