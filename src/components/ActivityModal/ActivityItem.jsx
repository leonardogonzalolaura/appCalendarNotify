import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2, Info, Pencil } from 'lucide-react';
import DescriptionTooltip from './DescriptionTooltip';

const ActivityItem = ({ activity, onDelete, onViewDetail, onEdit }) => {
    const hasDescription = activity.description && activity.description.trim().length > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-surface border-b border-border/50 transition-all hover:bg-background/30"
            style={{
                borderRadius: '0px',
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none'
            }}
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
                            className="p-1.5 text-muted hover:text-primary transition-all"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                borderRadius: '0px'
                            }}
                            title="Ver detalles"
                        >
                            <Info size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(activity)}
                        className="p-1.5 text-muted hover:text-primary transition-all"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            borderRadius: '0px'
                        }}
                        title="Editar actividad"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(activity.id)}
                        className="p-1.5 text-muted hover:text-red-500 transition-all"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            borderRadius: '0px'
                        }}
                        title="Eliminar actividad"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {hasDescription && (
                <DescriptionTooltip description={activity.description}>
                    <p
                        className="text-xs text-muted/70 pl-5 italic line-clamp-2 break-words cursor-pointer hover:text-primary transition-colors"
                        style={{
                            background: 'transparent',
                            borderRadius: '0px'
                        }}
                    >
                    </p>
                </DescriptionTooltip>
            )}
        </motion.div>
    );
};

export default ActivityItem;