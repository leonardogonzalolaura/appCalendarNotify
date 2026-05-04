import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ onToggleMode }) => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión con Google');
    }
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
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 z-10" />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="input-with-icon w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="size-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <LogIn size={20} />
          )}
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="px-4 text-xs text-muted bg-white relative">O continúa con</span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Error en la autenticación de Google')}
            useOneTap
            theme="outline"
            size="large"
            width="100%"
          />
        </div>
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
