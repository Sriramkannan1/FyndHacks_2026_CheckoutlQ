export type CheckoutLifecycle = 'IDLE' | 'VALIDATING' | 'PROCESSING' | 'CONFIRMED';

export interface Product {
  id: string;
  name: string;
  description: string;
  pricePaise: number; // in integer paise (₹1 = 100 paise)
  badge: string;
  image: string;
  category: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotalPaise: number;
}

export interface Order {
  reference: string;
  customerName: string;
  items: CartItem[];
  totalPaise: number;
  totalQuantity: number;
  timestamp: string;
}

export interface TestCaseRecord {
  id: string;
  name: string;
  type: 'Automated' | 'Manual';
  category: 'Positive' | 'Negative' | 'Calculation' | 'Concurrency' | 'Boundary' | 'Accessibility';
  expectedOutcome: string;
  actualOutcome?: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'NOT RUN';
  durationMs?: number;
  assertions?: string[];
  evidencePath?: string;
}
