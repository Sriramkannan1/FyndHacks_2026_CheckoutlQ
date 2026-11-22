# CheckoutIQ — Defect Tracking & Resolution Log

This document records the engineering audit, defect detection, root cause analyses, and verified resolutions identified during the development and testing cycle of **CheckoutIQ**.

---

## Defect Summary Table

| Defect ID | Severity | Category | Status | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | High | Concurrency | **RESOLVED** | Potential race condition allowing duplicate orders during rapid button clicking |
| **BUG-02** | Medium | State Management | **RESOLVED** | Input cleared prematurely upon validation failure |
| **BUG-03** | High | Business Logic | **RESOLVED** | Floating-point imprecision risk in line and order total summation |
| **BUG-04** | Low | Configuration | **RESOLVED** | `npm run test:report` targeted default folder rather than `evidence/test-reports/html` |

---

## Detailed Defect Records

### BUG-01: Rapid Double-Click Duplicate Order Creation
- **Severity:** High
- **Component:** `CustomerForm.tsx` & `App.tsx`
- **Description:** In initial React prototyping, the `Place Order` button was protected only by React state (`disabled={isSubmitting}`). Because React batches state updates asynchronously, two clicks fired in rapid succession (<50ms) can both enter the submission handler before the component re-renders into a disabled state, causing two orders and two order IDs to be generated.
- **Root Cause:** Asynchronous state scheduling in React 18 event loops.
- **Resolution:** Implemented a synchronous reference lock (`isSubmittingRef = useRef(false)`) directly inside the event handler. When the first click is handled, `isSubmittingRef.current` is set to `true` synchronously before state triggers, cleanly blocking any concurrent click.
- **Verification:** Verified via manual rapid double-click testing and automated Playwright test `TC-05` (`dblclick()`). Exactly one confirmation and one order ID were created.

---

### BUG-02: Form State Reset on Validation Failure
- **Severity:** Medium
- **Component:** `CustomerForm.tsx`
- **Description:** If a user attempted to place an order when their cart was empty or if their name was modified, form state should be preserved so the user does not have to re-enter information.
- **Root Cause:** Uncontrolled form inputs or blanket form resets triggered on invalid submission events.
- **Resolution:** Explicitly decoupled input state (`customerName`) from form validation state. Form values persist until explicitly reset via the "Start New Order" action.
- **Verification:** Verified via `TC-02` and `TC-09` where customer input and cart quantities remained preserved after validation failures.

---

### BUG-03: IEEE-754 Floating-Point Inaccuracies in Currency Calculations
- **Severity:** High
- **Component:** `currency.ts`
- **Description:** Using standard JavaScript floating-point numbers (`0.1 + 0.2 !== 0.3`) for currency math can produce subtle rounding discrepancies (e.g., `1598.0000000000002`).
- **Root Cause:** IEEE-754 double-precision floating-point arithmetic.
- **Resolution:** Represented all monetary figures in integer paise (1 INR = 100 paise) throughout data models, cart calculations, and total aggregations. Conversion to rupees occurs strictly at display time via `formatINR()`.
- **Verification:** Verified via `TC-03` asserting deterministic exact totals (`₹1,598`).

---

### BUG-04: Misconfigured Playwright Show-Report Command
- **Severity:** Low
- **Component:** `package.json`
- **Description:** Running `npm run test:report` looked in the default `playwright-report` directory, throwing `"No report found"`, while `playwright.config.ts` was configured to write to `evidence/test-reports/html`.
- **Root Cause:** Missing target directory parameter in `playwright show-report` script definition.
- **Resolution:** Updated `package.json` script definition to `playwright show-report evidence/test-reports/html`.
- **Verification:** Verified that `npm run test:report` properly points to `evidence/test-reports/html`.

---

## Current Regression Status
As of 22 November 2026, **0 open blocking or major defects** exist. All 11 automated Playwright test specs pass deterministically.
