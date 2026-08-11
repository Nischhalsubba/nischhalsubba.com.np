/**
 * @fileoverview tests/smoke.spec.ts
 * Purpose: Exercise smoke.spec behavior and fail CI when the expected user-facing or build contract regresses.
 * Responsibilities:
 * - Exercise the documented production/user-facing contract with deterministic assertions.
 * - Emit actionable evidence or diagnostics when a regression is detected.
 * Execution context: Node.js/Playwright quality-assurance runtime in local or CI validation.
 * Connected files:
 * - .github/workflows/browser-audit.yml
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", heading: /Memorize the number/i },
  { path: "/tutorial", heading: /Learn Blink & Find|Tutorial|Memorize/i },
  { path: "/practice", heading: /Practice Mode/i },
  { path: "/daily", heading: /Daily Challenge/i },
  { path: "/time-attack", heading: /60-second sprint/i },
  { path: "/streak", heading: /One mistake ends it/i },
  { path: "/comfort", heading: /Bigger, calmer play/i },
  { path: "/zen", heading: /Endless calm boards/i },
  { path: "/challenge?seed=123&size=100&target=42", heading: /Shared board/i },
  { path: "/stats", heading: /Your progress/i },
  { path: "/leaderboard", heading: /Fastest humans/i },
  { path: "/profile", heading: /Player profile/i },
  { path: "/telemetry", heading: /Local analytics/i },
  { path: "/tips", heading: /Get faster/i },
  { path: "/modes", heading: /Choose your kind of play/i },
  { path: "/faq", heading: /Questions, answered/i },
  { path: "/rules", heading: /Rules|How to Play/i },
];

test.describe("core route smoke tests", /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
  for (const route of routes) {
    test(`${route.path} renders`, /** Callback contract: Processes the callback step for test without leaking orchestration details to the caller. Inputs: { page }. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing smoke.spec quality check operation. Inputs: `{ page }`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `{ page }`. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
    });
  }
});

test("home explains the ClearPlay flow and exposes primary navigation", /** Callback contract: Processes the callback step for test without leaking orchestration details to the caller. Inputs: { page }. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing smoke.spec quality check operation. Inputs: `{ page }`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `{ page }`. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/shows you a number/i)).toBeVisible();
  await expect(page.getByText(/Watch/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Play first round/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Learn how it works/i })).toBeVisible();
  await expect(page.getByText(/Play solo/i)).toBeVisible();
  await expect(page.getByText(/Play together/i)).toBeVisible();
  await expect(page.getByText(/Play online/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Daily/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Practice/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Time Attack/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Streak/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Leaderboard/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Profile/i })).toBeVisible();
});

test("shared challenge sanitizes bad URL params without crashing", /** Callback contract: Processes the callback step for test without leaking orchestration details to the caller. Inputs: { page }. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing smoke.spec quality check operation. Inputs: `{ page }`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `{ page }`. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async ({ page }) => {
  await page.goto("/challenge?seed=-999&size=banana&target=999999");

  await expect(page.getByRole("heading", { name: /Shared board/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Start Challenge/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Copy Challenge Link/i })).toBeVisible();
});

test("online setup handles one-player rooms when Supabase is configured", /** Callback contract: Processes the callback step for test without leaking orchestration details to the caller. Inputs: { page }. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing smoke.spec quality check operation. Inputs: `{ page }`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `{ page }`. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async ({ page }) => {
  await page.goto("/online");

  const setupHeading = page.getByRole("heading", { name: /Play with a friend/i });
  const missingConfigHeading = page.getByRole("heading", { name: /Online Play needs Supabase/i });

  if (await missingConfigHeading.isVisible().catch(/** Callback contract: Processes the callback step for missing config heading.is visible() without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Convert or report the rejected asynchronous operation according to this module’s failure-handling policy. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ () => false)) {
    await expect(missingConfigHeading).toBeVisible();
    return;
  }

  await expect(setupHeading).toBeVisible();
  const maxPlayersInput = page.getByLabel(/Max players/i);
  await expect(maxPlayersInput).toHaveAttribute("min", "1");
  await maxPlayersInput.fill("1");
  await expect(page.getByText(/start a solo online room/i)).toBeVisible();
});

test("shared challenge keeps the same seed in copied link UI", /** Callback contract: Processes the callback step for test without leaking orchestration details to the caller. Inputs: { page }. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing smoke.spec quality check operation. Inputs: `{ page }`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `{ page }`. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async ({ page }) => {
  await page.goto("/challenge?seed=123&size=100&target=42");

  await expect(page.getByText(/seed 123/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Start Challenge/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Copy Challenge Link/i })).toBeVisible();
});

test("comfort mode can start a gentle round", /** Callback contract: Processes the callback step for test without leaking orchestration details to the caller. Inputs: { page }. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing smoke.spec quality check operation. Inputs: `{ page }`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `{ page }`. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async ({ page }) => {
  await page.goto("/comfort");
  await page.getByRole("button", { name: /^Start$/i }).click();
  await expect(page.getByText(/Target hides in|Look at the target/i)).toBeVisible();
});

test("sitemap includes production feature routes", /** Callback contract: Processes the callback step for test without leaking orchestration details to the caller. Inputs: { page }. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing smoke.spec quality check operation. Inputs: `{ page }`. Side effects: reads or updates DOM/browser state. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `{ page }`. Side effects: reads or updates DOM/browser state. Returns: Promise resolving after the callback side effects complete. */ async ({ page }) => {
  const response = await page.goto("/sitemap.xml");
  expect(response?.ok()).toBeTruthy();
  const text = await page.textContent("body");

  expect(text).toContain("/challenge");
  expect(text).toContain("/comfort");
  expect(text).toContain("/zen");
  expect(text).toContain("/tips");
  expect(text).toContain("/modes");
  expect(text).toContain("/faq");
  expect(text).toContain("/leaderboard");
  expect(text).toContain("/profile");
});
