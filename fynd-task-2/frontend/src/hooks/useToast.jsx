import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(undefined);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options) => {
    return addToast(options);
  }, [addToast]);

  toast.success = (options) => addToast({ ...options, variant: 'success' });
  toast.error = (options) => addToast({ ...options, variant: 'destructive' });
  toast.warning = (options) => addToast({ ...options, variant: 'warning' });

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
