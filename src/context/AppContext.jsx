import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

// Dynamic Character Loader
const characterImages = import.meta.glob('../assets/img/*.{png,jpg,jpeg,svg}', { eager: true });
const dynamicCharacters = Object.entries(characterImages).map(([path, module]) => {
  const fileName = path.split('/').pop();
  const id = fileName.split('.')[0];
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

const charactersList = [
  ...dynamicCharacters,
  { id: 'default', name: 'Alerta', img: 'https://img.icons8.com/fluency/96/appointment-reminders.png' }
];

export const AppProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activities, setActivities] = useState([]);
  const [settings, setSettings] = useState({
    logo: null,
    primaryColor: '#f787bf',
    calendarColor: '#f787bf',
    popupCharacter: 'hellokitty',
    showNotification: false,
    currentNotification: null
  });

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [activitiesData, settingsData] = await Promise.all([
            api.getActivities(),
            api.getSettings()
          ]);
          const normalized = (Array.isArray(activitiesData) ? activitiesData : []).map(act => ({
            ...act,
            notifyCount: act.notify_count !== undefined ? act.notify_count : (act.notifyCount || 3),
            remindersLeft: act.reminders_left !== undefined ? act.reminders_left : (act.remindersLeft !== undefined ? act.remindersLeft : 3),
            characterId: act.character_id || act.characterId || 'hellokitty'
          }));
          setActivities(normalized);
          if (settingsData && settingsData.user_id) {
            setSettings(prev => ({ 
              ...prev, 
              ...settingsData, 
              showNotification: false, // Forzar a false al iniciar/cargar para evitar bloqueos persistentes
              currentNotification: null // Asegurar que inicie limpio
            }));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          if (error.message === 'Session expired') {
            logout();
          }
        }
      };
      fetchData();
    } else {
      setActivities([]);
    }
  }, [user, logout]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      const hex = settings.primaryColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }
  }, [settings.primaryColor]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addActivity = async (activity) => {
    const newActivity = { 
      id: activity.id || crypto.randomUUID(), 
      status: 'pending',
      ...activity 
    };
    setActivities(prev => [...prev, newActivity]);
    if (user) {
      await api.createActivity(newActivity);
    }
  };

  const updateActivity = async (id, updates) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    if (user) {
      const activity = activities.find(a => a.id === id);
      await api.updateActivity(id, { ...activity, ...updates });
    }
  };

  const deleteActivity = async (id) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    if (user) {
      await api.deleteActivity(id);
    }
  };

  const postponeActivity = async (id, minutes) => {
    const newDate = new Date();
    newDate.setMinutes(newDate.getMinutes() + minutes);
    const activity = activities.find(a => a.id === id);
    const originalNotifyCount = activity ? (activity.notifyCount || activity.notify_count || 3) : 3;
    const updates = { 
      date: newDate.toISOString(), 
      status: 'pending',
      remindersLeft: originalNotifyCount
    };
    
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    
    if (user) {
      await api.updateActivity(id, { ...activity, ...updates });
    }
  };

  const updateSettings = async (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (user) {
      await api.updateSettings({ ...settings, ...newSettings });
    }
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
