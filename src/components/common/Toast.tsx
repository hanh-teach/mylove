import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, Loader2, RotateCcw, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  onUndo?: () => void;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, options?: { onUndo?: () => void; duration?: number }) => string;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, any>>({});

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', options?: { onUndo?: () => void; duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, onUndo: options?.onUndo }]);
    
    if (type !== 'loading') {
      const duration = options?.duration || 4000;
      timers.current[id] = setTimeout(() => {
        hideToast(id);
      }, duration);
    }

    return id;
  }, [hideToast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'error': return <AlertCircle size={18} className="text-rose-500" />;
      case 'warning': return <AlertCircle size={18} className="text-amber-500" />;
      case 'info': return <Info size={18} className="text-blue-500" />;
      case 'loading': return <Loader2 size={18} className="text-slate-400 animate-spin" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success': return 'border-emerald-100 bg-emerald-50 text-emerald-900';
      case 'error': return 'border-rose-100 bg-rose-50 text-rose-900';
      case 'warning': return 'border-amber-100 bg-amber-50 text-amber-900';
      case 'info': return 'border-blue-100 bg-blue-50 text-blue-900';
      default: return 'border-slate-100 bg-white text-slate-900';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl border ${getBgColor(toast.type)}`}
            >
              <div className="shrink-0">{getIcon(toast.type)}</div>
              <div className="flex-1 text-sm font-bold leading-tight">{toast.message}</div>
              
              {toast.onUndo && (
                <button 
                  onClick={() => { toast.onUndo?.(); hideToast(toast.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <RotateCcw size={12} />
                  Undo
                </button>
              )}

              <button 
                onClick={() => hideToast(toast.id)}
                className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
