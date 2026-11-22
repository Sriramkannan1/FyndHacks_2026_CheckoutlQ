import React from 'react';
import { CartItem as CartItemType, CheckoutLifecycle } from '../types';
import { CartItem } from './CartItem';
import { formatINR } from '../utils/currency';
import { ShoppingCart, ArrowRight, Loader2, PackageOpen } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItemType[];
  totalPaise: number;
  totalQuantity: number;
  checkoutStatus: CheckoutLifecycle;
  onIncrementQuantity: (productId: string) => void;
  onDecrementQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onSubmitCheckout: (e: React.FormEvent) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totalPaise,
  totalQuantity,
  checkoutStatus,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemoveItem,
  onSubmitCheckout,
}) => {
  const isCartEmpty = items.length === 0;
  const isProcessing = checkoutStatus === 'PROCESSING' || checkoutStatus === 'VALIDATING';

  const handleButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || checkoutStatus === 'CONFIRMED') {
      return;
    }
    onSubmitCheckout(e);
  };

  return (
    <div
      data-testid="order-summary-card"
      className="bg-white rounded-xl border border-[#E6E8EF] p-5 shadow-subtle space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EF]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#F1F3F7] text-[#5145CD] flex items-center justify-center font-bold text-xs">
            <ShoppingCart className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#171923]">
            Order Summary
          </h3>
        </div>
        <span
          data-testid="order-total-count"
          className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F1F3F7] text-[#4F566B] border border-[#E6E8EF]"
        >
          {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Cart Items List inside Order Summary */}
      <div className="space-y-2.5">
        {isCartEmpty ? (
          <div
            data-testid="empty-cart-state"
            className="py-10 text-center text-[#697386] space-y-2 bg-[#F8F9FC] rounded-lg border border-dashed border-[#E6E8EF]"
          >
            <div data-testid="empty-cart-summary">
              <PackageOpen className="w-8 h-8 mx-auto text-[#A3ACBA] stroke-[1.5]" />
              <p className="text-xs font-semibold text-[#171923] mt-2">
                Cart is currently empty
              </p>
              <p className="text-[11px] text-[#697386] mt-0.5">
                Add items from the catalog to proceed
              </p>
            </div>
          </div>
        ) : (
          <div data-testid="cart-items-list" className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onIncrement={onIncrementQuantity}
                onDecrement={onDecrementQuantity}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pricing Breakdown (Clean, exact subtotal equals total, no added fees) */}
      {!isCartEmpty && (
        <div className="space-y-2.5 pt-3 border-t border-[#E6E8EF]">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span>Items Subtotal</span>
            <span
              data-testid="order-subtotal"
              className="font-mono font-medium text-[#171923]"
            >
              {formatINR(totalPaise)}
            </span>
          </div>

          <div className="pt-2 border-t border-[#E6E8EF] flex items-baseline justify-between">
            <span className="text-sm font-bold text-[#171923]">
              Order Total
            </span>
            <span
              data-testid="order-total"
              className="text-xl font-bold text-[#171923] font-mono tracking-tight"
            >
              {formatINR(totalPaise)}
            </span>
          </div>
        </div>
      )}

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="button"
          data-testid="place-order-button"
          onClick={handleButtonClick}
          disabled={isProcessing}
          aria-busy={isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all duration-150 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145CD] ${
            isProcessing
              ? 'bg-[#A3ACBA] cursor-not-allowed'
              : 'bg-[#5145CD] hover:bg-[#4035B5] active:scale-[0.99]'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <span>Place Order</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
