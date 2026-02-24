import AxeBuilder from "@axe-core/playwright";
import axeCore from "axe-core";
import type { Page } from "playwright";

type AxeRunResult = {
  violations: Array<{
    id: string;
    impact?: string | null;
    description: string;
    help: string;
    helpUrl: string;
    tags?: string[];
    nodes: Array<Record<string, unknown>>;
  }>;
};

async function resetAxeRuntime(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    try {
      delete w.axe;
    } catch {}
    try {
      delete w.module;
    } catch {}
    try {
      delete w.exports;
    } catch {}
  });
}

async function runAxeViaScriptTag(page: Page): Promise<AxeRunResult> {
  await resetAxeRuntime(page);
  await page.addScriptTag({ content: axeCore.source });

  return page.evaluate(async () => {
    const w = window as unknown as Record<string, unknown> & {
      axe?: {
        run: (context?: Element | Document, options?: Record<string, unknown>) => Promise<unknown>;
      };
    };

    if (!w.axe || typeof w.axe.run !== "function") {
      throw new Error("axe runtime unavailable");
    }

    return w.axe.run(document);
  }) as Promise<AxeRunResult>;
}

export async function runAxe(page: Page): Promise<AxeRunResult> {
  try {
    return (await new AxeBuilder({ page }).analyze()) as AxeRunResult;
  } catch (firstError) {
    try {
      return await runAxeViaScriptTag(page);
    } catch (secondError) {
      const firstMessage = firstError instanceof Error ? firstError.message : String(firstError);
      const secondMessage = secondError instanceof Error ? secondError.message : String(secondError);
      throw new Error(`axe analyze failed (builder): ${firstMessage} | (scriptTag): ${secondMessage}`);
    }
  }
}
