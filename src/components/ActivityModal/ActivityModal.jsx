import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, List, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp } from '../../context/AppContext';
import ActivityList from './ActivityList';
import ActivityForm from './ActivityForm';
import ActivityDetailModal from './ActivityDetailModal';
import CharacterDropdown from './CharacterDropdown';

const ActivityModal = ({ isOpen, onClose, selectedDate, onSave }) => {
    const { activities, deleteActivity, updateActivity, settings, characters } = useApp();
    const [view, setView] = useState('list');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('09:00');
    const [notifyCount, setNotifyCount] = useState(3);
    const [selectedChar, setSelectedChar] = useState(settings.popupCharacter || 'hellokitty');
    const [isCharPickerOpen, setIsCharPickerOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingActivityId, setEditingActivityId] = useState(null);

    const charButtonRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (isCharPickerOpen && charButtonRef.current) {
            const rect = charButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isCharPickerOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCharPickerOpen && charButtonRef.current && !charButtonRef.current.contains(event.target)) {
                const dropdown = document.getElementById('character-dropdown');
                if (dropdown && !dropdown.contains(event.target)) {
                    setIsCharPickerOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCharPickerOpen]);

    useEffect(() => {
        if (isOpen) {
            setView('list');
            setTitle('');
            setDescription('');
            setTime('09:00');
            setNotifyCount(3);
            setSelectedChar(settings?.popupCharacter || 'hellokitty');
            setEditingActivityId(null);
        }
    }, [isOpen, selectedDate, settings?.popupCharacter]);

    const dayActivities = activities.filter(a => isSameDay(new Date(a.date), selectedDate));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [hours, minutes] = time.split(':');
        const activityDate = new Date(selectedDate);
        activityDate.setHours(parseInt(hours), parseInt(minutes), 0);

        const activityData = {
            title,
            description,
            date: activityDate.toISOString(),
            notifyCount,
            characterId: selectedChar,
            character_id: selectedChar,
            remindersLeft: notifyCount,
            status: 'pending'
        };

        if (editingActivityId) {
            await updateActivity(editingActivityId, activityData);
        } else {
            await onSave({
                id: crypto.randomUUID(),
                ...activityData
            });
        }

        setTitle('');
        setDescription('');
        setEditingActivityId(null);
        setView('list');
    };

    const handleEdit = (activity) => {
        setEditingActivityId(activity.id);
        setTitle(activity.title);
        setDescription(activity.description || '');
        
        const dateObj = new Date(activity.date);
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        setTime(`${hours}:${minutes}`);
        
        setNotifyCount(activity.notifyCount || 3);
        setSelectedChar(activity.characterId || activity.character_id || settings.popupCharacter || 'hellokitty');
        setView('edit');
    };

    const handleViewDetail = (activity) => {
        setSelectedActivity(activity);
        setShowDetailModal(true);
    };

    const handleDeleteActivity = (id) => {
        deleteActivity(id);
    };

    if (!isOpen) return null;

    return (
        <>
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card w-full max-w-lg p-4 md:p-8 relative flex flex-col max-h-[90vh] shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-surface rounded-full transition-colors text-muted z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-4 md:mb-6 flex-shrink-0">
                            <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
                                {view === 'list' ? (
                                    <List className="text-primary" />
                                ) : view === 'edit' ? (
                                    <Pencil className="text-primary" />
                                ) : (
                                    <Plus className="text-primary" />
                                )}
                                {view === 'list' ? 'Actividades del Día' : view === 'edit' ? 'Editar Actividad' : 'Nueva Actividad'}
                            </h2>
                            <p className="text-muted capitalize">
                                {format(selectedDate, "eeee d 'de' MMMM", { locale: es })}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                            {view === 'list' ? (
                                <ActivityList
                                    activities={dayActivities}
                                    onDelete={handleDeleteActivity}
                                    onViewDetail={handleViewDetail}
                                    onEdit={handleEdit}
                                    calendarColor={settings?.calendarColor}
                                />
                            ) : (
                                <ActivityForm
                                    title={title}
                                    setTitle={setTitle}
                                    description={description}
                                    setDescription={setDescription}
                                    time={time}
                                    setTime={setTime}
                                    notifyCount={notifyCount}
                                    setNotifyCount={setNotifyCount}
                                    selectedChar={selectedChar}
                                    characters={characters}
                                    charButtonRef={charButtonRef}
                                    isCharPickerOpen={isCharPickerOpen}
                                    setIsCharPickerOpen={setIsCharPickerOpen}
                                    onSubmit={handleSubmit}
                                    onCancel={() => setView('list')}
                                />
                            )}
                        </div>

                        {view === 'list' && (
                            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border flex-shrink-0">
                                <button
                                    onClick={() => {
                                        setEditingActivityId(null);
                                        setTitle('');
                                        setDescription('');
                                        setTime('09:00');
                                        setNotifyCount(3);
                                        setSelectedChar(settings.popupCharacter || 'hellokitty');
                                        setView('add');
                                    }}
                                    className="w-full btn-primary flex items-center justify-center gap-2 py-3 md:py-4 text-sm font-bold"
                                >
                                    <Plus size={20} />
                                    <span className="hidden sm:inline">Agregar Nueva </span>Actividad
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </AnimatePresence>

            <CharacterDropdown
                isOpen={isCharPickerOpen}
                position={dropdownPosition}
                characters={characters}
                selectedChar={selectedChar}
                onSelect={setSelectedChar}
                onClose={() => setIsCharPickerOpen(false)}
            />

            <ActivityDetailModal
                activity={selectedActivity}
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
            />
        </>
    );
};

export default ActivityModal;