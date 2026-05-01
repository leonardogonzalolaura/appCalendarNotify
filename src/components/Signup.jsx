import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = ({ onToggleMode }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    signup({ name: formData.name, email: formData.email });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-8 w-full max-w-md mx-auto"
    >
      <div className="mb-8">
        <button onClick={onToggleMode} className="text-muted flex items-center gap-1 hover:text-primary mb-4 transition-colors">
          <ArrowLeft size={18} />
          Volver al login
        </button>
        <h1 className="text-3xl font-bold mb-2">Crea tu cuenta</h1>
        <p className="text-muted">Únete a la mejor experiencia de gestión</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5" />
          <input 
            type="text" 
            placeholder="Nombre completo" 
            className="w-full pl-10"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5" />
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="w-full pl-10"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5" />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full pl-10"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5" />
          <input 
            type="password" 
            placeholder="Confirmar contraseña" 
            className="w-full pl-10"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
          <UserPlus size={20} />
          Registrarse
        </button>
      </form>
    </motion.div>
  );
};

export default Signup;
