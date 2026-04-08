import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readJson, storagePaths, writeJson } from "./storage";

const HASH_BYTES = 64;

interface AuthData {
  password?: string;
  passwordHash?: string;
  passwordSalt?: string;
  passwordUpdatedAt?: string;
}

async function readAuthData(): Promise<AuthData> {
  return readJson<AuthData>(storagePaths.auth, {});
}

async function writeAuthData(data: AuthData): Promise<void> {
  await writeJson(storagePaths.auth, data);
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, HASH_BYTES).toString("hex");
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

async function getConfiguredPassword(): Promise<AuthData> {
  const data = await readAuthData();

  if (data.passwordHash && data.passwordSalt) {
    return data;
  }

  if (data.password) {
    return data;
  }

  if (process.env.ADMIN_PASSWORD) {
    return { password: process.env.ADMIN_PASSWORD };
  }

  return {};
}

export async function isPasswordConfigured(): Promise<boolean> {
  const data = await getConfiguredPassword();
  return Boolean(data.passwordHash || data.password);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const data = await getConfiguredPassword();

  if (data.passwordHash && data.passwordSalt) {
    return safeCompare(hashPassword(password, data.passwordSalt), data.passwordHash);
  }

  if (!data.password) {
    return false;
  }

  const matches = safeCompare(password, data.password);

  // Legacy plaintext values are migrated to a salted hash after a successful login.
  if (matches) {
    const fileData = await readAuthData();
    if (fileData.password && !fileData.passwordHash) {
      await setPassword(password);
    }
  }

  return matches;
}

export async function setPassword(newPassword: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);

  await writeAuthData({
    passwordHash,
    passwordSalt: salt,
    passwordUpdatedAt: new Date().toISOString(),
  });
}

export async function getSessionSecret(): Promise<string | null> {
  const authData = await readAuthData();
  const passwordMaterial =
    authData.passwordHash ||
    authData.password ||
    process.env.ADMIN_PASSWORD ||
    "";
  const source = [process.env.SESSION_SECRET, passwordMaterial]
    .filter(Boolean)
    .join(":");

  if (!source) {
    return null;
  }

  return createHash("sha256").update(source).digest("hex");
}
