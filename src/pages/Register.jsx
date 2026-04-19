import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabase';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User,
  Beaker, 
  ChevronRight, 
  AlertCircle,
  ShieldCheck,
  Globe
} from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          institution: institution,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase usually requires email confirmation by default.
      // We'll show a success message or redirect.
      alert('Registro exitoso. Por favor revisa tu correo para confirmar la cuenta.');
      navigate('/login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.05) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.05) 0%, transparent 40%)',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Figures */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', top: '10%', left: '-5%', opacity: 0.1, color: 'var(--secondary)' }}
      >
        <ShieldCheck size={350} />
      </motion.div>
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', bottom: '-10%', right: '5%', opacity: 0.1, color: 'var(--primary)' }}
      >
        <Globe size={300} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          width: '100%', 
          maxWidth: '480px',
          zIndex: 10
        }}
      >
        <div className="sci-card glass" style={{ padding: '40px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ 
            backgroundColor: 'var(--secondary)', 
            width: '60px', 
            height: '60px', 
            borderRadius: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)'
          }}>
            <UserPlus size={30} />
          </div>

          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '10px', textAlign: 'center' }}>Crear Cuenta Científica</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem', textAlign: 'center' }}>
            Únete a la red de investigadores de biodiversidad
          </p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Nombre completo" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 'var(--radius-md)', height: '48px' }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Beaker size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Institución científica / Herbario / Museo" 
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 'var(--radius-md)', height: '48px' }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="Correo institucional" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 'var(--radius-md)', height: '48px' }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Contraseña (mín. 6 caracteres)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 'var(--radius-md)', height: '48px' }} 
              />
            </div>

            {error && (
              <div style={{ color: 'var(--error)', backgroundColor: '#fee2e2', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: 'var(--secondary)', 
                color: 'white', 
                height: '48px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '10px',
                boxShadow: '0 4px 6px rgba(33, 150, 243, 0.2)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creando cuenta...' : (
                <>
                  Registrarse <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>¿Ya tienes una cuenta?</span>{' '}
            <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: '700', textDecoration: 'none' }}>Iniciar Sesión</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
