import express from "express";
import { handlerReadiness } from "./handler/handlerReadiness.js";
import { handlerMetrics } from "./handler/handlerMetrics.js";
import { handlerMetricsReset } from "./handler/handlerMetricsReset.js";
import { logResponses } from "./middleware/logResponses.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";

const app = express();
const PORT = 8080;
app.use(logResponses);
app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", handlerMetrics);
app.get("/api/reset", handlerMetricsReset);
app.use(middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.use(express.static("./app"));
app.use(express.static("./app/assets/logo.png"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
