import React, { useState, useRef } from 'react';
import { Product, CartItem, Order, CheckoutLifecycle } from './types';
import { SYNTHETIC_PRODUCTS } from './data/products';
import {
  calculateLineTotal,
  calculateOrderTotals,
  generateOrderReference,
} from './utils/currency';
import { Header } from './components/Header';
import { CheckoutPage } from './pages/CheckoutPage';
import { QualityLab } from './pages/QualityLab';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'quality-lab'>('checkout');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutLifecycle>('IDLE');

  // Synchronous lock ref to prevent rapid double-clicks from executing twice
  const isSubmittingRef = useRef<boolean>(false);

  // Calculate totals deterministically in integer paise
  const { totalPaise, totalQuantity } = calculateOrderTotals(
    cart.map((item) => ({
      pricePaise: item.product.pricePaise,
      quantity: Math.max(1, item.quantity), // Enforce minimum quantity 1
    }))
  );

  // Cart operations
  const handleAddToCart = (product: Product) => {
    // If an order is already confirmed, adding an item is blocked until order is reset
    if (checkoutStatus === 'CONFIRMED') return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + 1;
        return prevCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: nextQty,
                lineTotalPaise: calculateLineTotal(product.pricePaise, nextQty),
              }
            : item
        );
      }
      return [
        ...prevCart,
        {
          product,
          quantity: 1,
          lineTotalPaise: calculateLineTotal(product.pricePaise, 1),
        },
      ];
    });

    // Clear cart-empty error if present
    if (validationError?.includes('cart is empty')) {
      setValidationError(null);
    }
  };

  const handleIncrementQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const nextQty = Math.max(1, item.quantity + 1);
          return {
            ...item,
            quantity: nextQty,
            lineTotalPaise: calculateLineTotal(item.product.pricePaise, nextQty),
          };
        }
        return item;
      })
    );
  };

  const handleDecrementQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity - 1;
            // When quantity decrements to 0, product is removed immediately
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              lineTotalPaise: calculateLineTotal(item.product.pricePaise, nextQty),
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleCustomerNameChange = (name: string) => {
    setCustomerName(name);
    if (validationError && name.trim().length > 0) {
      setValidationError(null);
    }
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Synchronous double-click guard
    if (isSubmittingRef.current || checkoutStatus === 'PROCESSING' || checkoutStatus === 'CONFIRMED') {
      return;
    }

    setCheckoutStatus('VALIDATING');

    // 2. Cart empty validation
    if (cart.length === 0) {
      setValidationError('Your cart is empty. Please add at least one product to checkout.');
      setCheckoutStatus('IDLE');
      return;
    }

    // 3. Customer name validation
    if (!customerName || customerName.trim() === '') {
      setValidationError('Please enter your full name to proceed with checkout.');
      setCheckoutStatus('IDLE');
      return;
    }

    // Acquire lock immediately
    isSubmittingRef.current = true;
    setCheckoutStatus('PROCESSING');
    setValidationError(null);

    // Create unique deterministic order
    const newOrder: Order = {
      reference: generateOrderReference(),
      customerName: customerName.trim(),
      items: [...cart],
      totalPaise,
      totalQuantity,
      timestamp: new Date().toISOString(),
    };

    setOrder(newOrder);
    setCart([]);
    setCheckoutStatus('CONFIRMED');

    // Release submission lock after state completes
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 400);
  };

  const handleResetOrder = () => {
    setOrder(null);
    setCustomerName('');
    setValidationError(null);
    setCheckoutStatus('IDLE');
    isSubmittingRef.current = false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={totalQuantity}
      />

      <div className="flex-grow">
        {activeTab === 'checkout' ? (
          <CheckoutPage
            products={SYNTHETIC_PRODUCTS}
            cart={cart}
            order={order}
            customerName={customerName}
            validationError={validationError}
            checkoutStatus={checkoutStatus}
            totalPaise={totalPaise}
            totalQuantity={totalQuantity}
            onAddToCart={handleAddToCart}
            onIncrementQuantity={handleIncrementQuantity}
            onDecrementQuantity={handleDecrementQuantity}
            onRemoveItem={handleRemoveItem}
            onCustomerNameChange={handleCustomerNameChange}
            onSubmitCheckout={handleSubmitCheckout}
            onResetOrder={handleResetOrder}
          />
        ) : (
          <QualityLab onSwitchToCheckout={() => setActiveTab('checkout')} />
        )}
      </div>

      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CheckoutIQ · Precision SDET Quality Architecture</span>
          <span className="font-mono text-slate-400">Fynd Hiring Hackathon 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
