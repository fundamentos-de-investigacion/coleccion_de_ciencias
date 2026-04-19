import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
import { motion } from 'framer-motion';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Beaker, 
  ChevronRight, 
  AlertCircle,
  Dna,
  Leaf
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(33, 150, 243, 0.05) 0%, transparent 40%)',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Figures */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1, color: 'var(--primary)' }}
      >
        <Dna size={400} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', bottom: '5%', left: '2%', opacity: 0.1, color: 'var(--primary)' }}
      >
        <Leaf size={250} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          width: '100%', 
          maxWidth: '450px',
          zIndex: 10
        }}
      >
        <div className="sci-card glass" style={{ padding: '50px 40px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ 
            backgroundColor: 'var(--primary)', 
            width: '70px', 
            height: '70px', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 25px',
            color: 'white',
            boxShadow: '0 10px 20px rgba(76, 175, 80, 0.3)'
          }}>
            <Beaker size={35} />
          </div>

          <h1 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '10px' }}>Bienvenido</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '0.95rem' }}>
            Accede al sistema de gestión de biodiversidad
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="Correo institucional" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 45px', 
                  borderRadius: 'var(--radius-md)',
                  height: '50px'
                }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 45px', 
                  borderRadius: 'var(--radius-md)',
                  height: '50px'
                }} 
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ 
                  color: 'var(--error)', 
                  backgroundColor: '#fee2e2', 
                  padding: '10px', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                height: '50px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '10px',
                boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Validando...' : (
                <>
                  Iniciar Sesión <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '30px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ¿No tienes cuenta? Contacta al administrador científico.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Sistema de Colecciones Biológicas • v1.0.0
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
