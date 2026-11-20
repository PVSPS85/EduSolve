import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from '../icons';

export interface AlertBannerProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export default function AlertBanner({
  type = 'info',
  title,
  message,
  onDismiss,
  className = '',
}: AlertBannerProps) {
  const styles = {
    error: {
      container: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]',
      icon: <AlertCircle size={18} className="text-[#DC2626] shrink-0 mt-0.5" />,
      titleColor: 'text-[#991B1B]',
    },
    warning: {
      container: 'bg-[#FAF3E5] border-[#EDD7AE] text-[#836527]',
      icon: <AlertTriangle size={18} className="text-[#836527] shrink-0 mt-0.5" />,
      titleColor: 'text-[#836527]',
    },
    info: {
      container: 'bg-[#EBF4F5] border-[#70A1A8]/40 text-[#14334A]',
      icon: <Info size={18} className="text-[#4F7C82] shrink-0 mt-0.5" />,
      titleColor: 'text-[#14334A]',
    },
    success: {
      container: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]',
      icon: <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />,
      titleColor: 'text-[#166534]',
    },
  };

  const current = styles[type];

  return (
    <div
      className={`rounded-xl border p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all ${current.container} ${className}`}
      role="alert"
    >
      {current.icon}
      
      <div className="flex-1 text-left">
        {title && (
          <h5 className={`font-semibold text-xs sm:text-sm mb-0.5 ${current.titleColor}`}>
            {title}
          </h5>
        )}
        <div className="text-xs leading-relaxed opacity-95">{message}</div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-[#64748B] hover:text-[#14334A] p-1 rounded-md transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss alert"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
