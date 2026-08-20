import lockfile from 'proper-lockfile';
import fs from 'fs';
import path from 'path';

const memoryLocks = new Map<string, Promise<any>>();

/**
 * Executes an async read-modify-write action on a file safely with file locks (proper-lockfile)
 * and in-process queue serialization to prevent lost updates during concurrent writes.
 */
export async function withFileLock<T>(filePath: string, fn: () => Promise<T> | T): Promise<T> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
  }

  const prevPromise = memoryLocks.get(filePath) || Promise.resolve();

  let releaseMemLock: (() => void) | null = null;
  const currentPromise = new Promise<void>((resolve) => {
    releaseMemLock = resolve;
  });

  memoryLocks.set(
    filePath,
    prevPromise.then(() => currentPromise).catch(() => currentPromise)
  );

  await prevPromise;

  let releaseFileLock: (() => Promise<void>) | null = null;
  try {
    releaseFileLock = await lockfile.lock(filePath, {
      retries: {
        retries: 30,
        factor: 1.5,
        minTimeout: 20,
        maxTimeout: 500,
      },
      stale: 10000,
    });

    return await fn();
  } finally {
    if (releaseFileLock) {
      try {
        await releaseFileLock();
      } catch (e) {
        // Ignore stale/release errors
      }
    }
    if (releaseMemLock) {
      releaseMemLock();
    }
  }
}
