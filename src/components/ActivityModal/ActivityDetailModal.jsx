import React from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const ActivityDetailModal = ({ activity, isOpen, onClose }) => {
    if (!isOpen || !activity) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card p-6 max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary" />
                            {activity.title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-surface rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock size={16} className="text-primary" />
                            <span className="font-mono">{format(new Date(activity.date), 'HH:mm')}</span>
                        </div>

                        {activity.description && (
                            <div className="p-3 bg-surface rounded-xl">
                                <p className="text-xs text-muted mb-1">Descripción:</p>
                                <p className="text-sm whitespace-pre-wrap break-words">{activity.description}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted pt-2">
                            <Bell size={14} />
                            <span>{activity.notifyCount} aviso{activity.notifyCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 btn-primary py-2 text-sm"
                    >
                        Cerrar
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default ActivityDetailModal;