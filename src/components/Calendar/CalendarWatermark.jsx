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
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 dark:opacity-[0.06] z-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={monthKey}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                    className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52"
                >
                    <img
                        src={currentMascot.img}
                        alt="Mascot Watermark"
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'grayscale(100%)',
                            opacity: 0.8
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CalendarWatermark;