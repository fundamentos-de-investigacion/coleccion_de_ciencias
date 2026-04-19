import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="sci-card fade-in" style={{
        width: '90%',
        maxWidth: '450px',
        backgroundColor: 'var(--background)',
        padding: '30px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px' }}>
          <div style={{ 
            backgroundColor: type === 'danger' ? '#fee2e2' : 'var(--primary-light)', 
            padding: '15px', 
            borderRadius: '50%',
            color: type === 'danger' ? 'var(--error)' : 'var(--primary)'
          }}>
            <AlertTriangle size={32} />
          </div>
          
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>
          
          <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
            <button 
              onClick={onClose}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                fontWeight: '600'
              }}
            >
              {cancelText}
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: type === 'danger' ? 'var(--error)' : 'var(--primary)',
                color: 'white',
                fontWeight: '600'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
