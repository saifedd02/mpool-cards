import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readJsonWithFallback, storagePaths, writeJsonAtomically } from "./storage";

const HASH_BYTES = 64;

interface AuthData {
  password?: string;
  passwordHash?: string;
  passwordSalt?: string;
  passwordUpdatedAt?: string;
}

function readAuthData(): AuthData {
  return readJsonWithFallback<AuthData>(
    storagePaths.auth,
    [storagePaths.legacyAuth],
    {}
  );
}

function writeAuthData(data: AuthData): void {
  writeJsonAtomically(storagePaths.auth, data);
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

function getConfiguredPassword(): AuthData {
  const data = readAuthData();

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

export function isPasswordConfigured(): boolean {
  const data = getConfiguredPassword();
  return Boolean(data.passwordHash || data.password);
}

export function verifyPassword(password: string): boolean {
  const data = getConfiguredPassword();

  if (data.passwordHash && data.passwordSalt) {
    return safeCompare(hashPassword(password, data.passwordSalt), data.passwordHash);
  }

  if (!data.password) {
    return false;
  }

  const matches = safeCompare(password, data.password);

  // Legacy plaintext values are migrated to a salted hash after a successful login.
  if (matches) {
    const fileData = readAuthData();
    if (fileData.password && !fileData.passwordHash) {
      setPassword(password);
    }
  }

  return matches;
}

export function setPassword(newPassword: string): void {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);

  writeAuthData({
    passwordHash,
    passwordSalt: salt,
    passwordUpdatedAt: new Date().toISOString(),
  });
}

export function getSessionSecret(): string | null {
  const authData = readAuthData();
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
