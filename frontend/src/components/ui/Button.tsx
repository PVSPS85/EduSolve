import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'sand' | 'outline' | 'outline-subtle' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    // Primary: Deep Ocean Navy
    primary: 'bg-[#14334A] text-white hover:bg-[#1E4663] active:bg-[#0D2232] shadow-[0_2px_8px_rgba(20,51,74,0.16)] focus-visible:ring-[#14334A]',
    
    // Secondary: Muted Teal
    secondary: 'bg-[#70A1A8] text-white hover:bg-[#4F7C82] active:bg-[#3D6469] shadow-[0_2px_8px_rgba(112,161,168,0.25)] focus-visible:ring-[#70A1A8]',
    
    // Warm Sand: Warm accent
    sand: 'bg-[#EDD7AE] text-[#14334A] hover:bg-[#DFBE88] active:bg-[#C8B294] font-semibold shadow-[0_2px_8px_rgba(237,215,174,0.3)] focus-visible:ring-[#EDD7AE]',
    
    // Outline Deep Navy
    outline: 'border-2 border-[#14334A] text-[#14334A] bg-transparent hover:bg-[#14334A]/5 active:bg-[#14334A]/10 focus-visible:ring-[#14334A]',
    
    // Outline Subtle
    'outline-subtle': 'border border-[#E5E7EB] text-[#183047] bg-white hover:border-[#C8B294] hover:bg-[#FAF9F6] focus-visible:ring-[#70A1A8] shadow-sm',
    
    // Ghost
    ghost: 'text-[#14334A] bg-transparent hover:bg-[#14334A]/5 active:bg-[#14334A]/10 focus-visible:ring-[#14334A]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
