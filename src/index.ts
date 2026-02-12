import express from "express";
import { handlerReadiness } from "./handler/handlerReadiness.js";
import { handlerMetrics } from "./handler/handlerMetrics.js";
import { handlerMetricsReset } from "./handler/handlerMetricsReset.js";
import { logResponses } from "./middleware/logResponses.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerValidateChirp } from "./handler/handlerValidateChirp.js";
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(logResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics",  async (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset",  async (req, res, next) => {
  Promise.resolve(handlerMetricsReset(req, res)).catch(next);
});
app.post("/api/validate_chirp",  async (req, res, next) => {
  Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
