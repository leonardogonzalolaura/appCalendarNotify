import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CalendarToolbar from './CalendarToolbar';

const CalendarHeader = ({ currentMonth, onPrevMonth, onNextMonth }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-4 border-b border-border bg-surface/30 relative z-10">
            <div className="flex items-center gap-6">
                <motion.h2
                    key={currentMonth.toString()}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-black capitalize"
                >
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </motion.h2>
                <div className="flex gap-1 bg-surface p-1 rounded-xl border border-border shadow-sm">
                    <button onClick={onPrevMonth} className="p-2 hover:bg-background rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={onNextMonth} className="p-2 hover:bg-background rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <CalendarToolbar />
        </div>
    );
};

export default CalendarHeader;