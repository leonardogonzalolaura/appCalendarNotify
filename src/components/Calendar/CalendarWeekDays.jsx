import React from 'react';

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const CalendarWeekDays = () => {
    return (
        <div className="grid grid-cols-7 border-b border-border bg-surface/50 relative z-10">
            {weekDays.map(day => (
                <div key={day} className="p-2 md:p-4 text-center text-xs md:text-sm font-extrabold text-muted uppercase tracking-wider">
                    {day}
                </div>
            ))}
        </div>
    );
};

export default CalendarWeekDays;