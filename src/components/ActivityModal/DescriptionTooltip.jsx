import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DescriptionTooltip = ({ description, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const targetRef = useRef(null);
    const timeoutRef = useRef(null);

    const showTooltipWithPosition = () => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top - 10,
                left: rect.left + rect.width / 2
            });
            timeoutRef.current = setTimeout(() => setShowTooltip(true), 300);
        }
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowTooltip(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!description || description.length <= 50) {
        return <>{children}</>;
    }

    return (
        <>
            <div
                ref={targetRef}
                onMouseEnter={showTooltipWithPosition}
                onMouseLeave={hideTooltip}
                className="cursor-help"
            >
                {children}
            </div>

            <AnimatePresence>
                {showTooltip && createPortal(
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-[200]"
                        style={{
                            top: position.top - 5,
                            left: position.left,
                            transform: 'translateX(-50%) translateY(-100%)'
                        }}
                    >
                        <div className="bg-surface border border-border rounded-xl shadow-2xl p-3 max-w-xs">
                            <div className="text-xs text-text">
                                <p className="font-bold mb-1 text-primary text-xs">Descripción:</p>
                                <p className="whitespace-pre-wrap break-words">{description}</p>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-surface border-r border-b border-border rotate-45" />
                        </div>
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>
        </>
    );
};

export default DescriptionTooltip;