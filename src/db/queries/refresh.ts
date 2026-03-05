import { db } from "../index.js";
import { refreshTokens, NewToken } from "../schema.js";

export async function insertRefreshtoken(token: string, userId: string) {
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
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
