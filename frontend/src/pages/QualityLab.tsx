import React, { useState, useEffect } from 'react';
import { TestCaseRecord } from '../types';
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Info,
  MinusCircle,
  Terminal,
} from 'lucide-react';

interface QualityLabProps {
  onSwitchToCheckout: () => void;
}

export const QualityLab: React.FC<QualityLabProps> = ({ onSwitchToCheckout }) => {
  const [testRecords, setTestRecords] = useState<TestCaseRecord[]>([]);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasReportData, setHasReportData] = useState<boolean>(false);
  const [executionSummary, setExecutionSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    durationMs: number;
  }>({ total: 11, passed: 0, failed: 0, skipped: 0, durationMs: 0 });

  // Complete definition of the 11 Automated Test Specs matching the suite
  const defaultDefinitions: TestCaseRecord[] = [
    {
      id: 'TC-01',
      name: 'Successful Customer Checkout Flow',
      type: 'Automated',
      category: 'Positive',
      expectedOutcome: 'Order is placed, confirmation heading visible, order reference created, customer name verified.',
      status: 'NOT RUN',
      assertions: [
        'expect(confirmationHeading).toBeVisible()',
        'expect(confirmedName).toHaveText("Alex Morgan")',
        'expect(orderReference).toBeVisible()',
        'expect(orderConfirmation).toHaveCount(1)',
      ],
    },
    {
      id: 'TC-02',
      name: 'Validation Guard: Missing Required Customer Name',
      type: 'Automated',
      category: 'Negative',
      expectedOutcome: 'Validation message shown, order blocked, cart contents and line items preserved.',
      status: 'NOT RUN',
      assertions: [
        'expect(validationError).toBeVisible()',
        'expect(validationError).toHaveText("Please enter your full name to proceed with checkout.")',
        'expect(orderConfirmation).not.toBeVisible()',
        'expect(cartItem).toBeVisible()',
      ],
    },
    {
      id: 'TC-03',
      name: 'Deterministic Quantity & Line Total Calculation',
      type: 'Automated',
      category: 'Calculation',
      expectedOutcome: 'Incrementing Wireless Mouse to quantity 2 yields exact ₹1,598 line total and order total.',
      status: 'NOT RUN',
      assertions: [
        'expect(quantity).toHaveText("2")',
        'expect(lineTotal).toHaveText("₹1,598")',
        'expect(orderTotal).toHaveText("₹1,598")',
      ],
    },
    {
      id: 'TC-04',
      name: 'Empty Cart Checkout Guard',
      type: 'Automated',
      category: 'Boundary',
      expectedOutcome: 'Attempting to checkout with zero cart items displays inline validation alert.',
      status: 'NOT RUN',
      assertions: [
        'expect(validationError).toBeVisible()',
        'expect(validationError).toHaveText("Your cart is empty. Please add at least one product to checkout.")',
        'expect(orderConfirmation).not.toBeVisible()',
      ],
    },
    {
      id: 'TC-05',
      name: 'Rapid Double-Click Concurrency Guard',
      type: 'Automated',
      category: 'Concurrency',
      expectedOutcome: 'Rapid consecutive double clicks produce exactly one order and one unique order reference.',
      status: 'NOT RUN',
      assertions: [
        'await placeOrderBtn.dblclick()',
        'expect(orderConfirmation).toHaveCount(1)',
        'expect(orderReference).toHaveCount(1)',
      ],
    },
    {
      id: 'TC-06',
      name: 'Item Removal Updates Cart Count and Order Total',
      type: 'Automated',
      category: 'Calculation',
      expectedOutcome: 'Removing one item from a multi-item cart immediately updates overall total and counters.',
      status: 'NOT RUN',
      assertions: [
        'await removeBtn.click()',
        'expect(removedItem).not.toBeVisible()',
        'expect(orderTotal).toHaveText("₹1,999")',
      ],
    },
    {
      id: 'TC-07',
      name: 'Quantity Decrement Boundary Protection',
      type: 'Automated',
      category: 'Boundary',
      expectedOutcome: 'Decrementing quantity to 0 removes product without producing negative or NaN values.',
      status: 'NOT RUN',
      assertions: [
        'await decrementBtn.click()',
        'expect(cartItem).not.toBeVisible()',
        'expect(emptyCartState).toBeVisible()',
      ],
    },
    {
      id: 'TC-08',
      name: 'Final Item Removal Restores Empty Cart State',
      type: 'Automated',
      category: 'Boundary',
      expectedOutcome: 'Removing the last remaining item in cart restores the clean empty-cart placeholder.',
      status: 'NOT RUN',
      assertions: [
        'await removeBtn.click()',
        'expect(emptyCartState).toBeVisible()',
        'expect(orderTotalCount).toHaveText("0 items")',
      ],
    },
    {
      id: 'TC-09',
      name: 'Validation Failure Preserves Customer Input and Cart',
      type: 'Automated',
      category: 'Negative',
      expectedOutcome: 'Triggering validation errors preserves entered customer details and cart items.',
      status: 'NOT RUN',
      assertions: [
        'expect(customerInput).toHaveValue("Sam Taylor")',
        'expect(cartItem).toBeVisible()',
      ],
    },
    {
      id: 'TC-10',
      name: 'Keyboard Navigation and Keyboard Submission',
      type: 'Automated',
      category: 'Accessibility',
      expectedOutcome: 'Cart addition and checkout submission can be completed strictly via keyboard navigation.',
      status: 'NOT RUN',
      assertions: [
        'await page.keyboard.press("Enter")',
        'expect(orderConfirmation).toBeVisible()',
      ],
    },
    {
      id: 'TC-11',
      name: 'Completed Order Cannot Be Duplicated',
      type: 'Automated',
      category: 'Concurrency',
      expectedOutcome: 'Once order confirmed, subsequent repeated submissions are prevented until new order started.',
      status: 'NOT RUN',
      assertions: [
        'expect(placeOrderBtn).not.toBeVisible()',
        'expect(orderConfirmation).toHaveCount(1)',
      ],
    },
  ];

  const loadActualResults = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/evidence/test-reports/test-results.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.suites) {
          const specs = data.suites.flatMap((s: any) => s.specs || []);
          let passed = 0;
          let failed = 0;
          let skipped = 0;
          let totalDuration = 0;

          const updated = defaultDefinitions.map((tc) => {
            const matchedSpec = specs.find(
              (s: any) =>
                s.title.toLowerCase().includes(tc.id.toLowerCase()) ||
                s.title.toLowerCase().includes(tc.name.toLowerCase().substring(0, 15))
            );
            if (matchedSpec && matchedSpec.tests && matchedSpec.tests.length > 0) {
              const testRun = matchedSpec.tests[0];
              const result = testRun.results && testRun.results[0];
              const isPass = result && result.status === 'passed';
              const isSkip = result && result.status === 'skipped';
              const duration = result ? result.duration : 0;
              totalDuration += duration;
              if (isPass) passed++;
              else if (isSkip) skipped++;
              else failed++;

              return {
                ...tc,
                status: isPass ? ('PASSED' as const) : isSkip ? ('SKIPPED' as const) : ('FAILED' as const),
                durationMs: duration,
                actualOutcome: isPass
                  ? `Completed in ${duration}ms (0 errors)`
                  : isSkip
                  ? 'Skipped'
                  : `Failed: ${result?.error?.message || 'Assertion error'}`,
              };
            }
            return tc;
          });

          setTestRecords(updated);
          setHasReportData(true);
          setExecutionSummary({
            total: updated.length,
            passed,
            failed,
            skipped,
            durationMs: totalDuration,
          });
          setLastExecuted(new Date().toLocaleTimeString());
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // JSON report fetch or parse failed
    }

    setTestRecords(defaultDefinitions);
    setHasReportData(false);
    setExecutionSummary({ total: defaultDefinitions.length, passed: 0, failed: 0, skipped: 0, durationMs: 0 });
    setIsLoading(false);
  };

  useEffect(() => {
    loadActualResults();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-[#E6E8EF] flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#F1F3F7] text-[#5145CD]">
              <FlaskConical className="w-4 h-4 stroke-[2.2]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171923]">
              Quality Lab & Automation Reports
            </h1>
          </div>
          <p className="text-xs text-[#697386]">
            Browser automation overview and Playwright test execution results.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadActualResults}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#E6E8EF] hover:bg-[#F8F9FC] text-[#4F566B] shadow-subtle transition-all focus-visible:ring-2 focus-visible:ring-[#5145CD]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload Report</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToCheckout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#171923] hover:bg-[#5145CD] text-white shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-[#5145CD]"
          >
            <span>Back to Checkout</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E6E8EF] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] block mb-1">
            Total Tests
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#171923] font-mono">
              {executionSummary.total}
            </span>
            <span className="text-[11px] text-[#A3ACBA]">specs</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E6E8EF] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16845B] block mb-1">
            Passed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#16845B] font-mono">
              {executionSummary.passed}
            </span>
            <span className="text-[11px] text-[#A3ACBA]">verified</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E6E8EF] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545] block mb-1">
            Failed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#D64545] font-mono">
              {executionSummary.failed}
            </span>
            <span className="text-[11px] text-[#A3ACBA]">defects</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E6E8EF] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] block mb-1">
            Duration / Engine
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#171923] font-mono">
              {executionSummary.durationMs > 0 ? `${(executionSummary.durationMs / 1000).toFixed(1)}s` : '--'}
            </span>
            <span className="text-[11px] text-[#A3ACBA]">Chromium</span>
          </div>
        </div>
      </div>

      {/* Report Status Notice */}
      <div className="p-3.5 rounded-lg bg-[#F8F9FC] border border-[#E6E8EF] flex items-start justify-between gap-3 text-xs text-[#4F566B]">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#5145CD] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-[#171923]">
              {hasReportData ? 'Actual Execution Data Loaded' : 'No Execution Report Data Found'}
            </p>
            <p className="text-[11px] text-[#697386]">
              {hasReportData
                ? `Results derived from latest Playwright run${lastExecuted ? ` at ${lastExecuted}` : ''}. Launch full HTML report via terminal:`
                : 'Run npm test in terminal to execute the Playwright test suite against Chromium.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <code className="hidden sm:inline-block px-2 py-1 rounded bg-white border border-[#E6E8EF] font-mono text-[11px] text-[#171923]">
            npm run test:report
          </code>
        </div>
      </div>

      {/* Test Execution Table */}
      <section className="bg-white rounded-xl border border-[#E6E8EF] shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-[#E6E8EF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#5145CD]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#171923]">
              Automated Test Execution Matrix (tests/checkout.spec.ts)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#697386]">
            playwright chromium
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FC] border-b border-[#E6E8EF] text-[#697386] font-semibold">
              <tr>
                <th className="py-2.5 px-4 w-20">ID</th>
                <th className="py-2.5 px-4">Test Scenario</th>
                <th className="py-2.5 px-4 w-28">Result</th>
                <th className="py-2.5 px-4 w-28">Duration</th>
                <th className="py-2.5 px-4 w-24">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EF]">
              {testRecords.map((tc) => (
                <tr key={tc.id} className="hover:bg-[#F8F9FC]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#171923]">
                    {tc.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#171923]">{tc.name}</p>
                    <p className="text-[11px] text-[#697386] mt-0.5">{tc.expectedOutcome}</p>
                  </td>
                  <td className="py-3 px-4">
                    {tc.status === 'PASSED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF6F0] text-[#16845B] border border-[#C2E8D7]">
                        <CheckCircle2 className="w-3 h-3 text-[#16845B]" />
                        PASSED
                      </span>
                    )}
                    {tc.status === 'FAILED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FDF2F2] text-[#D64545] border border-[#F8D7D7]">
                        <XCircle className="w-3 h-3 text-[#D64545]" />
                        FAILED
                      </span>
                    )}
                    {tc.status === 'SKIPPED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F3F7] text-[#697386] border border-[#E6E8EF]">
                        <MinusCircle className="w-3 h-3 text-[#A3ACBA]" />
                        SKIPPED
                      </span>
                    )}
                    {tc.status === 'NOT RUN' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F3F7] text-[#697386] border border-[#E6E8EF]">
                        <Clock className="w-3 h-3 text-[#A3ACBA]" />
                        NOT RUN
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#4F566B]">
                    {tc.durationMs ? `${tc.durationMs}ms` : '--'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#697386]">
                    chromium
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
