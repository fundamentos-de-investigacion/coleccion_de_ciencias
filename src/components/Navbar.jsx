import React from 'react';
import { Menu, Sun, Moon, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar, theme, toggleTheme }) => {
  const { user } = useAuth();
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 1000,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={toggleSidebar} style={{ background: 'none', color: 'var(--text-main)' }}>
          <Menu size={24} />
        </button>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            backgroundColor: 'var(--primary)', 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>🍃</div>
          <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary-dark)' }}>BioCollección</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Búsqueda rápida..." 
            style={{ 
              paddingLeft: '35px', 
              borderRadius: 'var(--radius-full)',
              width: '250px',
              height: '36px',
              fontSize: 'var(--font-size-sm)'
            }} 
          />
        </div>

        <button onClick={toggleTheme} style={{ 
          background: 'none', 
          color: 'var(--text-main)',
          padding: '8px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center'
        }}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        {user ? (
          <>
            <button style={{ background: 'none', color: 'var(--text-main)' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'var(--primary-dark)'
              }}>{user.email?.[0].toUpperCase() || 'U'}</div>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600'
          }}>
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
