import React from 'react';

export interface SkillTagProps {
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function SkillTag({ label, size = 'sm', className = '' }: SkillTagProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg bg-[#FAF9F6] text-[#14334A] border border-[#C8B294]/40 hover:border-[#70A1A8] hover:bg-[#EBF4F5] transition-colors duration-150 ${sizeStyles[size]} ${className}`}
    >
      {label}
    </span>
  );
}
