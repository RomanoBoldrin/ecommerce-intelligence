import password from "@/infra/password.js";

describe("Password hashing unit tests", () => {
  it("should hash a plaintext password and verify correctly", async () => {
    const plaintext = "SuperSecretPassword123!";
    const hash = await password.hash(plaintext);

    expect(typeof hash).toBe("string");
    expect(hash.startsWith("$2")).toBe(true); // bcrypt prefix

    const isMatch = await password.compare(plaintext, hash);
    expect(isMatch).toBe(true);

    const isMismatch = await password.compare("WrongPassword!", hash);
    expect(isMismatch).toBe(false);
  });

  it("should generate different salt hashes for identical passwords", async () => {
    const plaintext = "IdenticalPassword123!";
    const hash1 = await password.hash(plaintext);
    const hash2 = await password.hash(plaintext);

    expect(hash1).not.toBe(hash2);

    expect(await password.compare(plaintext, hash1)).toBe(true);
    expect(await password.compare(plaintext, hash2)).toBe(true);
  });
});

