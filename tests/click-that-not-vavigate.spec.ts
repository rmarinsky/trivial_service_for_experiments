import {test} from "@playwright/test";

test('Sequential await (click then wait) without NAVIGATION', async ({page}) => {
  await page.goto("https://travisperkins.co.uk/login")
  await page.locator("#onetrust-accept-btn-handler").click()
  await page.getByTestId("close-button").click()
  const frameLocator = page.getByTestId("oauth-iframe").contentFrame();
  await frameLocator.locator("#username").fill("alsdkfjlasdkjf@asdfkj.com")
  await frameLocator.locator("#password").fill("alsdkfjlasdkjf@asdfkj.com")
  await frameLocator.locator("#kc-form-buttons").click()


  await page.waitForResponse(response =>
    response.url().includes("login-actions/authenticate")
  );

})