import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from '../icons';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export default function PasswordInput({
  label,
  error,
  helperText,
  required,
  className = '',
  id,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `password-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-xs font-semibold text-[#14334A] flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#A57E59]">*</span>}
        </span>
      </label>

      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-[#94A3B8] pointer-events-none flex items-center justify-center">
          <Lock size={16} />
        </span>

        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={`w-full bg-white text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl border transition-all duration-200 outline-none
            pl-10 pr-11 py-2.5 sm:py-3
            ${
              error
                ? 'border-[#EA4335] focus:border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                : 'border-[#E5E7EB] hover:border-[#C8B294] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20'
            }
            ${className}
          `}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 p-1 text-[#64748B] hover:text-[#14334A] focus:outline-none transition-colors cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
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
