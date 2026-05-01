import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { isPast, parseISO } from 'date-fns';

const NotificationManager = () => {
  const { activities, updateActivity, settings, updateSettings, characters } = useApp();

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
          
          // DIAGNOSTIC LOG (You can see this in browser console)
          // console.log(`Checking: ${activity.title} | Time: ${activityTime.toLocaleTimeString()} | Now: ${now.toLocaleTimeString()} | Past? ${isPast(activityTime)}`);

          // If the time has arrived and we are not already showing a notification
          if (isPast(activityTime) && !settings.showNotification) {
            console.log("TRIGGERING NOTIFICATION FOR:", activity.title);
            
            // 1. Show the internal blocking UI
            updateSettings({ 
              showNotification: true, 
              currentNotification: activity 
            });

            // 2. Show System Notification (Banner)
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                const char = characters.find(c => c.id === activity.characterId) || characters[0];

                new Notification(`¡AgendaPro: ${activity.title}!`, {
                  body: "Haz clic para ver detalles.",
                  icon: char.img,
                  tag: activity.id.toString(), 
                  requireInteraction: true
                }).onclick = () => { window.focus(); };
              } catch (err) {
                console.error("Error showing notification:", err);
              }
            }
          }
        }
      });
    }, 2000); // Check more frequently (every 2s)

    return () => clearInterval(interval);
  }, [activities, settings.showNotification]);

  return null;
};

export default NotificationManager;
