import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-sm p-6 md:p-8 relative shadow-2xl text-center"
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-surface rounded-full transition-colors text-muted"
          >
            <X size={18} />
          </button>

          <div className="mx-auto size-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>

          <h3 className="text-lg md:text-xl font-black mb-2">{title || 'Confirmar acción'}</h3>
          <p className="text-sm text-muted mb-6">{message || '¿Estás seguro de que deseas continuar?'}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-border rounded-xl hover:bg-surface transition-colors text-sm font-bold"
            >
              {cancelText || 'Cancelar'}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl text-white text-sm font-bold bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
            >
              {confirmText || 'Eliminar'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
