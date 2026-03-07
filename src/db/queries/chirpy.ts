import { db } from "../index.js";
import { NewChirpy, chirpies } from "../schema.js";
import { eq, and } from "drizzle-orm";

export async function createChirpy(chirpy: NewChirpy) {
  const [result] = await db
    .insert(chirpies)
    .values(chirpy)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChipies() {
  const result = await db.select().from(chirpies);
  return result;
}

export async function getChirp(chirpId: string) {
  const chirp = await db
    .select()
    .from(chirpies)
    .where(eq(chirpies.id, chirpId));
  return chirp;
}

export async function deleteChirp(chirpId: string, userId: string) {
  const [deleted] = await db
    .delete(chirpies)
    .where(and(eq(chirpies.id, chirpId), eq(chirpies.userId, userId)))
    .returning();
  return deleted;
}
