import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Calendar from './components/Calendar';
import ActivityModal from './components/ActivityModal';
import NotificationManager from './components/NotificationManager';
import BlockingPopup from './components/BlockingPopup';
import Settings from './components/Settings';
import { 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  User, 
  Plus, 
  LayoutDashboard,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, loading, logout } = useAuth();
  const { activities, addActivity } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'settings', 'dashboard'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="size-12 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] size-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="z-10 w-full">
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

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-border bg-surface flex flex-col p-4 z-40">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
            A
          </div>
          <span className="text-xl font-black hidden md:block tracking-tight italic">AgendaPro</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink 
            icon={<CalendarIcon />} 
            label="Calendario" 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
          />
          <SidebarLink 
            icon={<SettingsIcon />} 
            label="Ajustes" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="mt-auto border-t border-border pt-4 space-y-4">
          <div className="flex items-center gap-3 px-2 py-3">
             <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                <img src={user.photo || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} />
             </div>
             <div className="hidden md:block overflow-hidden">
                <p className="font-bold truncate text-sm">{user.name}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold"
          >
            <LogOut size={20} />
            <span className="hidden md:block">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-surface/50 backdrop-blur-md">
           <h1 className="text-xl font-bold">
            {activeTab === 'calendar' ? 'Mi Calendario' : 'Configuración del Sistema'}
           </h1>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => handleDayClick(new Date())}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:block">Nueva Actividad</span>
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'calendar' ? (
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

      {/* Overlays */}
      <NotificationManager />
      <BlockingPopup />
      <ActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedDate={selectedDate}
        onSave={addActivity}
      />
    </div>
  );
}

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 p-3 rounded-xl transition-all
      ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-surface text-muted'}
    `}
  >
    {React.cloneElement(icon, { size: 24 })}
    <span className="font-bold hidden md:block">{label}</span>
  </button>
);

export default App;
