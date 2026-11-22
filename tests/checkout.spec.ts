import { test, expect } from '@playwright/test';

test.describe('CheckoutIQ Automation Suite', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Each test starts from a clean browser context and navigates to the application
    await page.goto('/');
    await expect(page.getByTestId('nav-checkout')).toBeVisible();
  });

  // TC-01: Positive E2E Successful Checkout
  test('TC-01: Successful checkout with valid customer details', async ({ page }) => {
    // 1. Start from clean page and verify products are displayed
    const wirelessMouseCard = page.getByTestId('product-card-prod-wireless-mouse');
    await expect(wirelessMouseCard).toBeVisible();

    // 2. Add Wireless Mouse to cart
    const addMouseBtn = page.getByTestId('add-to-cart-prod-wireless-mouse');
    await addMouseBtn.click();

    // 3. Verify item in cart and live subtotal
    const cartItem = page.getByTestId('cart-item-prod-wireless-mouse');
    await expect(cartItem).toBeVisible();
    await expect(page.getByTestId('quantity-prod-wireless-mouse')).toHaveText('1');
    await expect(page.getByTestId('order-total')).toHaveText('₹799');

    // 4. Enter customer name
    const customerInput = page.getByTestId('customer-name-input');
    await expect(customerInput).toBeVisible();
    await customerInput.fill('Alex Morgan');

    // 5. Place order
    const placeOrderBtn = page.getByTestId('place-order-button');
    await placeOrderBtn.click();

    // 6. Assertions on Order Confirmation
    const orderConfirmation = page.getByTestId('order-confirmation');
    await expect(orderConfirmation).toBeVisible();

    // Assert confirmation heading
    const confirmationHeading = page.getByTestId('confirmation-heading');
    await expect(confirmationHeading).toBeVisible();
    await expect(confirmationHeading).toHaveText('Order Confirmed!');

    // Assert customer name is correct
    const confirmedName = page.getByTestId('confirmed-customer-name');
    await expect(confirmedName).toBeVisible();
    await expect(confirmedName).toHaveText('Alex Morgan');

    // Assert order reference exists and is formatted correctly
    const orderRef = page.getByTestId('order-reference');
    await expect(orderRef).toBeVisible();
    await expect(orderRef).toContainText('ORD-');

    // Assert confirmed total matches expected value
    await expect(page.getByTestId('confirmed-order-total')).toHaveText('₹799');

    // Assert exactly one confirmation exists in the DOM
    await expect(page.getByTestId('order-confirmation')).toHaveCount(1);
  });

  // TC-02: Missing Required Field Validation
  test('TC-02: Missing required customer name blocks checkout and preserves cart', async ({ page }) => {
    // 1. Add Wireless Mouse to cart
    const addMouseBtn = page.getByTestId('add-to-cart-prod-wireless-mouse');
    await addMouseBtn.click();

    const cartItem = page.getByTestId('cart-item-prod-wireless-mouse');
    await expect(cartItem).toBeVisible();

    // 2. Leave customer name blank
    const customerInput = page.getByTestId('customer-name-input');
    await expect(customerInput).toHaveValue('');

    // 3. Click Place Order
    const placeOrderBtn = page.getByTestId('place-order-button');
    await placeOrderBtn.click();

    // 4. Assert inline validation message is visible
    const validationError = page.getByTestId('validation-error');
    await expect(validationError).toBeVisible();
    await expect(validationError).toHaveText('Please enter your full name to proceed with checkout.');

    // 5. Assert order confirmation is NOT displayed
    const orderConfirmation = page.getByTestId('order-confirmation');
    await expect(orderConfirmation).not.toBeVisible();

    // 6. Assert cart contents remain unchanged and preserved
    await expect(cartItem).toBeVisible();
    await expect(page.getByTestId('quantity-prod-wireless-mouse')).toHaveText('1');
    await expect(page.getByTestId('order-total')).toHaveText('₹799');
  });

  // TC-03: Mathematical Precision in Currency and Quantity
  test('TC-03: Quantity calculation updates line total and order total accurately', async ({ page }) => {
    // 1. Add Wireless Mouse to cart
    const addMouseBtn = page.getByTestId('add-to-cart-prod-wireless-mouse');
    await addMouseBtn.click();

    // 2. Assert initial quantity and total
    await expect(page.getByTestId('quantity-prod-wireless-mouse')).toHaveText('1');
    await expect(page.getByTestId('line-total-prod-wireless-mouse')).toHaveText('₹799');
    await expect(page.getByTestId('order-total')).toHaveText('₹799');

    // 3. Increase quantity to 2
    const incrementBtn = page.getByTestId('increment-prod-wireless-mouse');
    await incrementBtn.click();

    // 4. Assert updated quantity equals 2
    const quantity = page.getByTestId('quantity-prod-wireless-mouse');
    await expect(quantity).toHaveText('2');

    // 5. Assert line total equals INR 1,598 (₹799 * 2)
    const lineTotal = page.getByTestId('line-total-prod-wireless-mouse');
    await expect(lineTotal).toHaveText('₹1,598');

    // 6. Assert overall order total equals INR 1,598
    const orderTotal = page.getByTestId('order-total');
    await expect(orderTotal).toHaveText('₹1,598');
  });

  // TC-04: Empty Cart Boundary Guard
  test('TC-04: Empty cart checkout guard blocks submission', async ({ page }) => {
    // 1. Ensure cart is empty
    await expect(page.getByTestId('empty-cart-state')).toBeVisible();

    // 2. Enter customer name
    const customerInput = page.getByTestId('customer-name-input');
    await customerInput.fill('Jordan Lee');

    // 3. Attempt to place order with 0 items
    const placeOrderBtn = page.getByTestId('place-order-button');
    await placeOrderBtn.click();

    // 4. Assert empty cart validation message
    const validationError = page.getByTestId('validation-error');
    await expect(validationError).toBeVisible();
    await expect(validationError).toHaveText(
      'Your cart is empty. Please add at least one product to checkout.'
    );

    // 5. Assert order is not placed
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();
  });

  // TC-05: Concurrency & Duplicate Click Protection
  test('TC-05: Rapid double-click protection produces exactly one order', async ({ page }) => {
    // 1. Add Mechanical Keyboard
    await page.getByTestId('add-to-cart-prod-mechanical-keyboard').click();
    await expect(page.getByTestId('cart-item-prod-mechanical-keyboard')).toBeVisible();

    // 2. Enter customer name
    await page.getByTestId('customer-name-input').fill('Taylor Swift');

    // 3. Perform rapid double click on Place Order button
    const placeOrderBtn = page.getByTestId('place-order-button');
    await placeOrderBtn.dblclick();

    // 4. Assert exactly one order confirmation is displayed
    const orderConfirmation = page.getByTestId('order-confirmation');
    await expect(orderConfirmation).toBeVisible();
    await expect(page.getByTestId('order-confirmation')).toHaveCount(1);

    // 5. Assert only a single order reference is present
    await expect(page.getByTestId('order-reference')).toHaveCount(1);
    await expect(page.getByTestId('confirmed-order-total')).toHaveText('₹1,999');
  });

  // TC-06: Item Removal Updates Cart Count and Order Total
  test('TC-06: Removing an item updates cart count and order total immediately', async ({ page }) => {
    // 1. Add both items to cart: Wireless Mouse (₹799) + Mechanical Keyboard (₹1,999)
    await page.getByTestId('add-to-cart-prod-wireless-mouse').click();
    await page.getByTestId('add-to-cart-prod-mechanical-keyboard').click();

    // 2. Verify total equals ₹2,798 and count is 2 items
    await expect(page.getByTestId('order-total')).toHaveText('₹2,798');
    await expect(page.getByTestId('order-total-count')).toHaveText('2 items');

    // 3. Remove Wireless Mouse
    const removeMouseBtn = page.getByTestId('remove-prod-wireless-mouse');
    await removeMouseBtn.click();

    // 4. Assert mouse is removed and keyboard remains
    await expect(page.getByTestId('cart-item-prod-wireless-mouse')).not.toBeVisible();
    await expect(page.getByTestId('cart-item-prod-mechanical-keyboard')).toBeVisible();

    // 5. Assert updated order total and count reflect only Mechanical Keyboard
    await expect(page.getByTestId('order-total')).toHaveText('₹1,999');
    await expect(page.getByTestId('order-total-count')).toHaveText('1 item');
    await expect(page.getByTestId('header-cart-count')).toHaveText('1');
  });

  // TC-07: Decrementing Quantity Boundary Protection
  test('TC-07: Decrementing quantity does not produce an invalid negative quantity', async ({ page }) => {
    // 1. Add Wireless Mouse
    await page.getByTestId('add-to-cart-prod-wireless-mouse').click();
    await expect(page.getByTestId('quantity-prod-wireless-mouse')).toHaveText('1');

    // 2. Decrement quantity from 1
    const decrementBtn = page.getByTestId('decrement-prod-wireless-mouse');
    await decrementBtn.click();

    // 3. Assert product is cleanly removed and no negative or zero quantity is rendered
    await expect(page.getByTestId('cart-item-prod-wireless-mouse')).not.toBeVisible();
    await expect(page.getByTestId('empty-cart-state')).toBeVisible();
    await expect(page.getByTestId('header-cart-count')).not.toBeVisible();
  });

  // TC-08: Removing Final Item Restores Empty Cart State
  test('TC-08: Removing the final item produces the correct empty-cart state', async ({ page }) => {
    // 1. Add Mechanical Keyboard
    await page.getByTestId('add-to-cart-prod-mechanical-keyboard').click();
    await expect(page.getByTestId('cart-item-prod-mechanical-keyboard')).toBeVisible();

    // 2. Click Remove button on the only item
    await page.getByTestId('remove-prod-mechanical-keyboard').click();

    // 3. Assert empty cart state container is displayed
    await expect(page.getByTestId('empty-cart-state')).toBeVisible();
    await expect(page.getByTestId('empty-cart-summary')).toBeVisible();
    await expect(page.getByTestId('order-total-count')).toHaveText('0 items');
  });

  // TC-09: Validation Error Preserves User Input and Cart Contents
  test('TC-09: Validation failure preserves both customer input and cart contents', async ({ page }) => {
    // 1. Add Wireless Mouse
    await page.getByTestId('add-to-cart-prod-wireless-mouse').click();

    // 2. Trigger customer name validation error by leaving name blank
    await page.getByTestId('place-order-button').click();
    await expect(page.getByTestId('validation-error')).toBeVisible();
    await expect(page.getByTestId('cart-item-prod-wireless-mouse')).toBeVisible();

    // 3. Enter customer name
    const customerInput = page.getByTestId('customer-name-input');
    await customerInput.fill('Sam Taylor');

    // 4. Remove the item to make the cart empty
    await page.getByTestId('remove-prod-wireless-mouse').click();

    // 5. Attempt checkout with empty cart
    await page.getByTestId('place-order-button').click();
    await expect(page.getByTestId('validation-error')).toHaveText(
      'Your cart is empty. Please add at least one product to checkout.'
    );

    // 6. Assert customer name input remains preserved
    await expect(customerInput).toHaveValue('Sam Taylor');
  });

  // TC-10: Complete Checkout via Accessible Keyboard Navigation
  test('TC-10: Checkout can be operated using keyboard navigation and keyboard submission', async ({ page }) => {
    // 1. Focus Add to Cart button for Wireless Mouse and trigger with Enter
    const addMouseBtn = page.getByTestId('add-to-cart-prod-wireless-mouse');
    await addMouseBtn.focus();
    await page.keyboard.press('Enter');

    // 2. Assert item was added to cart
    await expect(page.getByTestId('cart-item-prod-wireless-mouse')).toBeVisible();

    // 3. Focus customer name input, type name, and press Enter to submit form
    const customerInput = page.getByTestId('customer-name-input');
    await customerInput.focus();
    await page.keyboard.type('Robin Buckley');
    await page.keyboard.press('Enter');

    // 4. Assert order confirmation was triggered and customer name matches
    const orderConfirmation = page.getByTestId('order-confirmation');
    await expect(orderConfirmation).toBeVisible();
    await expect(page.getByTestId('confirmed-customer-name')).toHaveText('Robin Buckley');
  });

  // TC-11: Completed Order Cannot Be Duplicated
  test('TC-11: A completed order cannot be duplicated through repeated submission', async ({ page }) => {
    // 1. Place an initial order
    await page.getByTestId('add-to-cart-prod-wireless-mouse').click();
    await page.getByTestId('customer-name-input').fill('Dustin Henderson');
    await page.getByTestId('place-order-button').click();

    // 2. Assert confirmation is displayed
    const orderConfirmation = page.getByTestId('order-confirmation');
    await expect(orderConfirmation).toBeVisible();

    // 3. Assert Place Order button is no longer present in DOM
    await expect(page.getByTestId('place-order-button')).not.toBeVisible();

    // 4. Attempt keyboard Enter key submissions
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    // 5. Assert only 1 order confirmation and 1 order reference remain
    await expect(page.getByTestId('order-confirmation')).toHaveCount(1);
    await expect(page.getByTestId('order-reference')).toHaveCount(1);
  });
});
