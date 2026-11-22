import React from 'react';
import { Product, CartItem as CartItemType, Order, CheckoutLifecycle } from '../types';
import { ProductList } from '../components/ProductList';
import { CustomerForm } from '../components/CustomerForm';
import { OrderSummary } from '../components/OrderSummary';
import { OrderConfirmation } from '../components/OrderConfirmation';
import { ShieldAlert } from 'lucide-react';

interface CheckoutPageProps {
  products: Product[];
  cart: CartItemType[];
  order: Order | null;
  customerName: string;
  validationError: string | null;
  checkoutStatus: CheckoutLifecycle;
  totalPaise: number;
  totalQuantity: number;
  onAddToCart: (product: Product) => void;
  onIncrementQuantity: (productId: string) => void;
  onDecrementQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onCustomerNameChange: (name: string) => void;
  onSubmitCheckout: (e: React.FormEvent) => void;
  onResetOrder: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  products,
  cart,
  order,
  customerName,
  validationError,
  checkoutStatus,
  totalPaise,
  totalQuantity,
  onAddToCart,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemoveItem,
  onCustomerNameChange,
  onSubmitCheckout,
  onResetOrder,
}) => {
  // If order is completed, show OrderConfirmation screen
  if (order) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <OrderConfirmation order={order} onResetOrder={onResetOrder} />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Header & Breadcrumb */}
      <div className="pb-4 border-b border-[#E6E8EF] flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <nav aria-label="Breadcrumb" className="text-[11px] font-medium text-[#697386] mb-1">
            <span>Hardware Catalog</span>
            <span className="mx-1.5 text-[#A3ACBA]">/</span>
            <span className="text-[#171923] font-semibold">Checkout</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171923]">
            Checkout
          </h1>
          <p className="text-xs text-[#697386] mt-0.5">
            Review your items and complete your order.
          </p>
        </div>

        {/* Small demo environment notice banner */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F9FC] border border-[#E6E8EF] text-[11px] text-[#4F566B]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#5145CD] flex-shrink-0" />
          <span>Demo checkout mode. All actions execute locally without payment processing.</span>
        </div>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN: Product Catalog & Customer Information */}
        <div className="lg:col-span-7 space-y-6">
          <ProductList
            products={products}
            cart={cart}
            onAddToCart={onAddToCart}
          />

          <CustomerForm
            customerName={customerName}
            onCustomerNameChange={onCustomerNameChange}
            onSubmit={onSubmitCheckout}
            validationError={validationError}
            disabled={checkoutStatus === 'PROCESSING' || checkoutStatus === 'CONFIRMED'}
          />
        </div>

        {/* RIGHT COLUMN: Order Summary Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <OrderSummary
            items={cart}
            totalPaise={totalPaise}
            totalQuantity={totalQuantity}
            checkoutStatus={checkoutStatus}
            onIncrementQuantity={onIncrementQuantity}
            onDecrementQuantity={onDecrementQuantity}
            onRemoveItem={onRemoveItem}
            onSubmitCheckout={onSubmitCheckout}
          />
        </div>
      </div>
    </main>
  );
};
