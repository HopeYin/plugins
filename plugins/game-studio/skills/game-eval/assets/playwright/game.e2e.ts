import { expect, test, type Page, type TestInfo } from "@playwright/test";
import scenarios from "./scenarios.json";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type ScenarioStep = {
  action?: string;
  count?: number;
  frames?: number;
  expect?: Record<string, JsonValue>;
  screenshot?: string;
};

type GameStudioBridge = {
  ready: boolean;
  reset(seed?: number): void;
  dispatch(action: string): void;
  step(frames?: number): void;
  getState(): JsonValue;
};

type GameStudioWindow = Window & { __GAME_STUDIO__?: GameStudioBridge };

function safeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return `${url.protocol}<redacted>`;
    return `${url.origin}${url.pathname}`;
  } catch {
    return "<unparseable-url>";
  }
}

function captureBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const location = message.location();
    const source = location.url ? safeUrl(location.url) : "<unknown-source>";
    errors.push(`console: ${source}:${location.lineNumber}:${location.columnNumber}`);
  });
  page.on("pageerror", () => errors.push("page: uncaught exception"));
  page.on("requestfailed", (request) => {
    errors.push(`request: ${safeUrl(request.url())} (failed)`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`response: ${response.status()} ${safeUrl(response.url())}`);
  });
  return errors;
}

async function state(page: Page): Promise<JsonValue> {
  return page.evaluate(() => (window as GameStudioWindow).__GAME_STUDIO__!.getState());
}

async function expectSubset(page: Page, subset: Record<string, JsonValue>): Promise<void> {
  const current = await state(page);
  expect(current).toMatchObject(subset);
}

async function checkpoint(page: Page, testInfo: TestInfo, scenarioId: string, stateId: string): Promise<void> {
  await expect(page.locator("[data-game-state]")).toHaveAttribute("data-game-state", stateId);
  await testInfo.attach(`${scenarioId}--${stateId}.json`, {
    body: JSON.stringify(await state(page), null, 2),
    contentType: "application/json"
  });
  await page.screenshot({ path: testInfo.outputPath(`${scenarioId}--${stateId}.png`), fullPage: true });
}

for (const scenario of scenarios.scenarios) {
  test(scenario.id, async ({ page }, testInfo) => {
    const browserErrors = captureBrowserErrors(page);
    try {
      await page.goto(scenarios.baseURL);
      await page.waitForFunction(() => (window as GameStudioWindow).__GAME_STUDIO__?.ready === true);
      await page.evaluate((seed) => (window as GameStudioWindow).__GAME_STUDIO__!.reset(seed), scenario.seed);

      for (const step of scenario.steps as ScenarioStep[]) {
        if (step.action) {
          for (let index = 0; index < (step.count ?? 1); index += 1) {
            await page.evaluate((action) => (window as GameStudioWindow).__GAME_STUDIO__!.dispatch(action), step.action);
          }
        }
        if (step.frames !== undefined) {
          await page.evaluate((frames) => (window as GameStudioWindow).__GAME_STUDIO__!.step(frames), step.frames);
        }
        if (step.expect) await expectSubset(page, step.expect);
        if (step.screenshot) await checkpoint(page, testInfo, scenario.id, step.screenshot);
      }

      expect(browserErrors, "unexpected browser errors").toEqual([]);
    } finally {
      if (browserErrors.length > 0) {
        await testInfo.attach(`${scenario.id}--browser-errors.json`, {
          body: JSON.stringify(browserErrors, null, 2),
          contentType: "application/json"
        });
      }
    }
  });
}
