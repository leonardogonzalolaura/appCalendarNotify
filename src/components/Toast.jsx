import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const config = {
  success: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  error: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  info: { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const { icon: Icon, color, bg } = config[toast.type] || config.info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className="glass-card p-4 flex items-center gap-3 shadow-xl pointer-events-auto"
              style={{ borderLeft: `4px solid ${color}`, background: bg }}
            >
              <Icon size={20} style={{ color, flexShrink: 0 }} />
              <span className="text-sm font-bold flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:opacity-70 transition-opacity text-muted flex-shrink-0"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
