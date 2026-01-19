import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../lib/utils';

const icons = {
  default: Info,
  success: CheckCircle,
  destructive: AlertCircle,
  warning: AlertTriangle,
};

const variants = {
  default: 'bg-card border-border',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  destructive: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
};

const iconColors = {
  default: 'text-primary',
  success: 'text-green-600 dark:text-green-400',
  destructive: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant] || icons.default;
        return (
          <div
            key={toast.id}
            className={cn(
              'toast-enter flex items-start gap-3 p-4 rounded-lg border shadow-lg',
              variants[toast.variant] || variants.default
            )}
          >
            <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColors[toast.variant] || iconColors.default)} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="font-semibold text-foreground">{toast.title}</p>
              )}
              {toast.description && (
                <p className="text-sm text-secondary mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
