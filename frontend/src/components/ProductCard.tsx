import React from 'react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
}) => {
  const isInCart = quantityInCart > 0;

  return (
    <div
      data-testid={`product-card-${product.id}`}
      className="bg-white rounded-xl border border-[#E6E8EF] hover:border-[#D5D8E2] transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-subtle p-5"
    >
      <div>
        {/* Top category & badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#F1F3F7] text-[#4F566B] border border-[#E6E8EF]">
            {product.badge}
          </span>
          <span className="text-xs font-semibold text-[#697386]">
            {product.category}
          </span>
        </div>

        {/* Product Visual */}
        <div className="w-full h-36 flex items-center justify-center rounded-lg bg-[#F8F9FC] border border-[#E6E8EF]/60 p-2 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-contain transition-transform duration-200 hover:scale-105"
          />
        </div>

        {/* Title & Price */}
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h3
            data-testid={`product-name-${product.id}`}
            className="text-sm font-bold text-[#171923]"
          >
            {product.name}
          </h3>
          <span
            data-testid={`product-price-${product.id}`}
            className="text-sm font-bold text-[#171923] font-mono"
          >
            {formatINR(product.pricePaise)}
          </span>
        </div>

        <p className="text-xs text-[#697386] mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Feature list */}
        <ul className="space-y-1 mb-4 text-[11px] text-[#4F566B]">
          {product.features.map((feat, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#5145CD]" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E6E8EF] flex items-center justify-between gap-3">
        {isInCart ? (
          <span
            data-testid={`product-cart-badge-${product.id}`}
            className="text-xs font-semibold text-[#16845B] bg-[#EAF6F0] border border-[#C2E8D7] px-2 py-1 rounded-md flex items-center gap-1"
          >
            <Check className="w-3 h-3 stroke-[2.5]" />
            In Cart ({quantityInCart})
          </span>
        ) : (
          <div />
        )}

        <button
          type="button"
          data-testid={`add-to-cart-${product.id}`}
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAddToCart(product)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold text-xs transition-all duration-150 bg-[#171923] hover:bg-[#5145CD] text-white shadow-xs active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#5145CD]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
