import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';

const CalendarDay = ({ day, activities, isCurrentMonth, isToday, calendarColor, onDayClick }) => {
    const dayActivities = activities.filter(a => isSameDay(new Date(a.date), day));

    return (
        <motion.div
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            onClick={() => onDayClick(day)}
            className={`
        min-h-[60px] md:min-h-[100px] p-1 md:p-2 border-r border-b border-border cursor-pointer transition-all flex flex-col gap-1
        ${!isCurrentMonth ? 'opacity-30 bg-background/30' : 'bg-surface/10'}
        ${isToday ? 'relative' : ''}
      `}
        >
            <div className="flex justify-between items-start mb-1">
                <motion.span
                    initial={isToday ? { scale: 0.8 } : {}}
                    animate={isToday ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, type: "spring" }}
                    className={`
            size-8 md:size-10 flex items-center justify-center rounded-full text-sm md:text-base font-extrabold relative z-10
            ${isToday ? 'text-white' : ''}
          `}
                    style={{ backgroundColor: isToday ? calendarColor : 'transparent' }}
                >
                    {format(day, 'd')}
                </motion.span>
                {dayActivities.length > 0 && (
                    <div className="flex -space-x-1 relative z-10">
                        {dayActivities.slice(0, 3).map((_, i) => (
                            <div
                                key={i}
                                className="size-2 rounded-full border border-surface"
                                style={{ backgroundColor: calendarColor }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-1 flex-1 overflow-hidden relative z-10">
                {dayActivities.slice(0, 2).map((activity, i) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-[9px] md:text-[10px] p-0.5 md:p-1 px-1 md:px-2 rounded bg-surface border-l-2 truncate font-bold hidden sm:block"
                        style={{ borderLeftColor: calendarColor }}
                    >
                        {activity.title}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default CalendarDay;