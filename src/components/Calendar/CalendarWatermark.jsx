import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const CalendarWatermark = ({ currentMonth }) => {
    const { settings, characters } = useApp();

    if (!currentMonth || !characters || characters.length === 0) {
        return null;
    }

    const currentMascot = characters.find(c => c.id === settings?.popupCharacter) || characters[0];

    if (!currentMascot) return null;

    const monthKey = currentMonth.toISOString ? currentMonth.toISOString() : String(currentMonth);

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 dark:opacity-[0.08] z-0 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={monthKey}
                    initial={{ opacity: 0, scale: 0.85, y: 15 }}
                    animate={{ 
                        opacity: 1, 
                        scale: 1,
                        y: [0, -12, 0] // Elogiado efecto flotante
                    }}
                    exit={{ opacity: 0, scale: 0.85, y: -15 }}
                    transition={{
                        y: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                    className="w-44 h-44 md:w-56 md:h-56 lg:w-72 lg:h-72 flex items-center justify-center"
                >
                    <img
                        src={currentMascot.img}
                        alt="Mascot Watermark"
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'saturate(85%) drop-shadow(0px 10px 30px rgba(var(--primary-rgb), 0.25))',
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CalendarWatermark;