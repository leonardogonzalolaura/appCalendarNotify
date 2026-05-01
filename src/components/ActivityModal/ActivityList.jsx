import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityItem from './ActivityItem';

const ActivityList = ({ activities, onDelete, onViewDetail, calendarColor }) => {
    if (activities.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl text-muted">
                No hay actividades registradas aún.
            </div>
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
                        calendarColor={calendarColor}
                    />
                ))}
            </div>
        </AnimatePresence>
    );
};

export default ActivityList;