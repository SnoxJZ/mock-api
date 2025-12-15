import { expect, test } from '@playwright/test';

import { resetTestUser } from './utils/cleanup';

test.use({ locale: 'ru-RU' });

test.afterAll(async () => {
  await resetTestUser('joleneunited@tiffincrane.com');
});

test('Complete subscription flow: Checkout -> Success -> Portal -> Cancel', async ({
  page,
}) => {
  test.slow();

  await page.goto('http://localhost:3000/');
  const pricingBtn = page.getByTestId('pricing-button');
  await expect(pricingBtn).toBeVisible({ timeout: 10000 });
  await pricingBtn.click();

  const subscribeBtn = page.getByTestId('subscribe-button');
  await expect(subscribeBtn).toBeVisible();
  await subscribeBtn.click();

  await page.waitForURL(/checkout.stripe.com/, { timeout: 20000 });
  await page.waitForLoadState('domcontentloaded');

  await page.locator('#cardNumber').fill('4242424242424242');
  await page.locator('#cardExpiry').fill('1230');
  await page.locator('#cardCvc').fill('123');
  await page.locator('#billingName').fill('Test User');

  const submitBtn = page.getByTestId('hosted-payment-submit-button');
  await expect(submitBtn).toBeEnabled({ timeout: 10000 });
  await submitBtn.click();

  await page.waitForURL(/\/payment\/success/, { timeout: 60000 });
  expect(page.url()).toContain('session_id=cs_test_');
  await expect(
    page.getByText('Payment Successful', { exact: false }),
  ).toBeVisible();

  const manageBillingBtn = page.getByTestId('manage-billing-button');
  await expect(manageBillingBtn).toBeVisible();
  await manageBillingBtn.click();

  await page.waitForURL(/billing.stripe.com/);
  await page.waitForLoadState('domcontentloaded');

  const cancelBtn = page.locator('[data-test="cancel-subscription"]');
  await expect(cancelBtn).toBeVisible({ timeout: 10000 });
  await cancelBtn.click();

  const confirmBtn = page.getByTestId('confirm');
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  const reasonBtn = page.getByTestId('cancellation_reason_cancel');
  if (await reasonBtn.isVisible()) {
    await reasonBtn.click();
  }

  const returnLink = page.getByTestId('return-to-business-link');
  await expect(returnLink).toBeVisible();
  await returnLink.click();

  await page.waitForURL('http://localhost:3000/');
});

test('Cancel flow: Checkout -> Return to Business -> Verify Toast & URL Cleanup', async ({
  page,
}) => {
  test.slow();

  await page.goto('http://localhost:3000/');
  const pricingBtn = page.getByTestId('pricing-button');
  await expect(pricingBtn).toBeVisible();
  await pricingBtn.click();

  const subscribeBtn = page.getByTestId('subscribe-button');
  await expect(subscribeBtn).toBeVisible();
  await subscribeBtn.click();

  await page.waitForURL(/checkout.stripe.com/, { timeout: 20000 });
  await page.waitForLoadState('domcontentloaded');

  const returnLink = page.getByTestId('business-link');
  await expect(returnLink).toBeVisible({ timeout: 10000 });
  await returnLink.click();

  await page.waitForURL(
    (url) => {
      return (
        url.origin === 'http://localhost:3000' &&
        url.searchParams.has('canceled')
      );
    },
    { timeout: 20000 },
  );

  const toastTitle = page.getByText('Payment canceled');
  const toastDesc = page.getByText("You haven't been charged");

  await expect(toastTitle).toBeVisible();
  await expect(toastDesc).toBeVisible();

  await expect.poll(() => page.url()).not.toContain('canceled=true');
});
