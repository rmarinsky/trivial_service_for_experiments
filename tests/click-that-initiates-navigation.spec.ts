import { test, expect } from "@playwright/test";

test("Approach 1: Sequential await (click then wait)", async ({ page }) => {
  console.log("\n=== APPROACH 1: Sequential await ===");
  console.log("This approach clicks first, then waits for response");

  await page.goto("https://dou.ua/");

  // Click the button first, then wait for response
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] TEST: Clicking button...`);

  await page
    .locator(
      'a[href="https://dou.ua/lenta/articles/top-50-summer-2025/?from=doufp"]'
    )
    .click();

  console.log(`[${new Date().toISOString()}] TEST: Waiting for response...`);
  const response = await page.waitForResponse(
    "**/top-50-summer-2025/?from=doufp"
  );

  const endTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] TEST: Response received after ${
      endTime - startTime
    }ms`
  );

  // Verify response
  expect(response.status()).toBe(200);
  expect(response.url()).toContain("top-50-summer-2025/?from=doufp");
});

test("Approach 2: Promise-first (classic race condition safe)", async ({
  page,
}) => {
  console.log("\n=== APPROACH 2: Promise-first ===");
  console.log("This approach sets up waitForResponse before clicking");

  await page.goto("https://dou.ua/");

  const responsePromise = page.waitForResponse(
    "**/top-50-summer-2025/?from=doufp"
  );
  console.time("Click took");
  await page
    .locator(
      'a[href="https://dou.ua/lenta/articles/top-50-summer-2025/?from=doufp"]'
    )
    .click();

  console.timeEnd("Click took");
  const response = await responsePromise;

  // Verify response
  expect(response.status()).toBe(200);
  expect(response.url()).toContain("top-50-summer-2025/?from=doufp");
});
