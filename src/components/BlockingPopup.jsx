import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, BellRing } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BlockingPopup = () => {
  const { settings, updateSettings, updateActivity, postponeActivity, characters } = useApp();
  const audioRef = useRef(null);

  useEffect(() => {
    if (settings.showNotification && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
  }, [settings.showNotification]);

  const [customMinutes, setCustomMinutes] = useState(60);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  if (!settings.showNotification || !settings.currentNotification) return null;

  const activity = settings.currentNotification;

  const handleComplete = () => {
    updateActivity(activity.id, { status: 'completed' });
    updateSettings({ showNotification: false, currentNotification: null });
  };

  const character = characters.find(c => c.id === (activity.characterId || settings.popupCharacter)) || characters[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        loop
      />

      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="glass-card max-w-lg w-full p-5 md:p-10 text-center relative overflow-hidden flex flex-col"
        style={{ borderColor: 'var(--primary)', borderWidth: '2px' }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 10, repeat: Infinity }}
            className="h-full bg-secondary"
          />
        </div>

        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6 flex justify-center"
        >
          <div className="bg-white p-3 md:p-4 rounded-full shadow-xl">
            <img
              src={character.img}
              alt={character.name}
              className="size-20 md:size-32 object-contain"
            />
          </div>
        </motion.div>

        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs md:text-sm mb-3">
            <BellRing size={14} /> ¡HORA DE LA ACTIVIDAD!
          </span>
          <h2 className="text-2xl md:text-4xl font-black mb-2">{activity.title}</h2>
          <p className="text-sm md:text-lg text-muted">{activity.description || 'Es momento de cumplir con tu tarea.'}</p>
        </div>

        <div className="flex flex-col gap-3">
          {!isCustomOpen ? (
            <>
              <button
                onClick={handleComplete}
                className="w-full py-3 md:py-4 rounded-2xl bg-primary text-white text-base md:text-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg"
              >
                <CheckCircle size={24} />
                Marcar como Hecha
              </button>

              <div className="grid grid-cols-4 gap-2">
                <SnoozeButton mins={5} label="+5m" onClick={() => {
                  postponeActivity(activity.id, 5);
                  updateSettings({ showNotification: false, currentNotification: null });
                }} />
                <SnoozeButton mins={15} label="+15m" onClick={() => {
                  postponeActivity(activity.id, 15);
                  updateSettings({ showNotification: false, currentNotification: null });
                }} />
                <SnoozeButton mins={30} label="+30m" onClick={() => {
                  postponeActivity(activity.id, 30);
                  updateSettings({ showNotification: false, currentNotification: null });
                }} />
                <button
                  onClick={() => setIsCustomOpen(true)}
                  className="py-3 rounded-xl border border-border text-xs font-bold hover:bg-primary/5 hover:border-primary transition-all flex flex-col items-center justify-center"
                >
                  Otro
                </button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="flex-1 text-center text-2xl font-bold p-4"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                  autoFocus
                />
                <span className="font-bold text-muted">minutos</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomOpen(false)}
                  className="flex-1 py-3 border border-border rounded-xl font-bold text-sm"
                >
                  Volver
                </button>
                <button
                  onClick={() => {
                    postponeActivity(activity.id, customMinutes);
                    updateSettings({ showNotification: false, currentNotification: null });
                  }}
                  className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold"
                >
                  Posponer {customMinutes} min
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-4 md:mt-8 text-xs text-muted bg-surface/50 p-3 rounded-xl">
          Esta pantalla está bloqueada hasta que confirmes la actividad o elijas un tiempo para posponer.
        </div>
      </motion.div>
    </div>
  );
};

const SnoozeButton = ({ mins, label, onClick }) => {
  const { updateSettings } = useApp();
  return (
    <button
      onClick={() => {
        onClick();
        updateSettings({ showNotification: false, currentNotification: null });
      }}
      className="py-3 rounded-xl border border-border text-sm font-bold hover:bg-primary/5 hover:border-primary transition-all flex flex-col items-center gap-1"
    >
      <span className="text-[10px] text-muted font-medium">Pospone</span>
      {label}
    </button>
  );
};

export default BlockingPopup;
