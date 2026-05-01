import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { isPast, parseISO } from 'date-fns';

const NotificationManager = () => {
  const { activities, updateActivity, settings, updateSettings } = useApp();

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      activities.forEach(activity => {
        if (activity.status === 'pending') {
          const activityTime = parseISO(activity.date);
          
          // If the time has arrived
          if (isPast(activityTime) && !settings.showNotification) {
            
            // 1. Show the internal blocking UI
            updateSettings({ 
              showNotification: true, 
              currentNotification: activity 
            });

            // 2. Show System Notification (Banner)
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                const notification = new Notification(`¡AgendaPro: ${activity.title}!`, {
                  body: "Haz clic para ver detalles, marcar como hecha o posponer (5m, 15m, 30m o tiempo personalizado).",
                  icon: settings.popupCharacter === 'hellokitty' 
                    ? 'https://img.icons8.com/color/96/hello-kitty.png' 
                    : 'https://img.icons8.com/fluency/96/appointment-reminders.png',
                  tag: activity.id.toString(), // Ensures only one notification per activity ID
                  requireInteraction: true
                });

                notification.onclick = () => {
                  window.focus();
                  notification.close();
                };
              } catch (err) {
                console.error("Error showing notification:", err);
              }
            }
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activities, settings.showNotification, settings.popupCharacter]);

  return null;
};

export default NotificationManager;
