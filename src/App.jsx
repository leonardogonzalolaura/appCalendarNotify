import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Calendar from './components/Calendar/Calendar';
import ActivityModal from './components/ActivityModal/ActivityModal';
import NotificationManager from './components/NotificationManager';
import BlockingPopup from './components/BlockingPopup';
import Settings from './components/Settings';
import FloatingActionButton from './components/FloatingActionButton';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, loading, logout } = useAuth();
  const { addActivity } = useApp();
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background">
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
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {activeTab === 'calendar' ? 'Mi Calendario' : 'Configuración'}
              </h1>
              <p className="text-xs text-muted hidden md:block mt-0.5">
                {activeTab === 'calendar' ? 'Gestiona tus actividades diarias' : 'Personaliza tu experiencia'}
              </p>
            </div>

            {activeTab === 'calendar' && (
              <button
                onClick={() => handleDayClick(new Date())}
                className="md:hidden btn-primary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <Plus size={18} />
                <span>Nueva</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 md:p-8 custom-scrollbar">
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

      {activeTab === 'calendar' && <FloatingActionButton onClick={() => handleDayClick(new Date())} />}

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

export default App;