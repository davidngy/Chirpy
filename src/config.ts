import { env } from "node:process";
import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBCOnfig;
  jwt: JWTConfig;
  polka: PolkaConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: string;
};

type DBCOnfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type JWTConfig = {
  defaultDuration: number;
  refreshDuration: number;
  secret: string;
  issuer: string;
};

type PolkaConfig = {
  key: string;
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
    platform: envOrThrow("PLATFORM") as string,
  },
  db: {
    url: envOrThrow("DB_URL") as string,
    migrationConfig: migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60,
    refreshDuration: 60 * 24 * 60 * 60 * 1000,
    secret: envOrThrow("SECRET"),
    issuer: "chirpy",
  },
  polka: {
    key: envOrThrow("POLKA_KEY"),
  },
};
