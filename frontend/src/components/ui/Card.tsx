import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Card({
  children,
  hoverable = false,
  padding = 'lg',
  className = '',
  ...props
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-300 hover:shadow-[0_12px_32px_rgba(20,51,74,0.08)] hover:-translate-y-1 hover:border-[#C8B294]/60'
    : 'transition-shadow duration-200';

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgba(20,51,74,0.04)] ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
