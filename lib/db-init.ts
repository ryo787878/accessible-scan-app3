import { db } from "@/lib/db";

let initialized = false;

export async function ensureDbSchema(): Promise<void> {
  if (initialized) return;

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Scan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      publicId TEXT NOT NULL UNIQUE,
      inputUrl TEXT NOT NULL,
      normalizedRootUrl TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      maxPages INTEGER NOT NULL,
      startedAt DATETIME,
      finishedAt DATETIME,
      errorMessage TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ScanPage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scanId INTEGER NOT NULL,
      url TEXT NOT NULL,
      normalizedUrl TEXT NOT NULL,
      orderIndex INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      httpStatus INTEGER,
      errorCode TEXT,
      errorMessage TEXT,
      startedAt DATETIME,
      finishedAt DATETIME,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(scanId) REFERENCES Scan(id) ON DELETE CASCADE
    );
  `);

  await db.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_scan_page_scan_order ON ScanPage(scanId, orderIndex);
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS AxeViolation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scanPageId INTEGER NOT NULL,
      ruleId TEXT NOT NULL,
      impact TEXT,
      description TEXT NOT NULL,
      help TEXT NOT NULL,
      helpUrl TEXT NOT NULL,
      tagsJson TEXT NOT NULL,
      nodeCount INTEGER NOT NULL,
      nodesJson TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(scanPageId) REFERENCES ScanPage(id) ON DELETE CASCADE
    );
  `);

  await db.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_violation_scan_page_id ON AxeViolation(scanPageId);
  `);

  initialized = true;
}
