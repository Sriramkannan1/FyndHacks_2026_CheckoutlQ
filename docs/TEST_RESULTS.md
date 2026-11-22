# CheckoutIQ — Test Execution Results Report

## 1. Execution Overview

- **Test Suite:** `tests/checkout.spec.ts` + `tests/screenshots.spec.ts`
- **Runner:** Playwright v1.65.1 (Chromium Desktop Headless)
- **Host Platform:** Windows 11 (win32-x64)
- **Node.js Version:** v22.14.0
- **Execution Date:** 22 November 2026
- **Total Specs Executed:** 12
- **Passed:** 12 (100%)
- **Failed:** 0 (0%)
- **Flaky / Retried:** 0 (0%)
- **Total Suite Execution Time:** 20.9 seconds

---

## 2. Granular Test Execution Matrix

| Test ID | Test Scenario | Status | Duration | Evidence / Assertion Proof |
| :--- | :--- | :---: | :---: | :--- |
| **TC-01** | Successful checkout with valid customer details | **PASSED** | 2,300 ms | `expect(orderConfirmation).toBeVisible()`<br>`expect(confirmedName).toHaveText('Alex Morgan')`<br>`expect(orderRef).toContainText('ORD-')`<br>`expect(orderConfirmation).toHaveCount(1)` |
| **TC-02** | Missing required customer name blocks checkout | **PASSED** | 1,100 ms | `expect(validationError).toBeVisible()`<br>`expect(validationError).toHaveText('Please enter your full name to proceed with checkout.')`<br>`expect(orderConfirmation).not.toBeVisible()`<br>`expect(cartItem).toBeVisible()` |
| **TC-03** | Quantity calculation updates line & order total | **PASSED** | 1,100 ms | `expect(quantity).toHaveText('2')`<br>`expect(lineTotal).toHaveText('₹1,598')`<br>`expect(orderTotal).toHaveText('₹1,598')` |
| **TC-04** | Empty cart checkout guard blocks submission | **PASSED** | 940 ms | `expect(validationError).toBeVisible()`<br>`expect(validationError).toHaveText('Your cart is empty. Please add at least one product to checkout.')`<br>`expect(orderConfirmation).not.toBeVisible()` |
| **TC-05** | Rapid double-click protection produces 1 order | **PASSED** | 1,100 ms | `await placeOrderBtn.dblclick()`<br>`expect(orderConfirmation).toHaveCount(1)`<br>`expect(orderReference).toHaveCount(1)` |
| **TC-06** | Removing an item updates cart count and order total | **PASSED** | 1,200 ms | `await removeMouseBtn.click()`<br>`expect(mouseItem).not.toBeVisible()`<br>`expect(orderTotal).toHaveText('₹1,999')` |
| **TC-07** | Decrementing quantity boundary protection | **PASSED** | 905 ms | `await decrementBtn.click()`<br>`expect(cartItem).not.toBeVisible()`<br>`expect(emptyCartState).toBeVisible()` |
| **TC-08** | Removing the final item produces empty-cart state | **PASSED** | 1,000 ms | `await removeBtn.click()`<br>`expect(emptyCartState).toBeVisible()`<br>`expect(orderTotalCount).toHaveText('0 items')` |
| **TC-09** | Validation failure preserves input and cart | **PASSED** | 1,200 ms | `expect(customerInput).toHaveValue('Sam Taylor')`<br>`expect(cartItem).toBeVisible()` |
| **TC-10** | Keyboard navigation and submission | **PASSED** | 1,000 ms | `await page.keyboard.press('Enter')`<br>`expect(orderConfirmation).toBeVisible()`<br>`expect(confirmedName).toHaveText('Robin Buckley')` |
| **TC-11** | Completed order cannot be duplicated | **PASSED** | 1,100 ms | `expect(placeOrderBtn).not.toBeVisible()`<br>`expect(orderConfirmation).toHaveCount(1)` |
| **VIS-01** | Visual evidence portfolio screenshot generation | **PASSED** | 1,900 ms | 5 full-page visual evidence screenshots captured cleanly in `evidence/screenshots/` |

---

## 3. Playwright Artifacts & Evidence
- **HTML Interactive Report:** `evidence/test-reports/html/index.html` (Accessible via `npm run test:report`)
- **Machine-Readable JSON Report:** `evidence/test-reports/test-results.json`
- **Captured Visual Proof:** `evidence/screenshots/`
  1. `01_checkout_catalog_initial.png` — Curated product grid and initial clean checkout workspace
  2. `02_cart_item_added.png` — Real-time line item updates and live subtotal
  3. `03_validation_error_missing_name.png` — Inline accessible validation error
  4. `04_order_confirmation_success.png` — Success screen with unique order reference
  5. `05_quality_lab_dashboard.png` — Quality Lab execution results view

---

## 4. Test Sign-off Statement
All 12 automated test cases executed cleanly against Chromium with zero flaky runs and zero arbitrary timeouts. The test suite adheres strictly to modern web-first assertions and verifies customer-visible states.
