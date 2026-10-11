import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AdminAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const AdminAlert: React.FC<AdminAlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
}) => {
  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-emerald-600 hover:text-emerald-950',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-rose-600 hover:text-rose-950',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-amber-600 hover:text-amber-950',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      closeBtn: 'text-blue-600 hover:text-blue-950',
    },
  }[type];

  return (
    <div
      role="alert"
      className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-200 ${styles.bg} ${className}`}
    >
      <div className="flex items-start gap-2.5 flex-1">
        {styles.icon}
        <div className="space-y-0.5">
          {title && <strong className="block font-bold">{title}</strong>}
          <p className="leading-relaxed font-medium">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${styles.closeBtn}`}
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
