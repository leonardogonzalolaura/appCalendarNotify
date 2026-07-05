import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Calendar from './components/Calendar/Calendar';
import ActivityModal from './components/ActivityModal/ActivityModal';
import NotificationManager from './components/NotificationManager';
import BlockingPopup from './components/BlockingPopup';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import FloatingActionButton from './components/FloatingActionButton';
import ToastContainer from './components/Toast';
import { Home, Calendar as CalendarIcon, Settings as SettingsIcon, LogOut, Palette, Sun, Moon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const colors = [
  { name: 'Indigo',   value: '#6366f1' },
  { name: 'Rose',     value: '#f43f5e' },
  { name: 'Emerald',  value: '#10b981' },
  { name: 'Amber',    value: '#f59e0b' },
  { name: 'Violet',   value: '#8b5cf6' },
  { name: 'Pink',     value: '#f787bf' },
  { name: 'Orange',   value: '#f97316' },
];

function App() {
  const { user, loading, logout } = useAuth();
  const { addActivity, settings, updateSettings, toggleTheme, theme } = useApp();
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showThemePicker, setShowThemePicker] = useState(false);
  const themeRef = useRef(null);

  const handleClickOutside = useCallback((e) => {
    if (themeRef.current && !themeRef.current.contains(e.target)) {
      setShowThemePicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  if (loading) return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '3rem', height: '3rem', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '9999px' }}
      />
    </div>
  );

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--background)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '24rem', height: '24rem', background: 'rgba(99,102,241,0.2)', borderRadius: '9999px', filter: 'blur(64px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '24rem', height: '24rem', background: 'rgba(236,72,153,0.2)', borderRadius: '9999px', filter: 'blur(64px)' }} />
        <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          {authMode === 'login' ? (
            <Login onToggleMode={() => setAuthMode('signup')} />
          ) : (
            <Signup onToggleMode={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const tabs = [
    { id: 'today', icon: Home, label: 'Hoy' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendario' },
    { id: 'settings', icon: SettingsIcon, label: 'Ajustes' },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--background)' }}>
      {/* ── Top Navigation ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--glass)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '72rem', margin: '0 auto', padding: '0.75rem 1rem' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div
              style={{
                width: '2rem', height: '2rem', borderRadius: '0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              }}
            >
              <CalendarIcon size={16} style={{ color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.025em', display: 'none' }} className="md:block">
              AgendaPro
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--background)', borderRadius: '1rem', padding: '0.25rem', border: '1px solid var(--border)' }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 0.875rem', borderRadius: '0.75rem',
                    fontSize: '0.8125rem', fontWeight: 700,
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    background: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    boxShadow: isActive ? '0 4px 6px -1px rgba(99,102,241,0.3)' : 'none',
                  }}
                >
                  <Icon size={16} />
                  <span style={{ display: 'none' }} className="sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right section: theme + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Theme/Color picker */}
            <div ref={themeRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--background)', border: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-muted)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--background)'; }}
                title="Personalizar"
              >
                <Palette size={16} />
              </button>

              {showThemePicker && (
                <div
                  style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                    width: '14rem', padding: '1rem', borderRadius: '1rem',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                    zIndex: 50,
                  }}
                >
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Color
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    {colors.map(c => {
                      const isSelected = settings.calendarColor === c.value;
                      return (
                        <button
                          key={c.value}
                          onClick={() => updateSettings({ calendarColor: c.value, primaryColor: c.value })}
                          style={{
                            width: '100%', aspectRatio: '1',
                            borderRadius: '9999px', border: '2px solid',
                            borderColor: isSelected ? 'var(--text)' : 'transparent',
                            background: c.value, cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          }}
                          title={c.name}
                        >
                          {isSelected && <Check size={12} style={{ color: 'white' }} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => { toggleTheme(); setShowThemePicker(false); }}
                      style={{
                        width: '100%', padding: '0.625rem', borderRadius: '0.75rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
                        background: 'var(--background)', border: '1px solid var(--border)',
                        color: 'var(--text)', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--background)'; }}
                    >
                      {theme === 'dark'
                        ? <Sun size={18} style={{ color: '#f59e0b' }} />
                        : <Moon size={18} />}
                      {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)' }}>
              <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '9999px', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                <img
                  src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&bold=true`}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'none' }} className="md:block">{user.name}</span>
              <button
                onClick={logout}
                style={{
                  padding: '0.25rem', marginLeft: '0.125rem', color: '#ef4444',
                  background: 'transparent', border: 'none', borderRadius: '0.5rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="flex-1 overflow-y-auto p-3 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'today' ? (
                <motion.div
                  key="today"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Dashboard user={user} onAddActivity={() => handleDayClick(new Date())} />
                </motion.div>
              ) : activeTab === 'calendar' ? (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Calendar onDayClick={handleDayClick} />
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Settings />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {activeTab === 'calendar' && <FloatingActionButton onClick={() => handleDayClick(new Date())} />}

      <NotificationManager />
      <BlockingPopup />
      <ToastContainer />
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={addActivity}
      />
    </div>
  );
}

export default App;
