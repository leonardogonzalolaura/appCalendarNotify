import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Type, Repeat, Bell, Save, Plus, Trash2, List, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp } from '../context/AppContext';

const ActivityModal = ({ isOpen, onClose, selectedDate, onSave }) => {
  const { activities, deleteActivity, settings, characters } = useApp();
  const [view, setView] = useState('list');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');
  const [notifyCount, setNotifyCount] = useState(3);
  const [selectedChar, setSelectedChar] = useState(settings.popupCharacter || 'hellokitty');
  const [isCharPickerOpen, setIsCharPickerOpen] = useState(false);

  const charButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Calcular posición del dropdown cuando se abre
  useEffect(() => {
    if (isCharPickerOpen && charButtonRef.current) {
      const rect = charButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isCharPickerOpen]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCharPickerOpen && charButtonRef.current && !charButtonRef.current.contains(event.target)) {
        // Verificar si el clic fue en el dropdown
        const dropdown = document.getElementById('character-dropdown');
        if (dropdown && !dropdown.contains(event.target)) {
          setIsCharPickerOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCharPickerOpen]);

  const dayActivities = activities.filter(a => isSameDay(new Date(a.date), selectedDate));

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':');
    const activityDate = new Date(selectedDate);
    activityDate.setHours(parseInt(hours), parseInt(minutes), 0);

    onSave({
      id: crypto.randomUUID(),
      title,
      description,
      date: activityDate.toISOString(),
      notifyCount,
      characterId: selectedChar,
      remindersLeft: notifyCount,
      status: 'pending'
    });

    setTitle('');
    setDescription('');
    setView('list');
  };

  // Dropdown component que se renderiza en un portal
  const CharacterDropdown = () => {
    if (!isCharPickerOpen) return null;

    return createPortal(
      <AnimatePresence>
        <motion.div
          id="character-dropdown"
          initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[100] bg-surface border border-border rounded-2xl shadow-2xl overflow-y-auto custom-scrollbar"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: '300px',
            transformOrigin: 'top'
          }}
        >
          <div className="p-2">
            <p className="text-[10px] font-bold text-muted px-3 py-2 uppercase tracking-widest border-b border-border mb-1 sticky top-0 bg-surface">
              Elige un personaje
            </p>
            {characters.map(char => (
              <button
                key={char.id}
                type="button"
                onClick={() => {
                  setSelectedChar(char.id);
                  setIsCharPickerOpen(false);
                }}
                className={`
                  flex items-center gap-4 p-3 rounded-xl border transition-all w-full mb-1
                  ${selectedChar === char.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-background hover:border-border'
                  }
                `}
              >
                <img src={char.img} alt={char.name} className="size-10 object-contain" />
                <div className="text-left flex-1">
                  <span className="text-sm font-bold block">{char.name}</span>
                  <span className="text-[10px] text-muted capitalize">{char.id.replace(/[0-9]/g, '')}</span>
                </div>
                {selectedChar === char.id && (
                  <div className="size-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card w-full max-w-lg p-8 relative flex flex-col max-h-[90vh] shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-surface rounded-full transition-colors text-muted z-10"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {view === 'list' ? <List className="text-primary" /> : <Plus className="text-primary" />}
                {view === 'list' ? 'Actividades del Día' : 'Agregar Nueva Actividad'}
              </h2>
              <p className="text-muted capitalize">
                {format(selectedDate, "eeee d 'de' MMMM", { locale: es })}
              </p>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
              {view === 'list' ? (
                <div className="space-y-4">
                  {dayActivities.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl text-muted">
                      No hay actividades registradas aún.
                    </div>
                  ) : (
                    dayActivities.map((activity) => (
                      <motion.div
                        layout
                        key={activity.id}
                        className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between group transition-all hover:border-primary/20"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="size-2 rounded-full bg-primary" />
                            <span className="text-sm font-black text-primary">{format(new Date(activity.date), 'HH:mm')}</span>
                            <span className="font-bold">{activity.title}</span>
                          </div>
                          {activity.description && (
                            <p className="text-xs text-muted pl-5 italic opacity-80">{activity.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className="p-2 text-muted hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold flex items-center gap-2 text-muted uppercase tracking-wider">
                      <Type size={14} /> Título de la Tarea
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Reunión de trabajo"
                      className="w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold flex items-center gap-2 text-muted uppercase tracking-wider">
                        <Clock size={14} /> Hora
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
                      <label className="text-xs font-bold flex items-center gap-2 text-muted uppercase tracking-wider">
                        <Bell size={14} /> Avisos
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

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted uppercase tracking-wider">Personaje de Notificación</label>

                    {/* Custom Character Select */}
                    <div className="relative">
                      <button
                        ref={charButtonRef}
                        type="button"
                        onClick={() => setIsCharPickerOpen(!isCharPickerOpen)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-border bg-surface hover:border-primary/30 transition-all shadow-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={characters.find(c => c.id === selectedChar)?.img || characters[0].img}
                            className="size-8 object-contain"
                            alt="selected"
                          />
                          <span className="font-bold text-sm">
                            {characters.find(c => c.id === selectedChar)?.name || 'Seleccionar Personaje'}
                          </span>
                        </div>
                        <ChevronDown size={18} className={`text-muted transition-transform duration-200 ${isCharPickerOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setView('list')}
                      className="flex-1 p-3 border border-border rounded-xl hover:bg-surface transition-colors text-sm font-bold"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm font-bold"
                    >
                      <Save size={18} />
                      Guardar
                    </button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* Footer */}
            {view === 'list' && (
              <div className="mt-6 pt-6 border-t border-border flex-shrink-0">
                <button
                  onClick={() => setView('add')}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-sm font-bold"
                >
                  <Plus size={20} />
                  Agregar Nueva Actividad
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Dropdown renderizado fuera del modal */}
      <CharacterDropdown />
    </>
  );
};

export default ActivityModal;