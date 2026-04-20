import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, UserCircle2, Microscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicNavbar = () => {
  const { user } = useAuth();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
      zIndex: 1100,
      transition: 'var(--transition)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{ 
          backgroundColor: 'var(--primary)', 
          width: '38px', 
          height: '38px', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>🍃</div>
        <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>BioCollección</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <NavLink to="/catalog" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--text-main)',
            fontWeight: '600',
            fontSize: '0.95rem',
            borderBottom: isActive ? '2px solid var(--primary)' : 'none',
            padding: '5px 0'
          })}>Catálogo</NavLink>
          <NavLink to="/taxonomy" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--text-main)',
            fontWeight: '600',
            fontSize: '0.95rem',
            borderBottom: isActive ? '2px solid var(--primary)' : 'none',
            padding: '5px 0'
          })}>Jerarquía</NavLink>
          <NavLink to="/visualizations" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--text-main)',
            fontWeight: '600',
            fontSize: '0.95rem',
            borderBottom: isActive ? '2px solid var(--primary)' : 'none',
            padding: '5px 0'
          })}>Mapa Global</NavLink>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>

        {user ? (
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--secondary)', 
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.9rem',
            backgroundColor: 'var(--secondary-light)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <Microscope size={18} /> Ir al Laboratorio
          </Link>
        ) : (
          <Link to="/login" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.9rem',
            backgroundColor: 'var(--primary-dark)',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <UserCircle2 size={18} /> Investigadores
          </Link>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
