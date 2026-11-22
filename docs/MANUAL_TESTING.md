# CheckoutIQ — Manual Quality & Concurrency Audit Log

This document records the manual testing sessions conducted on the **CheckoutIQ** web application running locally at `http://127.0.0.1:5173/` on Windows 11 (Google Chrome Browser version 131.0.6778.86).

---

## Manual Test Record 01: Submit with an Empty Cart

- **Test ID:** `MT-01`
- **Scenario:** Place order attempt when 0 products are added to the cart
- **Objective:** Verify that an empty cart strictly prevents order completion, displays an inline accessible alert, does not wipe entered customer data, and never renders an order confirmation reference.
- **Tester:** SDET Intern Candidate
- **Execution Date & Time:** 22 November 2026, 19:10 IST
- **Target URL:** `http://127.0.0.1:5173/`

### Test Pre-conditions
1. Browser context opened in clean state.
2. Initial navigation to `http://127.0.0.1:5173/`.
3. Cart item count is 0.
4. "Cart is currently empty" empty-state graphic and text are visible in the Order Summary panel.

### Execution Steps
1. Navigate to the Checkout workspace.
2. Do **not** click "Add to Cart" on any product.
3. In the Customer Information section, focus the `Customer Full Name` input field.
4. Type `Jordan Lee` into the input.
5. In the Order Summary panel on the right, click the `Place Order` button.
6. Observe the UI response, form state, and browser console.

### Observations & Results
- **Form Validation Behavior:** The form submission was intercepted immediately. An inline alert rendered below the input with `role="alert"` displaying:
  > *"Your cart is empty. Please add at least one product to checkout."*
- **DOM / State Integrity:**
  - The customer name field retained `"Jordan Lee"` without clearing or resetting.
  - No network or state transition to `CONFIRMED` occurred.
  - The Order Confirmation card was **not** displayed.
  - Browser developer tools console showed 0 uncaught errors or exceptions.
- **Pass/Fail Verdict:** **PASSED** — Checkout blocked with clear inline user feedback; input data preserved.

---

## Manual Test Record 02: Rapid Double-Click Place Order Concurrency Audit

- **Test ID:** `MT-02`
- **Scenario:** Rapid consecutive clicking on the Place Order button (<50ms between clicks)
- **Objective:** Verify that rapid consecutive clicks on the checkout button cannot trigger duplicate order generation, race conditions, or multiple order reference IDs.
- **Tester:** SDET Intern Candidate
- **Execution Date & Time:** 22 November 2026, 19:12 IST
- **Target URL:** `http://127.0.0.1:5173/`

### Test Pre-conditions
1. Navigate to clean Checkout view at `http://127.0.0.1:5173/`.
2. Add `Mechanical Keyboard` (Fixed price: ₹1,999) to the cart.
3. Cart displays 1 item, Subtotal: ₹1,999, Order Total: ₹1,999.
4. Enter Customer Name: `Taylor Swift`.

### Execution Steps
1. Position the mouse cursor directly over the `Place Order` button in the Order Summary panel.
2. Execute a physical rapid double-click on the mouse button (interval measured in Chrome DevTools performance profiler at ~42ms between click events).
3. Observe the transition lifecycle, button state, and resulting confirmation screen.
4. Inspect the DOM in Chrome DevTools to count rendered confirmation instances and order IDs.

### Observations & Technical Verification
- **Double-Click Lock In Action:**
  - Standard React `useState` changes are batched asynchronously, meaning that relying solely on the HTML `disabled` attribute can expose a short window where a second click fires before the disabled button re-renders.
  - CheckoutIQ's implementation guards submission with an immediate synchronous `useRef` lock (`isSubmittingRef.current = true`) set at the beginning of the event handler.
  - In the performance trace, event 1 set `isSubmittingRef.current = true`. When event 2 was dispatched 42ms later, it hit the synchronous guard condition `if (isSubmittingRef.current) return;` and was short-circuited immediately.
- **Confirmation State Inspection:**
  - Exactly **one** Order Confirmation card rendered on screen.
  - Exactly **one** unique reference ID was generated (Sample observed: `ORD-MI12P9-7B21`).
  - Total displayed: exact `₹1,999` with label `Order total`.
  - The Customer Form and `Place Order` button were unmounted, permanently preventing further duplicate attempts.
- **Pass/Fail Verdict:** **PASSED** — Concurrency guard cleanly prevented duplicate order creation; exactly 1 order registered.
