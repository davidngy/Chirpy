import { db } from "../index.js";
import { NewChirpy, chirpies } from "../schema.js";
import { eq, and, asc } from "drizzle-orm";

export async function createChirpy(chirpy: NewChirpy) {
  const [result] = await db
    .insert(chirpies)
    .values(chirpy)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps(authorId?: string) {
  return db
    .select()
    .from(chirpies)
    .where(authorId ? eq(chirpies.userId, authorId) : undefined)
    .orderBy(asc(chirpies.createdAt));
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
