import { test, expect } from '@playwright/test';

test.describe('CheckoutIQ Visual Evidence Capture', () => {
  test('Capture visual screenshots for evidence portfolio', async ({ page }) => {
    // 1. Checkout page with an empty cart
    await page.goto('/');
    await expect(page.getByTestId('nav-checkout')).toBeVisible();
    await expect(page.getByTestId('empty-cart-state')).toBeVisible();
    await page.screenshot({ path: 'evidence/screenshots/01_checkout_empty_cart.png', fullPage: true });

    // 2. Checkout page with both products and quantities in the cart
    await page.getByTestId('add-to-cart-prod-wireless-mouse').click();
    await page.getByTestId('add-to-cart-prod-mechanical-keyboard').click();
    await page.getByTestId('increment-prod-wireless-mouse').click(); // Qty 2 mouse, Qty 1 keyboard
    await expect(page.getByTestId('order-total')).toHaveText('₹3,597'); // (799*2) + 1999 = 3597
    await page.screenshot({ path: 'evidence/screenshots/02_checkout_both_products_in_cart.png', fullPage: true });

    // 3. Validation error state (missing name)
    await page.getByTestId('place-order-button').click();
    await expect(page.getByTestId('validation-error')).toBeVisible();
    await page.screenshot({ path: 'evidence/screenshots/03_validation_error_missing_name.png', fullPage: true });

    // 4. Fill customer name & complete order
    await page.getByTestId('customer-name-input').fill('Alex Morgan');
    await page.getByTestId('place-order-button').click();
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByText('Order total')).toBeVisible();
    await page.screenshot({ path: 'evidence/screenshots/04_order_confirmation_success.png', fullPage: true });

    // 5. Quality Lab View
    await page.getByTestId('nav-quality-lab').click();
    await expect(page.getByText('Quality Lab & Automation Reports')).toBeVisible();
    await expect(page.getByText('Actual Execution Data Loaded')).toBeVisible();
    await expect(page.getByText('verified', { exact: true })).toBeVisible();
    await page.screenshot({ path: 'evidence/screenshots/05_quality_lab_dashboard.png', fullPage: true });
  });
});
