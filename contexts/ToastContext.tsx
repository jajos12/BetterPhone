import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl border backdrop-blur-md animate-scaleIn
              ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : ''}
              ${toast.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : ''}
              ${toast.type === 'info' ? 'bg-white border-[#D7CCC8]/40 text-[#3E2723]' : ''}
            `}
            role="alert"
          >
            {toast.type === 'success' && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
            {toast.type === 'error' && <i className="fa-solid fa-circle-exclamation text-rose-500"></i>}
            {toast.type === 'info' && <i className="fa-solid fa-circle-info text-[#3E2723]"></i>}
            <span className="text-xs font-bold">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
