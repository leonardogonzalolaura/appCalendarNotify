import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const CharacterDropdown = ({ isOpen, position, characters, selectedChar, onSelect, onClose }) => {
    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                id="character-dropdown"
                initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
                transition={{ duration: 0.15 }}
                className="fixed z-[100] bg-surface border border-border rounded-2xl shadow-2xl overflow-y-auto custom-scrollbar"
                style={{
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    maxHeight: '300px',
                    transformOrigin: 'top'
                }}
            >
                <div className="p-2">
                    <p className="text-[10px] font-bold text-muted px-3 py-2 uppercase tracking-widest border-b border-border mb-1 sticky top-0 bg-surface">
                        Elige un personaje
                    </p>
                    {characters.map(char => (
                        <button
                            key={char.id}
                            type="button"
                            onClick={() => {
                                onSelect(char.id);
                                onClose();
                            }}
                            className={`
                flex items-center gap-4 p-3 rounded-xl border transition-all w-full mb-1
                ${selectedChar === char.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-transparent hover:bg-background hover:border-border'
                                }
              `}
                        >
                            <img src={char.img} alt={char.name} className="size-10 object-contain" />
                            <div className="text-left flex-1">
                                <span className="text-sm font-bold block">{char.name}</span>
                                <span className="text-[10px] text-muted capitalize">{char.id.replace(/[0-9]/g, '')}</span>
                            </div>
                            {selectedChar === char.id && (
                                <div className="size-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default CharacterDropdown;