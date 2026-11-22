import React from 'react';
import { CartItem as CartItemType } from '../types';
import { formatINR } from '../utils/currency';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const { product, quantity, lineTotalPaise } = item;

  return (
    <div
      data-testid={`cart-item-${product.id}`}
      className="p-3.5 bg-white rounded-lg border border-[#E6E8EF] hover:border-[#D5D8E2] transition-all shadow-subtle flex items-center justify-between gap-3"
    >
      {/* Product Image & Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-lg bg-[#F8F9FC] border border-[#E6E8EF] flex items-center justify-center p-1 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <h4
            data-testid={`cart-item-title-${product.id}`}
            className="text-xs font-bold text-[#171923] truncate"
          >
            {product.name}
          </h4>
          <p className="text-[11px] text-[#697386] font-mono">
            {formatINR(product.pricePaise)}
          </p>
        </div>
      </div>

      {/* Steppers & Line Total */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-[#E6E8EF] rounded-md bg-[#F8F9FC] p-0.5">
          <button
            type="button"
            data-testid={`decrement-${product.id}`}
            aria-label={`Decrease quantity of ${product.name}`}
            onClick={() => onDecrement(product.id)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-[#4F566B] hover:text-[#171923] transition-colors active:scale-95 focus-visible:ring-1 focus-visible:ring-[#5145CD]"
          >
            <Minus className="w-3 h-3 stroke-[2.5]" />
          </button>

          <span
            data-testid={`quantity-${product.id}`}
            className="w-7 text-center text-xs font-bold text-[#171923] font-mono select-none"
          >
            {quantity}
          </span>

          <button
            type="button"
            data-testid={`increment-${product.id}`}
            aria-label={`Increase quantity of ${product.name}`}
            onClick={() => onIncrement(product.id)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-[#4F566B] hover:text-[#171923] transition-colors active:scale-95 focus-visible:ring-1 focus-visible:ring-[#5145CD]"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Calculated Line Total */}
        <div className="text-right min-w-[62px]">
          <span
            data-testid={`line-total-${product.id}`}
            className="text-xs font-bold text-[#171923] font-mono"
          >
            {formatINR(lineTotalPaise)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          data-testid={`remove-${product.id}`}
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onRemove(product.id)}
          className="text-[#A3ACBA] hover:text-[#D64545] p-1 rounded hover:bg-[#FDF2F2] transition-colors focus-visible:ring-1 focus-visible:ring-[#D64545]"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
