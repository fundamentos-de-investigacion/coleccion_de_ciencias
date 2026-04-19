import React from 'react';
import { useSpecimens } from '../context/SpecimenContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Notifications = () => {
  const { notifications } = useSpecimens();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 2000,
      maxWidth: '350px'
    }}>
      {notifications.map((notif) => (
        <div key={notif.id} className="fade-in" style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: `5px solid ${
            notif.type === 'success' ? 'var(--success)' : 
            notif.type === 'error' ? 'var(--error)' : 
            notif.type === 'warning' ? 'var(--warning)' : 
            'var(--secondary)'
          }`
        }}>
          {notif.type === 'success' ? <CheckCircle size={20} color="var(--success)" /> :
           notif.type === 'error' ? <AlertCircle size={20} color="var(--error)" /> :
           <Info size={20} color="var(--secondary)" />}
          
          <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500' }}>
            {notif.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
