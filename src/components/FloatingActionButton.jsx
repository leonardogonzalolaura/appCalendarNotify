import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingActionButton = ({ onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 right-8 md:flex hidden items-center justify-center size-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-2xl shadow-primary/50 hover:shadow-xl hover:scale-105 transition-all z-50"
        >
            <Plus size={28} />
        </motion.button>
    );
};

export default FloatingActionButton;