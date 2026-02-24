import AxeBuilder from "@axe-core/playwright";
import axeCore from "axe-core";
import type { Page } from "playwright";
import { logger } from "@/lib/logger";

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

type AxeRuntimeState = {
  hasAxe: boolean;
  axeType: string;
  hasModule: boolean;
  hasExports: boolean;
  hasDefine: boolean;
  readyState: string;
  cspMeta: string | null;
};

async function getAxeRuntimeState(page: Page): Promise<AxeRuntimeState> {
  return page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return {
      hasAxe: Boolean((w as { axe?: unknown }).axe),
      axeType: typeof (w as { axe?: unknown }).axe,
      hasModule: typeof (w as { module?: unknown }).module !== "undefined",
      hasExports: typeof (w as { exports?: unknown }).exports !== "undefined",
      hasDefine: typeof (w as { define?: unknown }).define !== "undefined",
      readyState: document.readyState,
      cspMeta: meta?.getAttribute("content") ?? null,
    };
  });
}

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

async function runAxeViaWrappedSource(page: Page): Promise<AxeRunResult> {
  await resetAxeRuntime(page);

  // Force CommonJS-style export path to avoid collisions with page-side globals.
  const wrappedSource = `
  ;(() => {
    const module = { exports: {} };
    const exports = module.exports;
    ${axeCore.source}
    if (!window.axe && module.exports && typeof module.exports.run === "function") {
      window.axe = module.exports;
    }
  })();
  `;

  await page.addScriptTag({ content: wrappedSource });

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

export async function runAxe(page: Page, pageUrl?: string): Promise<AxeRunResult> {
  try {
    return (await new AxeBuilder({ page }).analyze()) as unknown as AxeRunResult;
  } catch (firstError) {
    logger.warn("axe builder failed", {
      pageUrl: pageUrl ?? page.url(),
      error: firstError instanceof Error ? firstError.message : String(firstError),
    });

    try {
      return await runAxeViaScriptTag(page);
    } catch (secondError) {
      const stateAfterScriptTag = await getAxeRuntimeState(page).catch(() => null);
      logger.warn("axe scriptTag fallback failed", {
        pageUrl: pageUrl ?? page.url(),
        error: secondError instanceof Error ? secondError.message : String(secondError),
        runtimeState: stateAfterScriptTag,
      });

      try {
        return await runAxeViaWrappedSource(page);
      } catch (thirdError) {
        const stateAfterWrapped = await getAxeRuntimeState(page).catch(() => null);
        logger.warn("axe wrappedSource fallback failed", {
          pageUrl: pageUrl ?? page.url(),
          error: thirdError instanceof Error ? thirdError.message : String(thirdError),
          runtimeState: stateAfterWrapped,
        });

        const firstMessage = firstError instanceof Error ? firstError.message : String(firstError);
        const secondMessage = secondError instanceof Error ? secondError.message : String(secondError);
        const thirdMessage = thirdError instanceof Error ? thirdError.message : String(thirdError);
        throw new Error(
          `axe analyze failed (builder): ${firstMessage} | (scriptTag): ${secondMessage} | (wrapped): ${thirdMessage}`
        );
      }
    }
  }
}
