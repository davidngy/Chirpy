import { env } from "node:process";
import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBCOnfig;
  jwt: JWTConfig;
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
  secret: string;
  issuer: string;
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
    secret: envOrThrow("SECRET"),
    issuer: "chirpy",
  },
};
