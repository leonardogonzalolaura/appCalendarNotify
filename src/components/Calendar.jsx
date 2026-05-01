import React, { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Bell, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Calendar = ({ onDayClick }) => {
  const { activities, settings, updateSettings, toggleTheme, theme, characters } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isChangingMonth, setIsChangingMonth] = useState(false);
  const [direction, setDirection] = useState(0); // -1 para izquierda, 1 para derecha

  const nextMonth = () => {
    setDirection(1);
    setIsChangingMonth(true);
    setTimeout(() => {
      setCurrentMonth(addMonths(currentMonth, 1));
      setIsChangingMonth(false);
    }, 200);
  };

  const prevMonth = () => {
    setDirection(-1);
    setIsChangingMonth(true);
    setTimeout(() => {
      setCurrentMonth(subMonths(currentMonth, -1));
      setIsChangingMonth(false);
    }, 200);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
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

  const currentMascot = characters.find(c => c.id === settings.popupCharacter) || characters[0];

  return (
    <div className="relative group/calendar">
      <div className="glass-card overflow-hidden relative">
        {/* Watermark Mascot - Static sin animación */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 dark:opacity-[0.03] z-0">
          <div className="w-64 h-64 md:w-96 md:h-96">
            <img
              src={currentMascot.img}
              alt="Mascot Watermark"
              className="w-full h-full object-contain"
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>
        </div>

        {/* Header with Navigation and Personalization */}
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
              <button onClick={prevMonth} className="p-2 hover:bg-background rounded-lg transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-background rounded-lg transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Floating Customizer Toolbar */}
          <div className="flex items-center gap-4 bg-surface p-2 px-4 rounded-2xl border border-border shadow-lg">
            <div className="flex gap-1.5">
              {colors.map(c => (
                <button
                  key={c.value}
                  onClick={() => updateSettings({ calendarColor: c.value, primaryColor: c.value })}
                  className={`size-5 rounded-full border-2 transition-all ${settings.calendarColor === c.value ? 'border-text scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <div className="h-6 w-px bg-border" />
            <button onClick={toggleTheme} className="p-2 hover:bg-background rounded-lg">
              {theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* WeekDays */}
        <div className="grid grid-cols-7 border-b border-border bg-surface/50 relative z-10">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center text-[10px] font-black text-muted uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Table with Animation */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentMonth.toString()}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction === 1 ? 100 : direction === -1 ? -100 : 0
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: direction === 1 ? -100 : direction === -1 ? 100 : 0
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="grid grid-cols-7 border-l border-border relative z-10"
            >
              {days.map((day, idx) => {
                const dayActivities = activities.filter(a => isSameDay(new Date(a.date), day));
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                return (
                  <motion.div
                    key={day.toString()}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    onClick={() => onDayClick(day)}
                    className={`
                      min-h-[120px] p-2 border-r border-b border-border cursor-pointer transition-all flex flex-col gap-1
                      ${!isCurrentMonth ? 'opacity-30 bg-background/30' : 'bg-surface/10'}
                      ${isToday ? 'relative' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <motion.span
                        initial={isToday ? { scale: 0.8 } : {}}
                        animate={isToday ? { scale: 1 } : {}}
                        transition={{ duration: 0.3, type: "spring" }}
                        className={`
                          size-8 flex items-center justify-center rounded-full text-sm font-bold relative z-10
                          ${isToday ? 'text-white' : ''}
                        `}
                        style={{ backgroundColor: isToday ? settings.calendarColor : 'transparent' }}
                      >
                        {format(day, 'd')}
                      </motion.span>
                      {dayActivities.length > 0 && (
                        <div className="flex -space-x-1 relative z-10">
                          {dayActivities.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className="size-2 rounded-full border border-surface"
                              style={{ backgroundColor: settings.calendarColor }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 overflow-hidden relative z-10">
                      {dayActivities.slice(0, 3).map((activity, i) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-[10px] p-1 px-2 rounded bg-surface border-l-2 truncate font-bold"
                          style={{ borderLeftColor: settings.calendarColor }}
                        >
                          {activity.title}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading Overlay mientras cambia de mes */}
        <AnimatePresence>
          {isChangingMonth && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.5, repeat: Infinity }
                }}
                className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;