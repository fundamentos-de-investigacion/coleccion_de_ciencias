import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  PlusCircle, 
  BarChart3, 
  BookOpen, 
  FileUp, 
  History,
  Info,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, signOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', visible: !!user },
    { name: 'Catálogo', icon: <Database size={20} />, path: '/catalog', visible: true },
    { name: 'Explorador Árbol', icon: <BookOpen size={20} />, path: '/taxonomy', visible: true },
    { name: 'Registrar', icon: <PlusCircle size={20} />, path: '/register', visible: !!user },
    { name: 'Visualizaciones', icon: <BarChart3 size={20} />, path: '/visualizations', visible: true },
    { name: 'Darwin Core', icon: <BookOpen size={20} />, path: '/darwin-core', visible: true },
    { name: 'Importar/Exportar', icon: <FileUp size={20} />, path: '/import-export', visible: !!user },
    { name: 'Préstamos', icon: <History size={20} />, path: '/loans', visible: !!user },
    { name: 'Información', icon: <Info size={20} />, path: '/about', visible: true },
  ];

  const visibleNavItems = navItems.filter(item => item.visible);

  const sidebarStyle = {
    position: 'fixed',
    top: '64px',
    left: isOpen ? '0' : '-260px',
    bottom: 0,
    width: '260px',
    backgroundColor: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    transition: 'left 0.3s ease',
    padding: '20px 10px',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    borderRadius: 'var(--radius-md)',
    color: isActive ? 'white' : 'var(--text-main)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.95rem'
  });

  return (
    <aside style={sidebarStyle}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '10px',
        '@media (min-width: 1025px)': { display: 'none' } 
      }}>
        <button onClick={closeSidebar} style={{ background: 'none', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '0 10px 15px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
        Menu Principal
      </div>

      {visibleNavItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path} 
          style={linkStyle}
          onClick={() => window.innerWidth <= 1024 && closeSidebar()}
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', padding: '20px 15px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          onClick={() => { signOut(); closeSidebar(); }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: 'var(--error)', 
            background: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            padding: '5px 0'
          }}
        >
          <X size={20} /> Salir del Sistema
        </button>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            System Version: 1.0.0
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Darwin Core Compliant
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
