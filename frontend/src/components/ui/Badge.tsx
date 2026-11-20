import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'sand' | 'navy' | 'taupe' | 'gold' | 'gray';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export default function Badge({
  children,
  variant = 'teal',
  size = 'md',
  icon,
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
  };

  const variantStyles = {
    // Muted Teal tint
    teal: 'bg-[#EBF4F5] text-[#1E4663] border border-[#70A1A8]/40',
    // Warm Sand tint
    sand: 'bg-[#FAF3E5] text-[#836527] border border-[#EDD7AE]',
    // Deep Ocean Navy solid/tint
    navy: 'bg-[#14334A]/10 text-[#14334A] border border-[#14334A]/20',
    // Natural Taupe tint
    taupe: 'bg-[#F4EFE9] text-[#A57E59] border border-[#C8B294]/50',
    // Antique Gold tint
    gold: 'bg-[#FFFBEB] text-[#836527] border border-[#836527]/30',
    // Subtle Gray
    gray: 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
