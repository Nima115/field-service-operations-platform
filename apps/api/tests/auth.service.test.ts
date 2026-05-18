import bcrypt from "bcryptjs";
import { describe, expect, it } from "@jest/globals";

describe("password hashing", () => {
  it("verifies a hashed password", async () => {
    const hash = await bcrypt.hash("Password123!", 12);

    await expect(bcrypt.compare("Password123!", hash)).resolves.toBe(true);
    await expect(bcrypt.compare("wrong-password", hash)).resolves.toBe(false);
  });
});
