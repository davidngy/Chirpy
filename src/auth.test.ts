import { describe, it, expect, beforeAll } from "vitest";
import {
  makeJWT,
  validateJWT,
  hashPassword,
  checkPasswordHash,
  getBearerToken,
} from "./auth";
describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the wrong hash", async () => {
    const result1 = await checkPasswordHash(password2, hash1);
    expect(result1).toBe(false);
  });
});

describe("JWT functons", () => {
  const secret = "correctPassword123!";
  let token1: string;
  let token2: string;
  let userId1: string = "1";
  let userId2: string = "2";

  beforeAll(() => {
    token1 = makeJWT(userId1, 1000, secret);
    token2 = makeJWT(userId2, 1000, secret);
  });

  it("should return the userId for the correct arguments", () => {
    const result = validateJWT(token1, secret);
    expect(result).toBe("1");
  });

  it("should throw an error because of wrong secret", () => {
    expect(() => validateJWT(token2, "wrong")).toThrow();
  });
});

describe("getting bearer token", () => {
  const mockReq = {
    get: () => "Bearer 123",
  } as any;

  const mockReq1 = {
    get: () => "Bearer 234",
  } as any;

  const mockReq2 = {
    get: () => undefined,
  } as any;

  it("should return the token", () => {
    const result = getBearerToken(mockReq);
    expect(result).toBe("Bearer 123");
  });

  it("should throw an error because of undefined content", () => {
    expect(() => getBearerToken(mockReq2)).toThrow();
  });
});
