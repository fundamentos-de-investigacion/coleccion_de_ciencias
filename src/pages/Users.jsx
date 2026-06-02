import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { Shield, User, Key, Trash2, PlusCircle, UserPlus, CheckCircle, XCircle } from 'lucide-react';

const Users = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('auxiliar');
  const [permissions, setPermissions] = useState({
    register: false,
    'import-export': false,
    loans: false
  });

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions(prev => ({ ...prev, [name]: checked }));
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUsers();
    }
  }, [userRole]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await userService.createUser(email, password, role, permissions);
      setIsModalOpen(false);
      setEmail('');
      setPassword('');
      setRole('auxiliar');
      setPermissions({ register: false, 'import-export': false, loans: false });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear el usuario. Revisa el correo y contraseña.');
    }
  };

  const handleDeleteUser = async (targetId, targetEmail) => {
    if (window.confirm(`¿Estás completamente seguro de que deseas eliminar al usuario ${targetEmail}? Esta acción no se puede deshacer.`)) {
      try {
        await userService.deleteUser(targetId);
        fetchUsers();
      } catch (err) {
        console.error(err);
        setError('Error al eliminar usuario.');
      }
    }
  };

  if (userRole !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Shield size={48} color="var(--error)" style={{ marginBottom: '20px' }} />
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos de Administrador para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Gestión de Usuarios</h1>
          <p style={{ color: 'var(--text-muted)' }}>Control de acceso, roles y permisos de los miembros de la institución.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            padding: '12px 20px', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <UserPlus size={20} /> Crear Nuevo Usuario
        </button>
      </header>

      {error && (
        <div style={{ padding: '15px', backgroundColor: 'var(--error-light)', color: 'var(--error)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="sci-card glass" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Cargando usuarios...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '15px' }}>Email</th>
                <th style={{ padding: '15px' }}>Rol</th>
                <th style={{ padding: '15px' }}>Fecha de Creación</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <User size={18} color="var(--primary)" />
                      {u.email}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      backgroundColor: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: u.role === 'admin' ? '#ef4444' : '#3b82f6',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteUser(u.id, u.email)}
                      style={{ background: 'none', color: 'var(--error)', padding: '5px' }}
                      title="Eliminar usuario"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass sci-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
            <h2 style={{ marginBottom: '20px', color: 'var(--primary-dark)' }}>Crear Usuario Auxiliar</h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: 'var(--text-muted)' }}
            >
              <XCircle size={24} />
            </button>
            
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña Temporal</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rol del Sistema</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '15px' }}
                >
                  <option value="auxiliar">Auxiliar (Accesos restringidos)</option>
                  <option value="admin">Administrador (Control total)</option>
                </select>
              </div>

              {role === 'auxiliar' && (
                <div style={{ padding: '15px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>Permisos del Auxiliar:</label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <input type="checkbox" name="register" checked={permissions.register} onChange={handlePermissionChange} />
                    Puede Registrar / Editar Especímenes
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <input type="checkbox" name="loans" checked={permissions.loans} onChange={handlePermissionChange} />
                    Gestión de Préstamos
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <input type="checkbox" name="import-export" checked={permissions['import-export']} onChange={handlePermissionChange} />
                    Importar y Exportar Datos
                  </label>
                  
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    * El Catálogo, Explorador y Visualizaciones siempre son públicos.
                  </div>
                </div>
              )}

              <button 
                type="submit"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 'bold',
                  marginTop: '10px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Crear Cuenta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
