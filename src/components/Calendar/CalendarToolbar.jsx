import React, { useState, useEffect } from 'react';
import { Sun, Moon, Palette, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const colors = [
    { name: 'Indigo',   value: '#6366f1' },
    { name: 'Rose',     value: '#f43f5e' },
    { name: 'Emerald',  value: '#10b981' },
    { name: 'Amber',    value: '#f59e0b' },
    { name: 'Violet',   value: '#8b5cf6' },
    { name: 'Pink',     value: '#f787bf' },
    { name: 'Orange',   value: '#f97316' },
];

const CalendarToolbar = () => {
    const { settings, updateSettings, toggleTheme, theme } = useApp();

    // Reactive mobile detection — updates on resize / orientation change
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Close panel when switching to desktop
    useEffect(() => {
        if (!isMobile) setIsPanelOpen(false);
    }, [isMobile]);

    return (
        <>
            {/* ─── DESKTOP: vertical pill toolbar (right side) ─── */}
            {!isMobile && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
                >
                    <div className="flex flex-col items-center gap-4 bg-surface/90 backdrop-blur-xl p-3 rounded-2xl border border-border shadow-2xl">
                        {/* Color swatches */}
                        <div className="flex flex-col gap-2">
                            {colors.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => updateSettings({ calendarColor: c.value, primaryColor: c.value })}
                                    className={`size-8 rounded-full border-2 transition-all hover:scale-110 ${
                                        settings.calendarColor === c.value
                                            ? 'border-text scale-110 shadow-lg'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>

                        <div className="w-full h-px bg-border" />

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-background rounded-xl transition-colors"
                            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                        >
                            {theme === 'dark'
                                ? <Sun size={22} className="text-amber-500" />
                                : <Moon size={22} />
                            }
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ─── MOBILE: FAB + slide-in drawer ─── */}
            {isMobile && (
                <>
                    {/* Floating action button (hidden when panel is open) */}
                    <AnimatePresence>
                        {!isPanelOpen && (
                            <motion.button
                                key="fab"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                onClick={() => setIsPanelOpen(true)}
                                className="fixed bottom-6 right-5 z-50 size-14 rounded-full bg-surface/90 backdrop-blur-xl border border-border shadow-2xl flex items-center justify-center"
                                title="Personalizar"
                            >
                                <Palette size={22} className="text-primary" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Dim backdrop */}
                    <AnimatePresence>
                        {isPanelOpen && (
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                                onClick={() => setIsPanelOpen(false)}
                            />
                        )}
                    </AnimatePresence>

                    {/* Slide-in drawer */}
                    <AnimatePresence>
                        {isPanelOpen && (
                            <motion.div
                                key="drawer"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                                className="fixed right-0 top-0 bottom-0 z-50 w-64 bg-surface/95 backdrop-blur-xl border-l border-border shadow-2xl flex flex-col"
                            >
                                {/* Drawer header */}
                                <div className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
                                    <h3 className="font-bold text-sm">Personalizar</h3>
                                    <button
                                        onClick={() => setIsPanelOpen(false)}
                                        className="p-2 hover:bg-background rounded-xl transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                </div>

                                {/* Drawer body */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-xs text-muted font-bold uppercase tracking-wider">Color</p>
                                        <div className="grid grid-cols-4 gap-3">
                                            {colors.map(c => (
                                                <button
                                                    key={c.value}
                                                    onClick={() => updateSettings({ calendarColor: c.value, primaryColor: c.value })}
                                                    className={`size-11 rounded-full border-2 transition-all hover:scale-110 ${
                                                        settings.calendarColor === c.value
                                                            ? 'border-text scale-110 shadow-lg'
                                                            : 'border-transparent opacity-60'
                                                    }`}
                                                    style={{ backgroundColor: c.value }}
                                                    title={c.name}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-4">
                                        <button
                                            onClick={toggleTheme}
                                            className="w-full p-3 bg-background rounded-xl flex items-center justify-center gap-2 font-bold text-sm"
                                        >
                                            {theme === 'dark'
                                                ? <Sun size={20} className="text-amber-500" />
                                                : <Moon size={20} />
                                            }
                                            <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </>
    );
};

export default CalendarToolbar;