import React from 'react';
import { Check } from '../icons';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
}

export default function Checkbox({
  label,
  error,
  checked,
  onChange,
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col gap-1 text-left">
      <label htmlFor={checkboxId} className="flex items-start gap-2.5 cursor-pointer select-none group">
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`w-4 h-4 rounded-md border transition-all duration-150 flex items-center justify-center
              ${
                checked
                  ? 'bg-[#14334A] border-[#14334A]'
                  : error
                  ? 'border-[#EA4335] bg-white group-hover:border-[#EA4335]'
                  : 'border-[#D1D5DB] bg-white group-hover:border-[#70A1A8]'
              }
              peer-focus-visible:ring-2 peer-focus-visible:ring-[#70A1A8]/40 peer-focus-visible:ring-offset-1
            `}
          >
            {checked && <Check size={12} className="text-white stroke-[2.5]" />}
          </div>
        </div>

        <span className="text-xs text-[#64748B] leading-tight">
          {label}
        </span>
      </label>

      {error && (
        <p className="text-xs text-[#EA4335] ml-6 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
