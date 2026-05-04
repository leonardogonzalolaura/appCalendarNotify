import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CalendarHeader = ({ currentMonth, onPrevMonth, onNextMonth }) => {
    return (
        <div className="flex items-center justify-between p-2 md:p-4 border-b border-border bg-surface/30 relative z-10">
            <button
                onClick={onPrevMonth}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                aria-label="Mes anterior"
            >
                <ChevronLeft size={20} />
            </button>

            <motion.h2
                key={currentMonth.toString()}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-2xl font-black capitalize"
            >
                {format(currentMonth, "MMMM yyyy", { locale: es })}
            </motion.h2>

            <button
                onClick={onNextMonth}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                aria-label="Mes siguiente"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default CalendarHeader;