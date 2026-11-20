import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-xs font-semibold text-[#14334A] flex items-center justify-between">
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

        <input
          id={inputId}
          className={`w-full bg-white text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl border transition-all duration-200 outline-none
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightIcon ? 'pr-10' : 'pr-3.5'}
            py-2.5 sm:py-3
            ${
              error
                ? 'border-[#EA4335] focus:border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                : 'border-[#E5E7EB] hover:border-[#C8B294] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20'
            }
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3.5 text-[#94A3B8] flex items-center justify-center">
            {rightIcon}
          </span>
        )}
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
