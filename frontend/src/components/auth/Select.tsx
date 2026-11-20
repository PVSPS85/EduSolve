import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  required?: boolean;
}

export default function Select({
  label,
  options,
  error,
  helperText,
  leftIcon,
  required,
  className = '',
  id,
  value,
  ...props
}: SelectProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label htmlFor={selectId} className="text-xs font-semibold text-[#14334A] flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#A57E59]">*</span>}
        </span>
      </label>

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-[#94A3B8] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </span>
        )}

        <select
          id={selectId}
          value={value}
          className={`w-full bg-white text-sm text-[#183047] rounded-xl border appearance-none transition-all duration-200 outline-none cursor-pointer
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            pr-10 py-2.5 sm:py-3
            ${
              error
                ? 'border-[#EA4335] focus:border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                : 'border-[#E5E7EB] hover:border-[#C8B294] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[#183047] py-1">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron Down */}
        <div className="absolute right-3.5 pointer-events-none text-[#64748B] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {error ? (
        <p className="text-xs text-[#EA4335] mt-0.5 flex items-center gap-1 font-medium">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-[#64748B] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
