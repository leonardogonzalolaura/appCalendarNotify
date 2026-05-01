import React from 'react';
import { Moon, Sun, Palette, Image as ImageIcon, Check, BellRing } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const Settings = () => {
  const { theme, toggleTheme, settings, updateSettings, characters } = useApp();

  const colors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Violet', value: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 animate-fade">
      {/* Appearance Section */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Palette size={20} className="text-primary" /> Apariencia
        </h3>
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="font-medium">Modo Oscuro</p>
            <p className="text-sm text-muted">Cambia el estilo visual de la aplicación</p>
          </div>
          <button 
            onClick={toggleTheme}
            className={`
              relative w-14 h-8 rounded-full transition-colors
              ${theme === 'dark' ? 'bg-primary' : 'bg-slate-200'}
            `}
          >
            <motion.div 
              animate={{ x: theme === 'dark' ? 24 : 4 }}
              className="absolute top-1 size-6 bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              {theme === 'dark' ? <Moon size={14} className="text-primary" /> : <Sun size={14} className="text-amber-500" />}
            </motion.div>
          </button>
        </div>
      </section>

      {/* Colors Sections */}
      <section>
        <h3 className="text-lg font-bold mb-4">Color de Acentos (Botones)</h3>
        <div className="flex gap-4">
          {colors.map(color => (
            <button
              key={color.value}
              onClick={() => updateSettings({ primaryColor: color.value })}
              className="size-12 rounded-full border-4 border-surface shadow-lg flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: color.value }}
            >
              {settings.primaryColor === color.value && <Check size={20} className="text-white" />}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Color del Calendario</h3>
        <div className="flex gap-4">
          {colors.map(color => (
            <button
              key={`cal-${color.value}`}
              onClick={() => updateSettings({ calendarColor: color.value })}
              className="size-12 rounded-xl border-4 border-surface shadow-lg flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: color.value }}
            >
              {settings.calendarColor === color.value && <Check size={20} className="text-white" />}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications Section */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BellRing size={20} className="text-primary" /> Notificaciones de Sistema
        </h3>
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Estado del Permiso</p>
              <p className="text-sm text-muted">
                {Notification.permission === 'granted' ? '✅ Activado' : Notification.permission === 'denied' ? '❌ Denegado' : '⏳ Pendiente'}
              </p>
            </div>
            {Notification.permission !== 'granted' && (
              <button 
                onClick={() => Notification.requestPermission().then(() => window.location.reload())}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors"
              >
                Activar
              </button>
            )}
          </div>
          <button 
            onClick={() => {
              const char = characters.find(c => c.id === settings.popupCharacter) || characters[0];
              new Notification("¡Prueba de AgendaPro!", { 
                body: "Si ves esto, las notificaciones de sistema están funcionando correctamente.",
                icon: char.img
              });
            }}
            className="w-full py-2 border border-border rounded-lg text-sm font-bold hover:bg-surface transition-colors"
          >
            Enviar Notificación de Prueba
          </button>
        </div>
      </section>

      {/* Characters Section */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ImageIcon size={20} className="text-primary" /> Personaje de Notificación
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {characters.map(char => (
            <button
              key={char.id}
              onClick={() => updateSettings({ popupCharacter: char.id })}
              className={`
                glass-card p-4 flex flex-col items-center gap-3 transition-all
                ${settings.popupCharacter === char.id ? 'border-primary border-2 ring-4 ring-primary/10' : ''}
              `}
            >
              <img src={char.img} alt={char.name} className="size-16 object-contain" />
              <span className="font-bold text-xs text-center">{char.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
