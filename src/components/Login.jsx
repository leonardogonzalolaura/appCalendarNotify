import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onToggleMode }) => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenido</h1>
        <p className="text-muted">Organiza tu día con estilo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 z-10" />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="input-with-icon w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 z-10" />
          <input
            type="password"
            placeholder="Contraseña"
            className="input-with-icon w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          <LogIn size={20} />
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-6">

          <span className="px-4 text-sm text-muted absolute">O continúa con</span>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 border border-border p-3 rounded-xl hover:bg-surface transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="size-5" />
          Google
        </button>
      </div>

      <p className="text-center mt-8 text-muted">
        ¿No tienes cuenta?{' '}
        <button onClick={onToggleMode} className="text-primary font-bold hover:underline">
          Regístrate aquí
        </button>
      </p>
    </motion.div>
  );
};

export default Login;
