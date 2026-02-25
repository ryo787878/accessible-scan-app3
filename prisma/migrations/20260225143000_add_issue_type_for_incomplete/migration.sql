ALTER TABLE "AxeViolation"
ADD COLUMN "issueType" TEXT NOT NULL DEFAULT 'violation';

CREATE INDEX "AxeViolation_scanPageId_issueType_idx"
ON "AxeViolation"("scanPageId", "issueType");
