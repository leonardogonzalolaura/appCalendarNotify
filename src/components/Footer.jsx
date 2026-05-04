import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="w-full mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted text-center flex items-center justify-center gap-1">
                © {currentYear} AgendaPro - Hecho con
                <Heart size={12} className="text-red-500 fill-red-500" />
                para ser productivo
            </p>
        </div>
    );
};

export default Footer;