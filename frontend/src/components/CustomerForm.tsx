import React from 'react';
import { User, AlertCircle, ShieldCheck } from 'lucide-react';

interface CustomerFormProps {
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  validationError: string | null;
  disabled: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customerName,
  onCustomerNameChange,
  onSubmit,
  validationError,
  disabled,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EF] p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EF]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#F1F3F7] text-[#5145CD] flex items-center justify-center font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#171923]">
            Customer Information
          </h3>
        </div>
        <span className="text-[11px] text-[#697386] font-medium">Required</span>
      </div>

      <form
        id="checkout-form"
        data-testid="checkout-form"
        onSubmit={onSubmit}
        noValidate
        className="space-y-3"
      >
        <div>
          <label
            htmlFor="customer-name"
            className="block text-xs font-semibold text-[#171923] mb-1.5"
          >
            Customer Full Name <span className="text-[#D64545]">*</span>
          </label>
          <input
            id="customer-name"
            name="customerName"
            type="text"
            autoComplete="name"
            placeholder="e.g. Alex Morgan"
            value={customerName}
            disabled={disabled}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            data-testid="customer-name-input"
            aria-required="true"
            aria-invalid={validationError ? 'true' : 'false'}
            aria-describedby={validationError ? 'customer-name-error' : undefined}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#5145CD] ${
              validationError
                ? 'border-[#D64545] bg-[#FDF2F2] text-[#171923]'
                : 'border-[#E6E8EF] bg-white text-[#171923] hover:border-[#D5D8E2] focus:border-[#5145CD]'
            }`}
          />

          {/* Inline Validation Alert */}
          {validationError && (
            <div
              id="customer-name-error"
              role="alert"
              data-testid="validation-error"
              className="mt-2 text-xs font-semibold text-[#D64545] flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#697386]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
          <span>Synchronous idempotent lock active. No actual payment collected.</span>
        </div>
      </form>
    </div>
  );
};
