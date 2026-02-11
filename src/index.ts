import express from "express";
import { handlerReadiness } from "./handler/handlerReadiness.js";
import { handlerMetrics } from "./handler/handlerMetrics.js";
import { handlerMetricsReset } from "./handler/handlerMetricsReset.js";
import { logResponses } from "./middleware/logResponses.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerValidateChirp } from "./handler/handlerValidateChirp.js";
const app = express();
const PORT = 8080;
app.use(logResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerMetricsReset);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
