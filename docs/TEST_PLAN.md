# CheckoutIQ — Test Plan & Quality Assurance Strategy

## 1. Executive Summary & Objective
**CheckoutIQ** is a high-precision commerce checkout interface coupled with an automated Playwright testing framework built for the **Fynd Hiring Hackathon 2026 (SDET Intern Challenge)**. 

The primary objective is to prove functional correctness, deterministic mathematical calculations, rigorous input validation, accessibility, and concurrency resilience against duplicate transactions using reproducible browser automation.

---

## 2. Scope & Target System
- **Application Under Test (AUT):** CheckoutIQ Client (React 18 + Vite + TypeScript + Tailwind CSS).
- **Environment:** Standalone deterministic local environment (zero external database/network dependency).
- **Test Automation Runner:** Playwright Test Suite executing on Chromium (Headless by default; headed capability configured).
- **Monetary Unit:** Integer paise (1 INR = 100 paise) internally to eliminate IEEE-754 floating-point inaccuracies.

---

## 3. Test Architecture & Fixtures

### 3.1 Synthetic Inventory Fixture
Deterministic product items with fixed pricing:
| Product ID | Product Name | Fixed Price (INR) | Price in Paise |
| :--- | :--- | :--- | :--- |
| `prod-wireless-mouse` | Wireless Mouse | ₹799 | 79,900 paise |
| `prod-mechanical-keyboard` | Mechanical Keyboard | ₹1,999 | 199,900 paise |

### 3.2 Playwright Selector Strategy
To prevent test flakiness and maintain accessibility best practices:
- **Primary Locators:** `data-testid` attributes on interactive components (`data-testid="place-order-button"`, `data-testid="order-confirmation"`, `data-testid="customer-name-input"`).
- **Semantic Roles:** ARIA roles and accessible names (`getByRole('button', { name: /Place Order/i })`).
- **Isolation Policy:** Every automated test operates in a fresh browser context (`beforeEach` navigation to `/`).
- **Assertion Principle:** Auto-waiting web-first assertions (`expect(locator).toBeVisible()`, `expect(locator).toHaveText()`) with **zero arbitrary timeouts (`sleep`/`waitForTimeout`)**.

---

## 4. Test Matrix & Coverage (11 Automated Specs)

| ID | Title | Test Category | Priority | Assertions Verified |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Successful Checkout Flow | Positive / E2E | Critical | • Confirmation heading visible<br>• Confirmed customer name exact match<br>• Unique reference ID generated (`ORD-*`)<br>• Total paid matches ₹799<br>• Exactly one confirmation element rendered |
| **TC-02** | Missing Required Customer Name | Negative / Validation | Critical | • Inline validation error displayed<br>• Order confirmation is not rendered<br>• Cart contents & line totals preserved |
| **TC-03** | Exact Quantity & Line Total Calculation | Math / Precision | Critical | • Quantity increments to 2<br>• Line total matches exact ₹1,598<br>• Overall order total updates to ₹1,598 |
| **TC-04** | Empty Cart Checkout Guard | Negative / Boundary | High | • Empty cart error displayed<br>• Order placement blocked |
| **TC-05** | Rapid Double-Click Concurrency Guard | Concurrency / Idempotency | Critical | • Rapid double click creates exactly one order<br>• Single order reference generated |
| **TC-06** | Item Removal Cart Updates | State Management | High | • Removing an item updates cart count immediately<br>• Order total decreases immediately to remaining item's price |
| **TC-07** | Quantity Decrement Boundary Protection | Boundary / Invariants | High | • Decrementing at quantity 1 removes product<br>• No negative or zero quantities displayed |
| **TC-08** | Removing Final Item Restores Empty State | UI / Lifecycle | High | • Removing last cart item restores empty cart placeholder<br>• Cart total badge updates to 0 |
| **TC-09** | Validation Failure Preserves Input & Cart | UX / State Preservation | High | • Customer name input retained after validation errors<br>• Cart selections preserved intact |
| **TC-10** | Accessible Keyboard Navigation Checkout | Accessibility / Keyboard | High | • Add to cart via keyboard focus and Enter key<br>• Form submission via keyboard Enter key in text input |
| **TC-11** | Completed Order Cannot Be Duplicated | Concurrency / Lifecycle | Critical | • Order confirmation view unmounts checkout form<br>• Subsequent submission attempts cannot produce second order |

---

## 5. Manual Testing Strategy (docs/MANUAL_TESTING.md)

| ID | Scenario | Priority | Criteria |
| :--- | :--- | :--- | :--- |
| **MT-01** | Place order with 0 items in cart | Critical | Checkout blocked with visible feedback; order not created |
| **MT-02** | Rapid double-click on Place Order button | Critical | Synchronous ref lock absorbs duplicate event; exactly 1 order placed |

---

## 6. Execution Command Matrix
```bash
# Typecheck TypeScript source
npm run typecheck

# Build production bundle
npm run build

# Execute headless automation test suite
npm test

# Execute with visible browser (headed)
npm run test:headed

# Open Playwright HTML interactive test report
npm run test:report
```
