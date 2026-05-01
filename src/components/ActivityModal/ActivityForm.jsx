import React from 'react';
import { Type, List, Clock, Bell, ChevronDown, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityForm = ({
    title, setTitle,
    description, setDescription,
    time, setTime,
    notifyCount, setNotifyCount,
    selectedChar, characters,
    charButtonRef, isCharPickerOpen, setIsCharPickerOpen,
    onSubmit, onCancel
}) => {
    const selectedCharacter = characters.find(c => c.id === selectedChar) || characters[0];

    return (
        <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={onSubmit}
            className="space-y-4 pt-2"
        >
            <div className="space-y-2">
                <label className="text-xs font-bold flex items-center gap-2 text-muted uppercase tracking-wider">
                    <Type size={14} /> Título de la Tarea
                </label>
                <input
                    type="text"
                    placeholder="Ej: Reunión de trabajo"
                    className="w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold flex items-center gap-2 text-muted uppercase tracking-wider">
                    <List size={14} /> Descripción (opcional)
                </label>
                <textarea
                    placeholder="Añade más detalles sobre esta actividad..."
                    className="w-full min-h-[80px] p-4 rounded-xl border-2 border-border bg-background focus:border-primary transition-all resize-none text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold flex items-center gap-2 text-muted uppercase tracking-wider">
                        <Clock size={14} /> Hora
                    </label>
                    <input
                        type="time"
                        className="w-full"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold flex items-center gap-2 text-muted uppercase tracking-wider">
                        <Bell size={14} /> Avisos
                    </label>
                    <select
                        className="w-full"
                        value={notifyCount}
                        onChange={(e) => setNotifyCount(parseInt(e.target.value))}
                    >
                        <option value={1}>1 vez</option>
                        <option value={3}>3 veces</option>
                        <option value={5}>5 veces</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Personaje de Notificación</label>
                <div className="relative">
                    <button
                        ref={charButtonRef}
                        type="button"
                        onClick={() => setIsCharPickerOpen(!isCharPickerOpen)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-border bg-surface hover:border-primary/30 transition-all shadow-sm group"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={selectedCharacter.img}
                                className="size-8 object-contain"
                                alt="selected"
                            />
                            <span className="font-bold text-sm">
                                {selectedCharacter.name}
                            </span>
                        </div>
                        <ChevronDown size={18} className={`text-muted transition-transform duration-200 ${isCharPickerOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="flex gap-3 pt-4 mt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 p-3 border border-border rounded-xl hover:bg-surface transition-colors text-sm font-bold"
                >
                    Volver
                </button>
                <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm font-bold"
                >
                    <Save size={18} />
                    Guardar
                </button>
            </div>
        </motion.form>
    );
};

export default ActivityForm;