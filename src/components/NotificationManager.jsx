import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { isPast, parseISO } from 'date-fns';

const NotificationManager = () => {
  const { activities, settings, updateSettings, characters, updateActivity } = useApp();
  const lastNotificationTime = useRef(new Map()); // Registro de última alerta (banner/modal unificados)

  // Función para evaluar el cooldown unificado de 1 minuto por actividad
  const shouldNotifyActivity = (activityId) => {
    const lastShown = lastNotificationTime.current.get(activityId);
    if (!lastShown) return true;
    
    const cooldownMinutes = 1;
    const minutesSinceLast = (Date.now() - lastShown) / 1000 / 60;
    
    return minutesSinceLast >= cooldownMinutes;
  };

  // Función nativa para notificaciones del sistema (barra de tareas)
  const showSystemNotification = (activity) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      console.log("Notificaciones del sistema no soportadas o permitidas");
      return;
    }

    try {
      const charId = activity.characterId || activity.character_id || settings.popupCharacter || 'hellokitty';
      const char = characters.find(c => c.id === charId) || characters[0];
      
      // Omitimos la propiedad 'tag' estática para forzar al S.O. a tratar cada alerta
      // como una notificación totalmente NUEVA y volver a sonar en la barra de tareas.
      const notification = new Notification(activity.title, {
        body: activity.description || "Es momento de cumplir con tu tarea.",
        icon: char?.img || 'https://img.icons8.com/fluency/96/appointment-reminders.png',
        requireInteraction: true // Mantener visible hasta interacción del usuario
      });

      notification.onclick = () => {
        window.focus();
        if (!settings.showNotification) {
          updateSettings({
            showNotification: true,
            currentNotification: activity
          });
        }
      };
    } catch (err) {
      console.error("Error al crear notificación de sistema:", err);
    }
  };

  // Modificar el useEffect principal
  useEffect(() => {
    const checkNotifications = () => {
      activities.forEach(activity => {
        if (activity.status === 'completed' || activity.status === 'missed') {
          lastNotificationTime.current.delete(activity.id);
          return;
        }
        
        let shouldNotify = false;
        
        if (activity.status === 'pending') {
          const activityTime = parseISO(activity.date);
          shouldNotify = isPast(activityTime);
        }
        
        if (shouldNotify) {
          const reminders = activity.remindersLeft !== undefined ? activity.remindersLeft : (activity.notifyCount || 3);
          
          if (reminders <= 0) {
            console.log(`Se agotaron los avisos para la actividad: ${activity.title}. Marcando como omitida (missed).`);
            updateActivity(activity.id, { status: 'missed' });
            return;
          }

          // Evaluar cooldown unificado
          if (shouldNotifyActivity(activity.id)) {
            console.log(`Notificando actividad: ${activity.title}. Avisos restantes: ${reminders}`);
            
            // Establecer el timestamp de cooldown
            lastNotificationTime.current.set(activity.id, Date.now());

            // 1. Mostrar banner en la barra de tareas
            showSystemNotification(activity);
            
            // 2. Mostrar modal interactivo si no está abierto
            if (!settings.showNotification) {
              updateSettings({ 
                showNotification: true, 
                currentNotification: activity 
              });
            }

            // 3. Decrementar avisos restantes y actualizar base de datos
            const newRemindersLeft = reminders - 1;
            console.log(`Aviso registrado en base de datos. Restantes para ${activity.title}: ${newRemindersLeft}`);
            updateActivity(activity.id, { remindersLeft: newRemindersLeft });
          }
        }
      });
    };

    // Ejecutar inmediatamente al montar
    checkNotifications();

    // Configurar intervalo de comprobación cada 30 segundos
    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, [activities, settings.showNotification, updateSettings, characters]);

  // Reset notification timer when modal is closed (user postponed or completed)
  // This is handled automatically by the cooldown system
  useEffect(() => {
    // When modal closes (settings.showNotification becomes false)
    if (!settings.showNotification && settings.currentNotification) {
      console.log("Modal closed, system notifications will continue with cooldown");
    }
  }, [settings.showNotification, settings.currentNotification]);

  return null;
};

export default NotificationManager;