import React from 'react';
import { useMobile } from '../../hooks/useMobile';

const weekDaysDesktop = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const weekDaysMobile = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const CalendarWeekDays = () => {
    const isMobile = useMobile();
    const weekDays = isMobile ? weekDaysMobile : weekDaysDesktop;

    return (
        <div className="grid grid-cols-7 border-b border-border bg-surface/50 relative z-10">
            {weekDays.map(day => (
                <div
                    key={day}
                    style={{
                        padding: isMobile ? '6px 2px' : '12px 16px',
                        textAlign: 'center',
                        fontSize: isMobile ? '0.65rem' : '0.75rem',
                        fontWeight: 800,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    {day}
                </div>
            ))}
        </div>
    );
};

export default CalendarWeekDays;