import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Dynamic Character Loader
const characterImages = import.meta.glob('../assets/img/*.{png,jpg,jpeg,svg}', { eager: true });
const dynamicCharacters = Object.entries(characterImages).map(([path, module]) => {
  const fileName = path.split('/').pop();
  const id = fileName.split('.')[0];
  // Format name: "mario001" -> "Mario", "hello-kitty" -> "Hello Kitty"
  const name = id
    .replace(/[0-9]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
    
  return {
    id,
    name: name || id,
    img: module.default
  };
});

// Add default alert icon
const charactersList = [
  ...dynamicCharacters,
  { id: 'default', name: 'Alerta', img: 'https://img.icons8.com/fluency/96/appointment-reminders.png' }
];

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
      
      // Extract RGB for transparent effects
      const hex = settings.primaryColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }
  }, [settings]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addActivity = (activity) => {
    setActivities(prev => [...prev, { 
      id: activity.id || crypto.randomUUID(), 
      status: 'pending',
      ...activity 
    }]);
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
      settings, updateSettings,
      characters: charactersList
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
