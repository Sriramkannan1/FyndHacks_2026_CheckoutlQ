import React from 'react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  cart,
  onAddToCart,
}) => {
  const getQuantityInCart = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section aria-labelledby="products-heading" className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EF]">
        <div>
          <h2
            id="products-heading"
            className="text-base font-bold tracking-tight text-[#171923]"
          >
            Product Selection
          </h2>
          <p className="text-xs text-[#697386]">
            Select deterministic hardware items for customer order verification
          </p>
        </div>
        <span className="text-[11px] font-medium text-[#4F566B] bg-white px-2 py-0.5 rounded border border-[#E6E8EF]">
          {products.length} Products
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantityInCart={getQuantityInCart(product.id)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};
