import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2, Info } from 'lucide-react';
import DescriptionTooltip from './DescriptionTooltip';

const ActivityItem = ({ activity, onDelete, onViewDetail }) => {
    const hasDescription = activity.description && activity.description.trim().length > 0;

    // Truncar descripción a 100 caracteres
    const truncatedDescription = hasDescription
        ? activity.description.length > 10
            ? activity.description.substring(0, 10) + '...'
            : activity.description
        : '';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-surface border border-border transition-all hover:border-primary/20"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="size-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm font-black text-primary flex-shrink-0">
                        {format(new Date(activity.date), 'HH:mm')}
                    </span>
                    <span className="font-bold truncate">{activity.title}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {hasDescription && (
                        <button
                            onClick={() => onViewDetail(activity)}
                            className="p-2 text-muted hover:text-primary transition-all rounded-lg"
                            title="Ver detalles"
                        >
                            <Info size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(activity.id)}
                        className="p-2 text-muted hover:text-red-500 transition-all rounded-lg"
                        title="Eliminar actividad"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {hasDescription && (
                <DescriptionTooltip description={activity.description}>
                    <p className="text-xs text-muted pl-5 italic opacity-80 line-clamp-2 break-words cursor-pointer hover:text-primary transition-colors">
                        {truncatedDescription}
                    </p>
                </DescriptionTooltip>
            )}
        </motion.div>
    );
};

export default ActivityItem;