import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function updateUserCredentials(
  userId: string,
  email: string,
  hashedPw: string,
) {
  const [user] = await db
    .update(users)
    .set({ email: email, hashedPw: hashedPw })
    .where(eq(users.id, userId))
    .returning();
  return user;
}
