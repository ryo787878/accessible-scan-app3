let warned = false;

export async function ensureDbSchema(): Promise<void> {
  if (warned) return;

  warned = true;
  if (process.env.NODE_ENV !== "production") {
    console.warn("DB schema is managed by Prisma migrations. Run `npx prisma migrate dev` before starting the app.");
  }
}
