import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMobile } from '../../hooks/useMobile';

const CalendarHeader = ({ currentMonth, onPrevMonth, onNextMonth, onGoToToday }) => {
    const isMobile = useMobile();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '8px' : '16px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            backgroundColor: 'rgba(var(--surface-rgb), 0.3)',
            position: 'relative',
            zIndex: 10
        }}>
            <button
                onClick={onPrevMonth}
                style={{
                    padding: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center'
                }}
                aria-label="Mes anterior"
            >
                <ChevronLeft size={isMobile ? 18 : 20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px' }}>
                <motion.h2
                    key={currentMonth.toString()}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        fontSize: isMobile ? '1rem' : '1.5rem',
                        fontWeight: 900,
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {isMobile
                        ? format(currentMonth, "MMM'' yy", { locale: es })
                        : format(currentMonth, "MMMM yyyy", { locale: es })
                    }
                </motion.h2>
                <button
                    onClick={onGoToToday}
                    style={{
                        fontSize: isMobile ? '10px' : '11px',
                        fontWeight: 700,
                        padding: isMobile ? '2px 8px' : '3px 12px',
                        borderRadius: '9999px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.4
                    }}
                >
                    Hoy
                </button>
            </div>

            <button
                onClick={onNextMonth}
                style={{
                    padding: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center'
                }}
                aria-label="Mes siguiente"
            >
                <ChevronRight size={isMobile ? 18 : 20} />
            </button>
        </div>
    );
};

export default CalendarHeader;