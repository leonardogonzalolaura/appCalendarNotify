import React from 'react';
import {
    Calendar as CalendarIcon,
    Settings as SettingsIcon,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ user, activeTab, onTabChange, onLogout, collapsed, onToggleCollapse }) => {
    const SidebarLink = ({ icon, label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all
                ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-surface/50 text-muted'}
                ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? label : ''}
        >
            {React.cloneElement(icon, { size: 24 })}
            {!collapsed && <span className="font-bold hidden md:block">{label}</span>}
        </button>
    );

    const currentYear = new Date().getFullYear();

    return (
        <aside
            className={`
                border-r border-border bg-surface flex flex-col z-40 transition-all duration-300
                sticky top-0 h-screen
                ${collapsed ? 'w-16' : 'w-16 md:w-64'}
            `}
        >
            <div className="flex items-center justify-between p-2 md:p-4 mb-6">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 px-2"
                    >
                        <span className="text-xl font-black tracking-tight italic text-text hidden md:block">
                            AgendaPro
                        </span>
                    </motion.div>
                )}

                <button
                    onClick={onToggleCollapse}
                    className="p-2 rounded-lg hover:bg-surface/50 transition-colors ml-auto"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 space-y-2 px-2">
                <SidebarLink
                    icon={<CalendarIcon />}
                    label="Calendario"
                    active={activeTab === 'calendar'}
                    onClick={() => onTabChange('calendar')}
                />
                <SidebarLink
                    icon={<SettingsIcon />}
                    label="Ajustes"
                    active={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                />
            </nav>

            <div className="mt-auto border-t border-border p-2 space-y-2">
                <div className={`flex items-center gap-3 p-2 rounded-xl bg-background/30 border border-border/30 transition-all ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                            <img
                                src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&bold=true`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {!collapsed && (
                            <div className="hidden md:block overflow-hidden min-w-0">
                                <p className="font-bold truncate text-xs text-text">{user.name}</p>
                                <p className="text-[10px] text-muted truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                    
                    {!collapsed && (
                        <button
                            onClick={onLogout}
                            className="p-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-lg transition-all flex items-center justify-center flex-shrink-0"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>

                {collapsed && (
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;