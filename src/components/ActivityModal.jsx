import React, { useState } from 'react';
import { X, Clock, Type, Repeat, Bell, Save, Plus, Trash2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp } from '../context/AppContext';

const ActivityModal = ({ isOpen, onClose, selectedDate, onSave }) => {
  const { activities, deleteActivity, settings } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');
  const [notifyCount, setNotifyCount] = useState(3);
  const [selectedChar, setSelectedChar] = useState(settings.popupCharacter || 'hellokitty');
  const [showForm, setShowForm] = useState(false);

  const characters = [
    { id: 'default', name: 'Alerta', img: 'https://img.icons8.com/fluency/96/appointment-reminders.png' },
    { id: 'hellokitty', name: 'Hello Kitty', img: 'https://img.icons8.com/color/96/hello-kitty.png' },
    { id: 'pikachu', name: 'Pikachu', img: 'https://img.icons8.com/color/96/pikachu.png' },
    { id: 'doraemon', name: 'Doraemon', img: 'https://img.icons8.com/color/96/doraemon.png' },
    { id: 'stitch', name: 'Stitch', img: 'https://img.icons8.com/color/96/stitch.png' },
  ];

  // Filter activities for the selected day
  const dayActivities = activities.filter(a => isSameDay(new Date(a.date), selectedDate));

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':');
    const activityDate = new Date(selectedDate);
    activityDate.setHours(parseInt(hours), parseInt(minutes), 0);

    onSave({
      title,
      description,
      date: activityDate.toISOString(),
      notifyCount,
      characterId: selectedChar,
      remindersLeft: notifyCount
    });

    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-lg p-8 relative flex flex-col max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-surface rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <List className="text-primary" />
              Actividades del Día
            </h2>
            <p className="text-muted capitalize">
              {format(selectedDate, "eeee d 'de' MMMM", { locale: es })}
            </p>
          </div>

          {/* List of existing activities */}
          <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar pr-2">
            {dayActivities.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl text-muted">
                No hay actividades registradas aún.
              </div>
            ) : (
              dayActivities.map((activity) => (
                <div key={activity.id} className="p-3 rounded-2xl bg-surface border border-border flex items-center justify-between group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="size-2 rounded-full bg-primary" />
                      <span className="text-sm font-bold">{format(new Date(activity.date), 'HH:mm')}</span>
                      <span className="font-medium">{activity.title}</span>
                    </div>
                    {activity.description && (
                      <p className="text-xs text-muted pl-4">{activity.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add New Activity Section */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4"
            >
              <Plus size={20} />
              Agregar Nueva Actividad
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmit}
              className="space-y-4 border-t border-border pt-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold flex items-center gap-2 text-muted">
                  <Type size={14} /> TÍTULO
                </label>
                <input
                  type="text"
                  placeholder="Ej: Reunión de trabajo"
                  className="w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold flex items-center gap-2 text-muted">
                    <Clock size={14} /> HORA
                  </label>
                  <input
                    type="time"
                    className="w-full"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold flex items-center gap-2 text-muted">
                    <Bell size={14} /> REPETIR
                  </label>
                  <select 
                    className="w-full"
                    value={notifyCount}
                    onChange={(e) => setNotifyCount(parseInt(e.target.value))}
                  >
                    <option value={1}>1 vez</option>
                    <option value={3}>3 veces</option>
                    <option value={5}>5 veces</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted">PERSONAJE DE NOTIFICACIÓN</label>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {characters.map(char => (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => setSelectedChar(char.id)}
                      className={`
                        flex-shrink-0 p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1
                        ${selectedChar === char.id ? 'border-primary bg-primary/5' : 'border-border grayscale opacity-60'}
                      `}
                    >
                      <img src={char.img} alt={char.name} className="size-8" />
                      <span className="text-[10px] font-bold">{char.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 p-3 border border-border rounded-xl hover:bg-surface transition-colors text-sm font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                >
                  <Save size={18} />
                  Guardar
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivityModal;
