import express from "express";
import { handlerReadiness } from "./handlerReadiness.js";
import { logResponses } from "./middleware/logResponses.js";

const app = express();
const PORT = 8080;
app.use(logResponses);
app.use("/app", express.static("./src/app"));
app.use(express.static("./app"));
app.use(express.static("./app/assets/logo.png"));
app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
