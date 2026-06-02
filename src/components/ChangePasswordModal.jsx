import React, { useState } from 'react';
import userService from '../services/userService';
import { XCircle, Key } from 'lucide-react';

const ChangePasswordModal = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword(password);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      zIndex: 2000,
      padding: '40px 20px',
      overflowY: 'auto'
    }}>
      <div className="glass sci-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', position: 'relative', margin: 'auto' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Key size={24} />
          Cambiar Contraseña
        </h2>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: 'var(--text-muted)' }}
        >
          <XCircle size={24} />
        </button>
        
        {success ? (
          <div style={{ padding: '15px', backgroundColor: 'var(--success)', color: 'white', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            ¡Contraseña actualizada con éxito!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {error && (
              <div style={{ padding: '10px', backgroundColor: 'var(--error-light)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nueva Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 'bold',
                marginTop: '10px',
                boxShadow: 'var(--shadow-sm)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
