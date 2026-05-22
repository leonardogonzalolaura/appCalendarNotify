import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { isPast, parseISO } from 'date-fns';

const NotificationManager = () => {
  const { activities, settings, updateSettings, characters } = useApp();
  const lastSystemNotification = useRef(new Map()); // Track last system notification per activity

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Function to show system notification (banner)
  const showSystemNotification = (activity) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log("Notification permission not granted");
      return;
    }
    
    try {
      const char = characters.find(c => c.id === activity.characterId) || characters[0];
      
      const notification = new Notification(`¡AgendaPro: ${activity.title}!`, {
        body: activity.description || "Haz clic para ver detalles o posponer.",
        icon: char?.img,
        tag: activity.id.toString(),
        requireInteraction: true,
        silent: false
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        // Open the modal if it's not already open
        if (!settings.showNotification) {
          updateSettings({ 
            showNotification: true, 
            currentNotification: activity 
          });
        }
      };
      
      notification.onclose = () => {
        console.log(`System notification closed for: ${activity.title}`);
        // Don't do anything here - the cooldown will handle reappearance
      };
      
    } catch (err) {
      console.error("Error showing system notification:", err);
    }
  };

  // Check if we should show system notification based on cooldown
  const shouldShowSystemNotification = (activityId) => {
    const lastShown = lastSystemNotification.current.get(activityId);
    if (!lastShown) return true;
    
    // 1 minutes cooldown (same as modal's minimum postpone)
    const cooldownMinutes = 1;
    const minutesSinceLast = (Date.now() - lastShown) / 1000 / 60;
    
    return minutesSinceLast >= cooldownMinutes;
  };

  useEffect(() => {
    // Check every 30 seconds (good balance between performance and responsiveness)
    const interval = setInterval(() => {
      const now = new Date();
      
      activities.forEach(activity => {
        // Skip completed activities
        if (activity.status === 'completed') {
          // Clean up map for completed activities
          if (lastSystemNotification.current.has(activity.id)) {
            lastSystemNotification.current.delete(activity.id);
          }
          return;
        }
        
        let shouldNotify = false;
        let notifyTime = null;
        
        // Check if activity needs notification based on its status
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
          // Check cooldown to avoid spam
          if (shouldShowSystemNotification(activity.id)) {
            console.log(`Showing system notification for: ${activity.title} (Status: ${activity.status})`);
            
            // Update last notification time
            lastSystemNotification.current.set(activity.id, Date.now());
            
            // Show system banner notification
            showSystemNotification(activity);
            
            // Also show the modal if not already showing
            // This ensures the user gets both the banner and the blocking modal
            if (!settings.showNotification) {
              console.log("Also opening blocking modal");
              updateSettings({ 
                showNotification: true, 
                currentNotification: activity 
              });
            }
          } else {
            const lastShown = lastSystemNotification.current.get(activity.id);
            const minutesLeft = Math.round((5 - ((Date.now() - lastShown) / 1000 / 60)) * 10) / 10;
            if (minutesLeft > 0) {
              console.log(`System notification cooldown for ${activity.title}: ${minutesLeft} minutes remaining`);
            }
          }
        }
      });
    }, 30000); // Check every 30 seconds

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