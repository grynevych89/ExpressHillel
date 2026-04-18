import User from "../models/User.js";
import { register, authenticate } from "../services/userService.js";

const EMAIL_PREFIX = "__test__";

const cleanup = async () => {
  await User.deleteMany({ email: { $regex: `^${EMAIL_PREFIX}_`, $options: "i" } });
};

export async function run(test) {
  const email = `${EMAIL_PREFIX}_${Date.now()}@test.com`;
  const serviceEmail = `${EMAIL_PREFIX}_svc_${Date.now()}@test.com`;
  try {

  // ─── User model ───────────────────────────────────────────────────────────

  let testUser;
  await test("User.create() — hashes password via pre-save hook", async () => {
    testUser = await User.create({ email, password: "secret123" });
    if (testUser.password === "secret123") throw new Error("Password was not hashed");
    if (!testUser.password.startsWith("$2")) throw new Error("Password is not a bcrypt hash");
  });

  await test("User — createdAt/updatedAt set on create", async () => {
    if (!testUser) throw new Error("No test user (create failed)");
    if (!(testUser.createdAt instanceof Date)) throw new Error("createdAt is not a Date");
    if (!(testUser.updatedAt instanceof Date)) throw new Error("updatedAt is not a Date");
  });

  await test("User.find() — password excluded by default (select: false)", async () => {
    if (!testUser) throw new Error("No test user (create failed)");
    const found = await User.findById(testUser._id);
    if (found.password !== undefined) throw new Error("Password should be excluded by default");
  });

  await test("user.comparePassword() — true for correct password", async () => {
    if (!testUser) throw new Error("No test user (create failed)");
    const found = await User.findById(testUser._id).select("+password");
    if (!(await found.comparePassword("secret123")))
      throw new Error("comparePassword returned false for correct password");
  });

  await test("user.comparePassword() — false for wrong password", async () => {
    if (!testUser) throw new Error("No test user (create failed)");
    const found = await User.findById(testUser._id).select("+password");
    if (await found.comparePassword("wrongpassword"))
      throw new Error("comparePassword returned true for wrong password");
  });

  await test("user.getPublicProfile() — contains id/email, no password", async () => {
    if (!testUser) throw new Error("No test user (create failed)");
    const profile = testUser.getPublicProfile();
    if (!profile.id) throw new Error("profile missing id");
    if (!profile.email) throw new Error("profile missing email");
    if (!profile.createdAt) throw new Error("profile missing createdAt");
    if (profile.password !== undefined) throw new Error("profile must not include password");
  });

  await test("User.findByEmail() — finds by email (case-insensitive)", async () => {
    if (!testUser) throw new Error("No test user (create failed)");
    const found = await User.findByEmail(email.toUpperCase()).select("+password");
    if (!found) throw new Error("User not found");
    if (String(found._id) !== String(testUser._id)) throw new Error("Found wrong user");
    if (!found.password) throw new Error("Password not selected");
  });

  // ─── User validation ──────────────────────────────────────────────────────

  await test("User.create() — rejects invalid email format", async () => {
    let threw = false;
    try {
      await User.create({ email: "not-an-email", password: "secret123" });
    } catch (err) {
      if (err.name === "ValidationError") threw = true;
    }
    if (!threw) throw new Error("Expected ValidationError for invalid email");
  });

  await test("User.create() — rejects password shorter than 6 chars", async () => {
    let threw = false;
    try {
      await User.create({ email: `short_${Date.now()}@test.com`, password: "123" });
    } catch (err) {
      if (err.name === "ValidationError") threw = true;
    }
    if (!threw) throw new Error("Expected ValidationError for short password");
  });

  await test("User.create() — rejects duplicate email (code 11000)", async () => {
    if (!testUser) throw new Error("No test user (create failed)");
    let threw = false;
    try {
      await User.create({ email, password: "another123" });
    } catch (err) {
      if (err.code === 11000) threw = true;
    }
    if (!threw) throw new Error("Expected duplicate key error");
  });

  // ─── userService ──────────────────────────────────────────────────────────

  await test("userService.register() — returns public profile", async () => {
    const profile = await register(serviceEmail, "service123");
    if (!profile.id) throw new Error("profile missing id");
    if (profile.password !== undefined) throw new Error("register must not return password");
  });

  await test("userService.register() — throws 409 on duplicate email", async () => {
    let status = 0;
    try {
      await register(serviceEmail, "service123");
    } catch (err) {
      status = err.status;
    }
    if (status !== 409) throw new Error(`Expected 409, got ${status}`);
  });

  await test("userService.authenticate() — returns profile for valid credentials", async () => {
    const profile = await authenticate(serviceEmail, "service123");
    if (!profile.id) throw new Error("profile missing id");
    if (profile.password !== undefined) throw new Error("authenticate must not return password");
  });

  await test("userService.authenticate() — throws 401 for wrong password", async () => {
    let status = 0;
    try {
      await authenticate(serviceEmail, "wrongpassword");
    } catch (err) {
      status = err.status;
    }
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  });

  await test("userService.authenticate() — throws 401 for unknown email", async () => {
    let status = 0;
    try {
      await authenticate("nobody@test.com", "secret123");
    } catch (err) {
      status = err.status;
    }
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  });

  } finally {
    await test("User test cleanup", cleanup);
  }
}
