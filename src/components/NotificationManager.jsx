import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { isPast, parseISO } from 'date-fns';

const NotificationManager = () => {
  const { activities, settings, updateSettings, characters } = useApp();
  const lastSystemNotification = useRef(new Map()); // Para banner
  const lastModalNotification = useRef(new Map()); // Para modal - NUEVO

  // Modificar shouldShowSystemNotification para banner SOLO
  const shouldShowSystemNotification = (activityId) => {
    const lastShown = lastSystemNotification.current.get(activityId);
    if (!lastShown) return true;
    
    const cooldownMinutes = 1;
    const minutesSinceLast = (Date.now() - lastShown) / 1000 / 60;
    
    return minutesSinceLast >= cooldownMinutes;
  };

  // NUEVA función para modal
  const shouldShowModalNotification = (activityId) => {
    const lastShown = lastModalNotification.current.get(activityId);
    if (!lastShown) return true;
    
    const cooldownMinutes = 1;
    const minutesSinceLast = (Date.now() - lastShown) / 1000 / 60;
    
    return minutesSinceLast >= cooldownMinutes;
  };

  // Modificar el useEffect principal
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      activities.forEach(activity => {
        if (activity.status === 'completed') {
          lastSystemNotification.current.delete(activity.id);
          lastModalNotification.current.delete(activity.id); // También limpiar modal
          return;
        }
        
        let shouldNotify = false;
        let notifyTime = null;
        
        if (activity.status === 'pending') {
          const activityTime = parseISO(activity.date);
          shouldNotify = isPast(activityTime);
          notifyTime = activityTime;
        } 
        else if (activity.status === 'postponed' && activity.postponedUntil) {
          const postponedUntil = parseISO(activity.postponedUntil);
          shouldNotify = isPast(postponedUntil);
          notifyTime = postponedUntil;
        }
        
        if (shouldNotify) {
          // ✅ BANNER: usa su propio cooldown
          if (shouldShowSystemNotification(activity.id)) {
            console.log(`Showing system notification for: ${activity.title}`);
            lastSystemNotification.current.set(activity.id, Date.now());
            showSystemNotification(activity);
          }
          
          // ✅ MODAL: usa su propio cooldown separado
          if (!settings.showNotification && shouldShowModalNotification(activity.id)) {
            console.log("Also opening blocking modal");
            lastModalNotification.current.set(activity.id, Date.now());
            updateSettings({ 
              showNotification: true, 
              currentNotification: activity 
            });
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [activities, settings.showNotification, updateSettings, characters]);

  // Reset notification timer when modal is closed (user postponed or completed)
  // This is handled automatically by the cooldown system
  useEffect(() => {
    // When modal closes (settings.showNotification becomes false)
    if (!settings.showNotification && settings.currentNotification) {
      // The cooldown will handle when to show the next notification
      // No need to reset anything here - we want to respect the cooldown
      console.log("Modal closed, system notifications will continue with cooldown");
    }
  }, [settings.showNotification, settings.currentNotification]);

  return null;
};

export default NotificationManager;