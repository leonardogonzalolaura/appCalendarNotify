import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { useMobile } from '../../hooks/useMobile';

const CalendarDay = ({ day, activities, isCurrentMonth, isToday, calendarColor, onDayClick }) => {
    const isMobile = useMobile();
    const dayActivities = activities.filter(a => isSameDay(new Date(a.date), day));

    return (
        <motion.div
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            onClick={() => onDayClick(day)}
            style={{
                minHeight: isMobile ? '58px' : '80px',
                padding: isMobile ? '3px' : '6px',
                opacity: !isCurrentMonth ? 0.3 : 1,
                backgroundColor: isCurrentMonth ? 'rgba(255,255,255,0.03)' : 'transparent',
                position: isToday ? 'relative' : undefined,
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <motion.span
                    initial={isToday ? { scale: 0.8 } : {}}
                    animate={isToday ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, type: "spring" }}
                    style={{
                        width: isMobile ? '32px' : '36px',
                        height: isMobile ? '32px' : '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        fontWeight: 800,
                        position: 'relative',
                        zIndex: 10,
                        color: isToday ? 'white' : undefined,
                        backgroundColor: isToday ? calendarColor : 'transparent'
                    }}
                >
                    {format(day, 'd')}
                </motion.span>
                {dayActivities.length > 0 && (
                    <div style={{ display: 'flex', position: 'relative', zIndex: 10, marginLeft: '-4px' }}>
                        {dayActivities.slice(0, 3).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: isMobile ? '10px' : '8px',
                                    height: isMobile ? '10px' : '8px',
                                    borderRadius: '50%',
                                    backgroundColor: calendarColor,
                                    border: '1px solid var(--surface)',
                                    marginLeft: '-3px'
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 10 }}>
                    {dayActivities.slice(0, 2).map((activity, i) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                fontSize: '9px',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                backgroundColor: 'var(--surface)',
                                borderLeft: `2px solid ${calendarColor}`,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 700,
                                display: 'block'
                            }}
                        >
                            {activity.title}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default CalendarDay;