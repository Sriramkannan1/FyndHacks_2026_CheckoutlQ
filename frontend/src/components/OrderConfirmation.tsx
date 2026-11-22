import React from 'react';
import { Order } from '../types';
import { formatINR } from '../utils/currency';
import { CheckCircle2, ArrowLeft, Copy, Check, Clock, ShieldCheck } from 'lucide-react';

interface OrderConfirmationProps {
  order: Order;
  onResetOrder: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onResetOrder,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(order.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-testid="order-confirmation"
      className="max-w-xl mx-auto bg-white rounded-xl border border-[#E6E8EF] shadow-subtle p-7 sm:p-9 space-y-6 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-[#EAF6F0] border border-[#C2E8D7] text-[#16845B] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h2
          data-testid="confirmation-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-[#171923]"
        >
          Order Confirmed!
        </h2>
        <p className="text-xs text-[#697386]">
          Thank you,{' '}
          <span
            data-testid="confirmed-customer-name"
            className="font-semibold text-[#171923]"
          >
            {order.customerName}
          </span>
          . Your order has been recorded successfully in the demonstration environment.
        </p>
      </div>

      {/* Order Reference Panel */}
      <div className="bg-[#F8F9FC] rounded-lg p-4 border border-[#E6E8EF] space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EF]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] block">
              Order Reference
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                data-testid="order-reference"
                className="text-sm font-mono font-bold text-[#5145CD] select-all"
              >
                {order.reference}
              </span>
              <button
                type="button"
                onClick={copyRef}
                title="Copy Reference"
                aria-label="Copy order reference"
                className="p-1 text-[#A3ACBA] hover:text-[#171923] rounded hover:bg-[#E6E8EF] transition-colors focus-visible:ring-1 focus-visible:ring-[#5145CD]"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#16845B]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] block">
              Timestamp
            </span>
            <div className="flex items-center justify-end gap-1 text-xs text-[#4F566B] mt-0.5">
              <Clock className="w-3 h-3 text-[#A3ACBA]" />
              <span className="font-mono">{new Date(order.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Itemized summary */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#4F566B] block">
            Ordered Hardware ({order.totalQuantity} items):
          </span>
          <div className="divide-y divide-[#E6E8EF]/60">
            {order.items.map((item) => (
              <div
                key={item.product.id}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#171923]">
                    {item.product.name}
                  </span>
                  <span className="text-[#697386] font-mono">
                    × {item.quantity}
                  </span>
                </div>
                <span className="font-mono font-medium text-[#171923]">
                  {formatINR(item.lineTotalPaise)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="pt-2.5 border-t border-[#E6E8EF] flex items-baseline justify-between">
          <span className="text-xs font-bold text-[#171923]">Order total</span>
          <span
            data-testid="confirmed-order-total"
            className="text-base font-bold text-[#171923] font-mono"
          >
            {formatINR(order.totalPaise)}
          </span>
        </div>
      </div>

      {/* Reset Action */}
      <div className="space-y-2">
        <button
          type="button"
          data-testid="start-new-order-button"
          onClick={onResetOrder}
          className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs bg-[#171923] hover:bg-[#5145CD] text-white flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#5145CD]"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Start New Order</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#697386]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
          <span>Single deterministic order reference generated</span>
        </div>
      </div>
    </div>
  );
};
