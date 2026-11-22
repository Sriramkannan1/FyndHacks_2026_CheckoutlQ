import React from 'react';
import { ShoppingBag, FlaskConical, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: 'checkout' | 'quality-lab';
  onTabChange: (tab: 'checkout' | 'quality-lab') => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, cartCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E6E8EF] shadow-subtle transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#5145CD] flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold tracking-tight text-[#171923]">
                Checkout<span className="text-[#5145CD]">IQ</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F1F3F7] text-[#4F566B] border border-[#E6E8EF]">
                <Shield className="w-3 h-3 text-[#5145CD]" />
                Demo Sandbox
              </span>
            </div>
          </div>

          {/* View Switcher: Checkout vs Quality Lab */}
          <nav className="flex items-center gap-1.5 p-1 bg-[#F1F3F7] rounded-xl border border-[#E6E8EF]" aria-label="Main Navigation">
            <button
              type="button"
              data-testid="nav-checkout"
              onClick={() => onTabChange('checkout')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145CD] ${
                activeTab === 'checkout'
                  ? 'bg-white text-[#171923] shadow-xs border border-[#E6E8EF]'
                  : 'text-[#697386] hover:text-[#171923]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Checkout</span>
              {cartCount > 0 && (
                <span
                  data-testid="header-cart-count"
                  className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold bg-[#5145CD] text-white rounded-full min-w-4 h-4"
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              data-testid="nav-quality-lab"
              onClick={() => onTabChange('quality-lab')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145CD] ${
                activeTab === 'quality-lab'
                  ? 'bg-white text-[#171923] shadow-xs border border-[#E6E8EF]'
                  : 'text-[#697386] hover:text-[#171923]'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Quality Lab</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16845B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16845B]"></span>
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
