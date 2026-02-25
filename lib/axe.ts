import AxeBuilder from "@axe-core/playwright";
import axeCore from "axe-core";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "playwright";
import { logger } from "@/lib/logger";

type AxeRunResult = {
  incomplete: Array<{
    id: string;
    impact?: string | null;
    description: string;
    help: string;
    helpUrl: string;
    tags?: string[];
    nodes: Array<Record<string, unknown>>;
  }>;
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

let cachedAxeSource: string | null = null;

function getAxeSource(): string {
  if (cachedAxeSource) return cachedAxeSource;

  // Prefer minified source to reduce payload size when injecting into remote pages.
  // Some environments are unstable with large inline script payloads.
  try {
    const minPath = join(process.cwd(), "node_modules", "axe-core", "axe.min.js");
    cachedAxeSource = readFileSync(minPath, "utf8");
    if (cachedAxeSource.length > 0) return cachedAxeSource;
  } catch {}

  cachedAxeSource = axeCore.source;
  return cachedAxeSource;
}

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
  await page.addScriptTag({ content: getAxeSource() });

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
    ${getAxeSource()}
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
    return await runAxeViaScriptTag(page);
  } catch (scriptTagError) {
    const stateAfterScriptTag = await getAxeRuntimeState(page).catch(() => null);
    logger.warn("axe scriptTag failed", {
      pageUrl: pageUrl ?? page.url(),
      error: scriptTagError instanceof Error ? scriptTagError.message : String(scriptTagError),
      runtimeState: stateAfterScriptTag,
    });

    try {
      return await runAxeViaWrappedSource(page);
    } catch (wrappedError) {
      const stateAfterWrapped = await getAxeRuntimeState(page).catch(() => null);
      logger.warn("axe wrappedSource failed", {
        pageUrl: pageUrl ?? page.url(),
        error: wrappedError instanceof Error ? wrappedError.message : String(wrappedError),
        runtimeState: stateAfterWrapped,
      });

      try {
        return (await new AxeBuilder({ page }).analyze()) as unknown as AxeRunResult;
      } catch (builderError) {
        logger.warn("axe builder fallback failed", {
          pageUrl: pageUrl ?? page.url(),
          error: builderError instanceof Error ? builderError.message : String(builderError),
        });

        const firstMessage = scriptTagError instanceof Error ? scriptTagError.message : String(scriptTagError);
        const secondMessage = wrappedError instanceof Error ? wrappedError.message : String(wrappedError);
        const thirdMessage = builderError instanceof Error ? builderError.message : String(builderError);
        throw new Error(
          `axe analyze failed (scriptTag): ${firstMessage} | (wrapped): ${secondMessage} | (builder): ${thirdMessage}`
        );
      }
    }
  }
}
