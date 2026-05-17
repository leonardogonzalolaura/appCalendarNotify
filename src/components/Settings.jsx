import React, { useState, useEffect } from 'react';
import { ImageIcon, Check, X, AlertTriangle, BellRing, Volume2, ShieldAlert, Activity, Info, BatteryCharging } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const Settings = () => {
  const { settings, updateSettings, characters } = useApp();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    // Initial check if user has already active interaction
    if (navigator.userActivation && navigator.userActivation.hasBeenActive) {
      setHasInteracted(true);
    }

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade pb-10">

      {/* Column 1: Alerts Diagnostic Panel */}
      <div className="space-y-8">

        <div className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/50 pb-3">
            <ShieldAlert size={20} className="text-primary" /> Diagnóstico de Alertas
          </h3>

          <p className="text-xs text-muted -mt-3 leading-relaxed">
            Las notificaciones dependen tanto de tu navegador como de la configuración de tu sistema operativo. Revisa el estado actual a continuación para garantizar el correcto funcionamiento:
          </p>

          <div className="flex flex-col">

            {/* 1. Browser Notification Permission */}
            <div
              className="flex items-start gap-4 transition-all"
              style={{
                paddingTop: '1.25rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <span
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'white',
                  backgroundColor: Notification.permission === 'granted'
                    ? '#10b981'
                    : Notification.permission === 'denied'
                      ? '#ef4444'
                      : '#f59e0b',
                  boxShadow: `0 4px 10px ${Notification.permission === 'granted'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : Notification.permission === 'denied'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)'
                    }`
                }}
              >
                {Notification.permission === 'granted' ? <Check size={16} strokeWidth={3} /> : Notification.permission === 'denied' ? <X size={16} strokeWidth={3} /> : <AlertTriangle size={16} strokeWidth={3} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-extrabold text-ms text-text">Permiso del Navegador</p>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      lineHeight: '1.2',
                      backgroundColor: Notification.permission === 'granted' ? '#d1fae5' : Notification.permission === 'denied' ? '#fee2e2' : '#fef3c7',
                      color: Notification.permission === 'granted' ? '#065f46' : Notification.permission === 'denied' ? '#991b1b' : '#92400e',
                      border: `1px solid ${Notification.permission === 'granted'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : Notification.permission === 'denied'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(245, 158, 11, 0.2)'
                        }`
                    }}
                  >
                    {Notification.permission === 'granted' ? 'Permitido' : Notification.permission === 'denied' ? 'Bloqueado' : 'Pendiente'}
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1 leading-relaxed">
                  Permite a la aplicación lanzar globos de alerta de escritorio para tus tareas programadas.
                </p>

                {Notification.permission === 'denied' && (
                  <div
                    className="mt-3 text-[10px] p-3 rounded-lg border leading-normal font-semibold"
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      borderColor: 'rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    🔒 <strong>Instrucciones:</strong> Has bloqueado las notificaciones. Haz clic en el ícono del <strong>candado</strong> (a la izquierda de la URL en tu barra de direcciones) y cambia Notificaciones a <strong>Permitir</strong>. Luego recarga la página.
                  </div>
                )}

                {Notification.permission === 'default' && (
                  <button
                    onClick={() => {
                      Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                          window.location.reload();
                        }
                      });
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1 shadow-sm shadow-primary/20"
                  >
                    <BellRing size={11} />
                    Solicitar Permiso
                  </button>
                )}
              </div>
            </div>

            {/* 2. Page Autoplay / Interaction Status */}
            <div
              className="flex items-start gap-4 transition-all"
              style={{
                paddingTop: '1.25rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <span
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'white',
                  backgroundColor: hasInteracted ? '#10b981' : '#f59e0b',
                  boxShadow: `0 4px 10px ${hasInteracted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`
                }}
              >
                {hasInteracted ? <Check size={16} strokeWidth={3} /> : <AlertTriangle size={16} strokeWidth={3} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-extrabold text-ms text-text">Audio y Alarmas</p>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      lineHeight: '1.2',
                      backgroundColor: hasInteracted ? '#d1fae5' : '#fef3c7',
                      color: hasInteracted ? '#065f46' : '#92400e',
                      border: `1px solid ${hasInteracted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                    }}
                  >
                    {hasInteracted ? 'Listo' : 'Falta Activar'}
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1 leading-relaxed">
                  Los navegadores bloquean el sonido hasta que interactúas con la pestaña.
                  {hasInteracted
                    ? ' ¡Listo! Ya interactuaste, las alarmas sonarán correctamente.'
                    : ' Haz clic en cualquier parte de la pantalla para habilitar el sonido.'}
                </p>
              </div>
            </div>

            {/* 3. Browser Focus Throttling */}
            <div
              className="flex items-start gap-4 transition-all"
              style={{
                paddingTop: '1.25rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <span
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'white',
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)'
                }}
              >
                <Activity size={16} strokeWidth={3} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-extrabold text-ms text-text">Pestaña Activa</p>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      lineHeight: '1.2',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    Navegador
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1 leading-relaxed">
                  Los navegadores reducen la precisión de temporizadores en pestañas secundarias o minimizadas. **Mantén la pestaña visible** para recibir las notificaciones a la hora exacta.
                </p>
              </div>
            </div>

            {/* 4. Windows/macOS Do Not Disturb */}
            <div
              className="flex items-start gap-4 transition-all"
              style={{
                paddingTop: '1.25rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <span
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'white',
                  backgroundColor: '#6366f1',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.15)'
                }}
              >
                <Info size={16} strokeWidth={3} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-extrabold text-ms text-text">Asistente de Enfoque / No Molestar</p>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      lineHeight: '1.2',
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}
                  >
                    Sistema OS
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1 leading-relaxed">
                  Si las alertas están activas pero no ves el globo emergente, tu sistema operativo podría tener activado **No Molestar** o **Asistente de Enfoque** bloqueando los popups.
                </p>
              </div>
            </div>

            {/* 5. Battery Saver Mode */}
            <div
              className="flex items-start gap-4 transition-all"
              style={{
                paddingTop: '1.25rem',
                paddingBottom: '1.25rem'
              }}
            >
              <span
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'white',
                  backgroundColor: '#f59e0b',
                  boxShadow: '0 4px 10px rgba(245, 158, 11, 0.15)'
                }}
              >
                <BatteryCharging size={16} strokeWidth={3} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-extrabold text-ms text-text">Ahorro de Energía</p>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      lineHeight: '1.2',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    Batería
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1 leading-relaxed">
                  El ahorro de batería suspende procesos en segundo plano. Te recomendamos deshabilitarlo para asegurar que tus alertas se activen sin retraso.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Column 2: Notifications Test & Mascot Selection */}
      <div className="space-y-8">

        {/* Notifications Test Card */}
        <div className="glass-card p-6 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/50 pb-3">
            <BellRing size={20} className="text-primary" /> Alertas de Prueba
          </h3>

          <p className="text-xs text-muted -mt-2">
            Usa el botón de abajo para verificar instantáneamente si tu navegador puede emitir alertas.
          </p>

          <button
            onClick={() => {
              console.log("Intentando enviar notificación de prueba...");
              if (!("Notification" in window)) {
                alert("Este navegador no soporta notificaciones de escritorio");
                return;
              }

              try {
                const char = characters.find(c => c.id === settings.popupCharacter) || characters[0];
                const notification = new Notification("¡Prueba de AgendaPro!", {
                  body: "Si ves esto, las notificaciones de sistema están configuradas correctamente.",
                  icon: char?.img,
                  tag: `test-notification-${Date.now()}`,
                  renotify: true
                });

                notification.onclick = () => {
                  window.focus();
                };
              } catch (error) {
                console.error("Error al crear la notificación:", error);
                alert("Hubo un error al lanzar la notificación. Revisa la consola.");
              }
            }}
            className="w-full py-3 border border-border bg-surface/30 hover:bg-surface/75 text-text hover:border-primary/40 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 group"
          >
            Enviar Notificación de Prueba
          </button>
        </div>

        {/* Character / Mascot Picker Card */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/50 pb-3">
            <ImageIcon size={20} className="text-primary" /> Personaje de Notificación
          </h3>
          <p className="text-xs text-muted -mt-1 leading-relaxed">
            El personaje que elijas aparecerá en el popup con su música sonora de alerta cuando una actividad requiera tu atención.
          </p>

          <div className="flex gap-4 overflow-x-auto pb-3 custom-scrollbar snap-x snap-mandatory pt-1">
            {characters.map(char => {
              const isSelected = settings.popupCharacter === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => updateSettings({ popupCharacter: char.id })}
                  className={`
                    glass-card p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 group relative select-none snap-start flex-shrink-0 w-32
                    ${isSelected
                      ? 'border-2 ring-4 ring-offset-2 dark:ring-offset-background'
                      : 'hover:scale-105 border border-border/50 hover:border-primary/30'}
                  `}
                  style={{
                    borderColor: isSelected ? settings.primaryColor : undefined,
                    boxShadow: isSelected ? `0 8px 20px ${settings.primaryColor}15` : undefined
                  }}
                >
                  {isSelected && (
                    <span
                      className="absolute top-1.5 right-1.5 size-5 rounded-full flex items-center justify-center text-white shadow-sm z-10"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                  <img
                    src={char.img}
                    alt={char.name}
                    className="size-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="font-extrabold text-[11px] text-center tracking-tight text-text group-hover:text-primary transition-colors truncate w-full">
                    {char.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
