import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import ActivityItem from './ActivityItem';

const ActivityList = ({ activities, onDelete, onViewDetail, onEdit, calendarColor }) => {
    if (activities.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 border-2 border-dashed border-border rounded-2xl"
            >
                <div className="mx-auto size-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ClipboardList size={28} className="text-primary" />
                </div>
                <p className="font-bold text-muted mb-1">Sin actividades</p>
                <p className="text-xs text-muted/70">
                    No hay actividades registradas para este día.
                </p>
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="popLayout">
            <div className="space-y-3">
                {activities.map((activity) => (
                    <ActivityItem
                        key={activity.id}
                        activity={activity}
                        onDelete={onDelete}
                        onViewDetail={onViewDetail}
                        onEdit={onEdit}
                        calendarColor={calendarColor}
                    />
                ))}
            </div>
        </AnimatePresence>
    );
};

export default ActivityList;