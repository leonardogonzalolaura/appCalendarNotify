import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activities, setActivities] = useState(JSON.parse(localStorage.getItem('activities')) || []);
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {
    logo: null,
    primaryColor: '#6366f1',
    calendarColor: '#6366f1',
    popupCharacter: 'hellokitty', // 'hellokitty' or 'default'
    showNotification: false,
    currentNotification: null
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
    }
  }, [settings]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addActivity = (activity) => {
    setActivities(prev => [...prev, { ...activity, id: Date.now(), status: 'pending' }]);
  };

  const updateActivity = (id, updates) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteActivity = (id) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const postponeActivity = (id, minutes) => {
    setActivities(prev => prev.map(a => {
      if (a.id === id) {
        const newDate = new Date();
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return { ...a, date: newDate.toISOString(), status: 'pending' };
      }
      return a;
    }));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{ 
      theme, toggleTheme, 
      activities, addActivity, updateActivity, deleteActivity, postponeActivity,
      settings, updateSettings 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
