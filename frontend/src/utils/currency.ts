/**
 * Currency utility using strictly integer paise to avoid IEEE-754 floating point imprecision.
 * 1 INR = 100 paise.
 */

export function paiseToRupees(paise: number): number {
  return Math.floor(paise / 100);
}

export function formatINR(paise: number): string {
  const rupees = paiseToRupees(paise);
  // Format with standard Indian grouping: e.g. 1,598 or 1,999
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(rupees);
  return `₹${formatted}`;
}

export function calculateLineTotal(pricePaise: number, quantity: number): number {
  if (quantity <= 0) return 0;
  return Math.floor(pricePaise * quantity);
}

export function calculateOrderTotals(items: { pricePaise: number; quantity: number }[]): {
  totalPaise: number;
  totalQuantity: number;
} {
  return items.reduce(
    (acc, item) => ({
      totalPaise: acc.totalPaise + calculateLineTotal(item.pricePaise, item.quantity),
      totalQuantity: acc.totalQuantity + item.quantity,
    }),
    { totalPaise: 0, totalQuantity: 0 }
  );
}

export function generateOrderReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
