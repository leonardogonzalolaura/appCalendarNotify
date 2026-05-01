import React, { useState } from 'react';
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import CalendarHeader from './CalendarHeader';
import CalendarWeekDays from './CalendarWeekDays';
import CalendarDay from './CalendarDay';
import CalendarWatermark from './CalendarWatermark';

const Calendar = ({ onDayClick }) => {
    const { activities, settings } = useApp();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => {
        setCurrentMonth(prev => addMonths(prev, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(prev => subMonths(prev, -1));
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="relative group/calendar">
            <div className="glass-card overflow-hidden relative">
                {/* Pasamos currentMonth como prop */}
                <CalendarWatermark currentMonth={currentMonth} />

                <CalendarHeader
                    currentMonth={currentMonth}
                    onPrevMonth={prevMonth}
                    onNextMonth={nextMonth}
                />

                <CalendarWeekDays />

                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentMonth.toString()}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="grid grid-cols-7 border-l border-border relative z-10"
                        >
                            {days.map((day) => {
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isToday = isSameDay(day, new Date());

                                return (
                                    <CalendarDay
                                        key={day.toString()}
                                        day={day}
                                        activities={activities}
                                        isCurrentMonth={isCurrentMonth}
                                        isToday={isToday}
                                        calendarColor={settings?.calendarColor || '#6366f1'}
                                        onDayClick={onDayClick}
                                    />
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Calendar;