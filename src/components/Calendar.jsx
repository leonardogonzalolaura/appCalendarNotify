import React, { useState } from 'react';
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
  const { activities, settings, updateSettings, toggleTheme, theme } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

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

  return (
    <div className="relative group/calendar">
      {/* Floating Mascot (Outside overflow-hidden to prevent clipping) */}
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        className="absolute -top-8 -left-2 z-50 pointer-events-none sm:pointer-events-auto size-16 md:size-20"
      >
        <img 
          src={
            {
              'hellokitty': '/src/assets/img/kellokitty001.png',
              'pikachu': '/src/assets/img/pikachu.png',
              'snoppy': '/src/assets/img/snoppy.png',
              'dragonair': '/src/assets/img/dragonair.png',
              'squirtle': '/src/assets/img/squirtle.png',
              'default': 'https://img.icons8.com/fluency/96/appointment-reminders.png'
            }[settings.popupCharacter] || '/src/assets/img/kellokitty001.png'
          } 
          alt="Mascot" 
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </motion.div>

      <div className="glass-card overflow-hidden">
        {/* Header with Navigation and Personalization */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-4 border-b border-border bg-surface/30 pl-20 md:pl-24">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
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
      <div className="grid grid-cols-7 border-b border-border bg-surface/50">
        {weekDays.map(day => (
          <div key={day} className="p-4 text-center text-[10px] font-black text-muted uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Table */}
      <div className="grid grid-cols-7 border-l border-border">
        {days.map((day, idx) => {
          const dayActivities = activities.filter(a => isSameDay(new Date(a.date), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day.toString()}
              whileHover={{ backgroundColor: 'var(--surface)' }}
              onClick={() => onDayClick(day)}
              className={`
                min-h-[120px] p-2 border-r border-b border-border cursor-pointer transition-all flex flex-col gap-1
                ${!isCurrentMonth ? 'opacity-30 bg-background/30' : 'bg-surface/10'}
                ${isToday ? 'relative' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`
                  size-8 flex items-center justify-center rounded-full text-sm font-bold
                  ${isToday ? 'text-white' : ''}
                `}
                  style={{ backgroundColor: isToday ? settings.calendarColor : 'transparent' }}>
                  {format(day, 'd')}
                </span>
                {dayActivities.length > 0 && (
                  <div className="flex -space-x-1">
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

              <div className="space-y-1 flex-1 overflow-hidden">
                {dayActivities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="text-[10px] p-1 px-2 rounded bg-surface border-l-2 truncate font-bold"
                    style={{ borderLeftColor: settings.calendarColor }}
                  >
                    {activity.title}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);
};

export default Calendar;
