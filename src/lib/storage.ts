import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

const storageRoot = resolve(process.cwd(), process.env.STORAGE_DIR || "storage");
const dataDir = join(storageRoot, "data");
const uploadsDir = join(storageRoot, "photos");
const legacyDataDir = join(process.cwd(), "src/data");

export const storagePaths = {
  auth: join(dataDir, "auth.json"),
  dataDir,
  employees: join(dataDir, "employees.json"),
  events: join(dataDir, "events.json"),
  legacyAuth: join(legacyDataDir, "auth.json"),
  legacyEmployees: join(legacyDataDir, "employees.json"),
  legacyEvents: join(legacyDataDir, "events.json"),
  root: storageRoot,
  uploadsDir,
};

export function ensureDir(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

export function ensureStorageLayout(): void {
  ensureDir(storagePaths.dataDir);
  ensureDir(storagePaths.uploadsDir);
}

export function readJsonWithFallback<T>(
  primaryPath: string,
  fallbackPaths: string[],
  defaultValue: T
): T {
  for (const candidate of [primaryPath, ...fallbackPaths]) {
    try {
      return JSON.parse(readFileSync(candidate, "utf-8")) as T;
    } catch {
      continue;
    }
  }

  return defaultValue;
}

export function writeJsonAtomically(path: string, data: unknown): void {
  ensureDir(dirname(path));
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  renameSync(tmp, path);
}

export function writeBufferAtomically(path: string, data: Buffer): void {
  ensureDir(dirname(path));
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, data);
  renameSync(tmp, path);
}
