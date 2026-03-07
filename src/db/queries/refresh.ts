import { db } from "../index.js";
import { refreshTokens, NewToken } from "../schema.js";
import { config } from "../../config.js";
import { eq } from "drizzle-orm";
export async function insertRefreshtoken(token: string, userId: string) {
  const expiresAt = new Date(Date.now() + config.jwt.refreshDuration);
  const [result] = await db
    .insert(refreshTokens)
    .values({
      userId: userId,
      token: token,
      expiresAt: expiresAt,
      revokedAt: null,
    })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function lookUpToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));

  return result;
}

export async function revokeRefreshToken(token: string, revokedAt: Date) {
  const [result] = await db
    .update(refreshTokens)
    .set({ revokedAt: revokedAt, updatedAt: revokedAt })
    .where(eq(refreshTokens.token, token));
  return result;
}
