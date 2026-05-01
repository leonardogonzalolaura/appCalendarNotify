import React, { useState } from 'react';
import { Sun, Moon, Palette, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const colors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Pink', value: '#f787bfff' },
    { name: 'Orange', value: '#f97316' },
];

const CalendarToolbar = () => {
    const { settings, updateSettings, toggleTheme, theme } = useApp();
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <>
            {/* Botón flotante para mostrar/ocultar en móvil */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="fixed right-4 top-2 z-50 md:hidden bg-surface/90 backdrop-blur-xl p-3 rounded-full border border-border shadow-lg"
            >
                <Palette size={10} className="text-muted" />
            </button>

            {/* Toolbar principal */}
            <AnimatePresence>
                {(isExpanded || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
                    >
                        <div className="flex flex-col items-center gap-4 bg-surface/90 backdrop-blur-xl p-3 rounded-2xl border border-border shadow-2xl">
                            {/* Colores */}
                            <div className="flex flex-col gap-2">
                                {colors.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => updateSettings({ calendarColor: c.value, primaryColor: c.value })}
                                        className={`size-8 rounded-full border-2 transition-all hover:scale-110 ${settings.calendarColor === c.value
                                            ? 'border-text scale-110 shadow-lg'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </div>

                            {/* Separador */}
                            <div className="w-full h-px bg-border" />

                            {/* Toggle tema */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-background rounded-xl transition-colors"
                                title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                            >
                                {theme === 'dark' ? <Sun size={22} className="text-amber-500" /> : <Moon size={22} />}
                            </button>

                            {/* Indicador visual */}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Versión responsive para móvil (cuando está expandido) */}
            <AnimatePresence>
                {isExpanded && window.innerWidth < 768 && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="fixed right-0 top-0 bottom-0 z-50 md:hidden"
                    >
                        <div className="h-full w-64 bg-surface/95 backdrop-blur-xl border-l border-border shadow-2xl p-4 flex flex-col gap-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-sm">Personalizar</h3>
                                <button onClick={() => setIsExpanded(false)} className="p-2">
                                    <ChevronLeft size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs text-muted font-bold">Colores</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {colors.map(c => (
                                        <button
                                            key={c.value}
                                            onClick={() => updateSettings({ calendarColor: c.value, primaryColor: c.value })}
                                            className={`size-10 rounded-full border-2 transition-all ${settings.calendarColor === c.value
                                                ? 'border-text scale-110'
                                                : 'border-transparent opacity-60'
                                                }`}
                                            style={{ backgroundColor: c.value }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <button
                                    onClick={toggleTheme}
                                    className="w-full p-3 bg-background rounded-xl flex items-center justify-center gap-2"
                                >
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                    <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CalendarToolbar;