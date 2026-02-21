import { env } from "node:process";
import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBCOnfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
};

type DBCOnfig = {
  url: string;
  migrationConfig: MigrationConfig;
  platform: string
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile();

function envOrThrow(key: string) {
  if (!env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return env[key];
}

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL") as string,
    migrationConfig: migrationConfig,
    platform: envOrThrow("PLATFORM") as string,
  },
};
