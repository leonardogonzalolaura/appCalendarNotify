import React from 'react';
import { Sun, Moon } from 'lucide-react';
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

    return (
        <div className="flex items-center gap-4 bg-surface p-2 px-4 rounded-2xl border border-border shadow-lg">
            <div className="flex gap-1.5">
                {colors.map(c => (
                    <button
                        key={c.value}
                        onClick={() => updateSettings({ calendarColor: c.value, primaryColor: c.value })}
                        className={`size-5 rounded-full border-2 transition-all ${settings.calendarColor === c.value
                                ? 'border-text scale-110'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        style={{ backgroundColor: c.value }}
                    />
                ))}
            </div>
            <div className="h-6 w-px bg-border" />
            <button onClick={toggleTheme} className="p-2 hover:bg-background rounded-lg">
                {theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
            </button>
        </div>
    );
};

export default CalendarToolbar;