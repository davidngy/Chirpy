import express from "express";
import { handlerReadiness } from "./handler/handlerReadiness.js";
import { handlerMetrics } from "./handler/handlerMetrics.js";
import { handlerMetricsReset } from "./handler/handlerMetricsReset.js";
import { logResponses } from "./middleware/logResponses.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerCreateChirp } from "./handler/handlerChirpy.js";
import { handlerCreateUser } from "./handler/handlerCreateUser.js";
import { errorHandler } from "./middleware/errorHandler.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();

app.use(express.json());
app.use(logResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", async (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", async (req, res, next) => {
  Promise.resolve(handlerMetricsReset(req, res)).catch(next);
});
app.post("/api/chirps", async (req, res, next) => {
  Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});

app.post("/api/users", async (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.use(errorHandler);
app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
