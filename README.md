# CheckoutIQ — Precision Checkout & Quality Assurance Suite

[![Fynd Hiring Hackathon 2026](https://img.shields.io/badge/FyndHacks-2026%20SDET%20Intern-7c3aed?style=flat-square)](https://www.fynd.com/)
[![Playwright Tests](https://img.shields.io/badge/Playwright-12%20Passed%20(100%25)-emerald?style=flat-square&logo=playwright)](evidence/test-reports/html/index.html)
[![React 18](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![CI Workflow](https://img.shields.io/badge/CI-GitHub%20Actions-2088ff?style=flat-square&logo=githubactions)](.github/workflows/checkoutiq-ci.yml)

A modern commerce checkout experience backed by an independently reproducible browser automation test suite, built for the **Fynd Hiring Hackathon November 2026 (SDET Intern Challenge)**.

---

## 1. Project Overview

CheckoutIQ delivers two integrated interfaces:
1. **01. Customer Checkout:** An elegant, responsive shopping experience featuring a curated hardware catalog, live line-item calculations, integer-paise math, synchronous duplicate-click locks, keyboard navigation, and unique order reference generation.
2. **02. Quality Lab:** An authoritative presentation dashboard reporting actual Playwright test execution results, assertion matrices, execution durations, and manual quality verification logs.

---

## 2. Problem Statement & SDET Focus

Traditional e-commerce checkout flows often suffer from subtle yet catastrophic quality flaws:
- **Floating-point rounding errors** causing billing discrepancies.
- **Race conditions & double submissions** during checkout button clicks creating duplicate charges and multiple order IDs.
- **Flaky or cosmetic browser tests** using arbitrary timeouts (`sleep`/`waitForTimeout`) rather than state-driven auto-waiting assertions.
- **Lack of honest quality reporting** where dashboards fabricate green checkmarks instead of parsing genuine runner artifacts.

**CheckoutIQ directly solves these challenges** through clean architecture, deterministic integer math, synchronous idempotency locks, comprehensive edge-case coverage, and web-first Playwright assertions.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | Component architecture with strict typing |
| **Bundler & Dev Server** | Vite 5 | Fast development and optimized production bundling |
| **Styling** | Tailwind CSS 3 | Clean white UI with subtle purple accents and responsive grid |
| **Icons** | Lucide React | Modern visual indicators |
| **Browser Automation** | Playwright Test | Reliable, multi-browser end-to-end automation |
| **Test Reporter** | Playwright HTML & JSON Reporters | Detailed trace files, screenshots, and test logs |
| **Continuous Integration** | GitHub Actions | Automated typecheck, build, and E2E regression on PR/Push |

---

## 4. Key Features & Safeguards

### A. Customer Checkout Experience
- **Synthetic Hardware Catalog:**
  - *Wireless Mouse* (Price: ₹799 / 79,900 paise)
  - *Mechanical Keyboard* (Price: ₹1,999 / 199,900 paise)
- **Live Cart Operations:**
  - Add to cart / Remove from cart
  - Quantity increment / decrement
  - Enforced minimum quantity of 1 for remaining items; decrement to 0 cleanly removes product
  - Automatic product removal when quantity reaches zero
  - Live item subtotal and overall order total calculation
- **Integer-Paise Currency Math:** Eliminates IEEE-754 floating-point inaccuracies across line items and order totals.
- **Validation Engine:**
  - Inline error when customer name is blank
  - Inline error when attempting to place order with an empty cart
  - Form state preservation upon validation failure
- **Synchronous Idempotency Guard:** `useRef` lock combined with `disabled` state prevents rapid consecutive clicks or keyboard submits from creating duplicate orders.
- **Order Confirmation:** Single deterministic order reference (e.g., `ORD-XXXXXXXX`), itemized summary, and reset action.
- **React Error Boundary:** Catches and isolates unexpected runtime rendering errors gracefully.
- **Full Keyboard Accessibility:** Accessible labels, focus rings (`focus-visible:ring-2`), and complete keyboard checkout operability.

### B. Quality Lab Dashboard
- Real-time display of Playwright execution stats (Total, Passed, Failed, Skipped, Duration).
- Dynamic ingestion from Playwright's machine-readable `test-results.json`.
- Direct link and CLI instructions to open the Playwright HTML report (`npm run test:report`).
- Documented manual testing logs for empty cart and double-click concurrency verification.

---

## 5. Repository Structure

```
FyndHacks_2026_CheckoutIQ/
├── .github/
│   └── workflows/
│       └── checkoutiq-ci.yml     # GitHub Actions CI workflow
├── frontend/                     # React application source code
│   ├── index.html                # Application entry HTML
│   ├── public/                   # Public assets & synced test reports
│   └── src/
│       ├── main.tsx              # React DOM mounting & ErrorBoundary wrapper
│       ├── App.tsx               # App state machine & tab router
│       ├── index.css             # Tailwind directives & typography
│       ├── types.ts              # TypeScript interfaces & lifecycle states
│       ├── components/           # Reusable atomic UI components
│       │   ├── Header.tsx        # Navigation & cart badge
│       │   ├── ProductCard.tsx   # Catalog item with pricing & add-to-cart
│       │   ├── ProductList.tsx   # Catalog container
│       │   ├── CartItem.tsx      # Cart item with steppers & line total
│       │   ├── OrderSummary.tsx  # Subtotal, promotion & total calculation
│       │   ├── CustomerForm.tsx  # Name input, validation & locked submit
│       │   ├── OrderConfirmation.tsx # Success view with order reference
│       │   └── ErrorBoundary.tsx # React error boundary component
│       ├── pages/
│       │   ├── CheckoutPage.tsx  # Split checkout layout
│       │   └── QualityLab.tsx    # Live test execution dashboard
│       ├── data/
│       │   └── products.ts       # Synthetic hardware catalog data
│       └── utils/
│           └── currency.ts       # Integer paise arithmetic & formatters
├── tests/                        # Playwright automated test suites
│   ├── checkout.spec.ts          # Automated tests (TC-01 to TC-11)
│   └── screenshots.spec.ts       # Automated visual portfolio capture
├── docs/                         # SDET quality documentation
│   ├── TEST_PLAN.md              # Comprehensive test strategy & matrix
│   ├── TEST_RESULTS.md           # Actual test execution evidence & durations
│   ├── MANUAL_TESTING.md         # Documented manual exploratory testing
│   └── BUG_REPORTS.md            # Defect prevention & resolution logs
├── evidence/                     # Execution artifacts & proof
│   ├── screenshots/              # Captured full-page visual evidence
│   └── test-reports/             # Generated HTML & JSON Playwright reports
├── package.json                  # Root scripts & dependencies
├── vite.config.ts                # Vite bundler configuration
├── playwright.config.ts          # Playwright runner configuration
├── tailwind.config.js            # Tailwind theme tokens
├── postcss.config.js             # PostCSS processing
├── tsconfig.json                 # TypeScript compiler options
└── README.md                     # Engineering documentation
```

---

## 6. Installation & Verification Commands

### Prerequisites
- **Node.js:** v18.0.0 or higher (v22.x recommended)
- **npm:** v9.x or higher

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Install Playwright Browsers
```powershell
npx playwright install chromium
```

### Step 3: Run TypeScript Type Check
```powershell
npm run typecheck
```

### Step 4: Run Production Build
```powershell
npm run build
```

### Step 5: Execute Playwright Browser Automation Suite
```powershell
# Headless run (default)
npm test

# Headed run with visible browser
npm run test:headed
```

### Step 6: Open Playwright Interactive HTML Report
```powershell
npm run test:report
```

### Step 7: Run Local Development Server
```powershell
npm run dev
```
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

---

## 7. Automated Test Suite Matrix (11 Passed / 0 Failed)

| Spec ID | Name | Category | Status | Assertions Verified |
| :--- | :--- | :---: | :---: | :--- |
| **TC-01** | Successful Checkout Flow | Positive / E2E | **PASSED** | Visible confirmation, exact customer name, valid `ORD-*` ID, 1 single confirmation container |
| **TC-02** | Missing Customer Name Validation | Negative / Validation | **PASSED** | Inline error displayed, checkout blocked, cart preserved |
| **TC-03** | Exact Quantity & Line Calculation | Math / Precision | **PASSED** | Quantity = 2, line total = ₹1,598, order total = ₹1,598 |
| **TC-04** | Empty Cart Checkout Guard | Negative / Boundary | **PASSED** | Inline warning when submitting 0 items; order blocked |
| **TC-05** | Rapid Double-Click Protection | Concurrency | **PASSED** | Synchronous lock produces exactly 1 order confirmation |
| **TC-06** | Item Removal Updates Count & Total | State Management | **PASSED** | Removing item updates cart count and order total immediately |
| **TC-07** | Quantity Decrement Boundary Protection | Invariant / Boundary | **PASSED** | Decrementing at quantity 1 removes product without negative values |
| **TC-08** | Final Item Removal Restores Empty State | UI / Lifecycle | **PASSED** | Removing last item restores clean empty-cart placeholder |
| **TC-09** | Validation Preserves Input & Cart | UX / State Preservation | **PASSED** | Input text and cart items retained after validation errors |
| **TC-10** | Accessible Keyboard Checkout | Accessibility | **PASSED** | Cart addition and checkout submission operable strictly via keyboard |
| **TC-11** | Completed Order Cannot Be Duplicated | Concurrency / Lifecycle | **PASSED** | Completed order screen unmounts form; subsequent submissions prevented |

---

## 8. Manual Testing Audit

- **MT-01 (Empty Cart Submission):** Verified that placing an order with 0 items displays inline validation alert and blocks order creation.
- **MT-02 (Rapid Double-Click Guard):** Verified via sub-50ms click bursts that synchronous ref lock short-circuits duplicate execution, resulting in exactly 1 order reference.
- Detailed records in [docs/MANUAL_TESTING.md](docs/MANUAL_TESTING.md).

---

## 9. Captured Visual Evidence

High-resolution visual proof stored in [evidence/screenshots/](evidence/screenshots/):
- `01_checkout_catalog_initial.png` — Curated product grid and cart review
- `02_cart_item_added.png` — Real-time line item updates
- `03_validation_error_missing_name.png` — Accessible inline validation error
- `04_order_confirmation_success.png` — Verified order reference and total
- `05_quality_lab_dashboard.png` — Quality Lab execution metrics

---

## 10. Design Decisions & Limitations

1. **Deterministic Zero-Backend Architecture:**  
   Per hackathon instructions, the entire application operates locally on the client with zero external network dependencies, ensuring 100% reproducible test execution.
2. **Synchronous React Ref Lock:**  
   Standard `disabled` attributes depend on React render cycles. The double-click guard combines `disabled` with an immediate synchronous `useRef` toggle to prevent race conditions during sub-100ms click bursts.
3. **Integer Arithmetic:**  
   To prevent JavaScript floating-point rounding quirks, all prices and intermediate line totals are calculated in integer paise.
4. **Authoritative Quality Lab:**  
   The dashboard reads actual test results from generated Playwright report artifacts. If no test results exist, it reports "NOT RUN YET" rather than displaying fake green checkmarks.

---

## 11. Author & Hackathon Verification
- **Challenge:** Fynd Hiring Hackathon 2026 — SDET Intern Track
- **Project:** CheckoutIQ
- **Submission Readiness:** Fully verified with 11 passing Playwright tests, zero TypeScript errors, clean production build, and complete documentation.
