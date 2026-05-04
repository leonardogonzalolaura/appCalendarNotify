import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = ({ onToggleMode }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    const result = await signup({ 
      name: formData.name, 
      email: formData.email, 
      password: formData.password 
    });
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Error al registrarse');
    }
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

      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg flex items-center gap-2 text-sm font-medium"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 z-10" />
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full rounded-xl border-2 border-border bg-background focus:border-primary transition-all"
            style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 z-10" />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full rounded-xl border-2 border-border bg-background focus:border-primary transition-all"
            style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 z-10" />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-xl border-2 border-border bg-background focus:border-primary transition-all"
            style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 z-10" />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full rounded-xl border-2 border-border bg-background focus:border-primary transition-all"
            style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="size-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <UserPlus size={20} />
          )}
          Registrarse
        </button>
      </form>
    </motion.div>
  );
};

export default Signup;