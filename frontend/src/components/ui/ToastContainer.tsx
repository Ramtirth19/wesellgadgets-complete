import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleCartUpdate = (event: any) => {
      const toast: ToastData = {
        id: Date.now().toString(),
        message: event.detail.message,
        type: 'success'
      };
      setToasts(prev => [...prev, toast]);
    };

    const handleError = (event: any) => {
      const toast: ToastData = {
        id: Date.now().toString(),
        message: event.detail.message,
        type: 'error'
      };
      setToasts(prev => [...prev, toast]);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('app-error', handleError);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('app-error', handleError);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;