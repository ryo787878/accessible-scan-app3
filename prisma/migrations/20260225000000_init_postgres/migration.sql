-- CreateTable
CREATE TABLE "Scan" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "inputUrl" TEXT NOT NULL,
    "normalizedRootUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "maxPages" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanPage" (
    "id" SERIAL NOT NULL,
    "scanId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "normalizedUrl" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "httpStatus" INTEGER,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AxeViolation" (
    "id" SERIAL NOT NULL,
    "scanPageId" INTEGER NOT NULL,
    "ruleId" TEXT NOT NULL,
    "impact" TEXT,
    "description" TEXT NOT NULL,
    "help" TEXT NOT NULL,
    "helpUrl" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL,
    "nodeCount" INTEGER NOT NULL,
    "nodesJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AxeViolation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scan_publicId_key" ON "Scan"("publicId");

-- CreateIndex
CREATE INDEX "ScanPage_scanId_orderIndex_idx" ON "ScanPage"("scanId", "orderIndex");

-- CreateIndex
CREATE INDEX "AxeViolation_scanPageId_idx" ON "AxeViolation"("scanPageId");

-- AddForeignKey
ALTER TABLE "ScanPage" ADD CONSTRAINT "ScanPage_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AxeViolation" ADD CONSTRAINT "AxeViolation_scanPageId_fkey" FOREIGN KEY ("scanPageId") REFERENCES "ScanPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

