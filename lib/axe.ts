import AxeBuilder from "@axe-core/playwright";
import axeCore from "axe-core";
import type { Page } from "playwright";

async function prepareAxeGlobals(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;

    if (!w.module) {
      w.module = { exports: {} } as { exports: unknown };
    } else if (
      typeof w.module === "object" &&
      w.module !== null &&
      !("exports" in w.module)
    ) {
      (w.module as { exports?: unknown }).exports = {};
    }

    if (typeof w.exports === "undefined") {
      w.exports = (w.module as { exports?: unknown }).exports;
    }
  });
}

async function runAxeFallback(page: Page) {
  return page.evaluate(
    async (source) => {
      const w = window as unknown as Record<string, unknown> & {
        axe?: {
          run: (
            context?: Element | Document,
            options?: Record<string, unknown>
          ) => Promise<unknown>;
        };
        module?: { exports?: unknown } | unknown;
      };

      if (!w.module) {
        w.module = { exports: {} } as { exports: unknown };
      }

      // Evaluate axe source directly in the same world where we run axe.
      (0, eval)(source);

      if (
        !w.axe &&
        typeof w.module === "object" &&
        w.module !== null &&
        "exports" in w.module
      ) {
        w.axe = (w.module as { exports?: unknown }).exports as typeof w.axe;
      }

      if (!w.axe || typeof w.axe.run !== "function") {
        throw new Error("axe runtime unavailable");
      }

      return w.axe.run(document);
    },
    axeCore.source
  ) as Promise<{
    violations: Array<{
      id: string;
      impact?: string | null;
      description: string;
      help: string;
      helpUrl: string;
      tags?: string[];
      nodes: Array<Record<string, unknown>>;
    }>;
  }>;
}

export async function runAxe(page: Page) {
  await prepareAxeGlobals(page);

  try {
    return await new AxeBuilder({
      page,
      axeSource: axeCore.source,
    }).analyze();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("module is not defined")) {
      throw error;
    }

    return runAxeFallback(page);
  }
}
