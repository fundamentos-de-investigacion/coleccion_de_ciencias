import React, { useState, useEffect } from 'react';
import { useSpecimens } from '../context/SpecimenContext';
// Removed Recharts imports as charts are no longer displayed on dashboard
import {
  Database,
  Activity,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import loanService from '../services/loanService';

const Dashboard = ({ theme }) => {
  const { specimens, metrics, resetCollection, syncLocalData, loading } = useSpecimens();
  const [hasLocalData, setHasLocalData] = useState(false);
  const [recentLoans, setRecentLoans] = useState([]);

  useEffect(() => {
    loanService.getAll().then(data => setRecentLoans(data.slice(0, 5)));

    const local = localStorage.getItem('bio_collection_specimens');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasLocalData(true);
        }
      } catch (e) {
        console.error('Error checking local data', e);
      }
    }
  }, []);

  if (loading && specimens.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
        <RefreshCw className="spin" size={40} color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Cargando datos institucionales...</p>
      </div>
    );
  }

  const recentSpecimens = specimens.slice(0, 5);

  const stats = [
    { title: 'Total Especímenes', value: metrics.total, icon: <Database />, color: 'var(--primary)' },
    { title: 'Reinos Representados', value: Object.keys(metrics.byKingdom).length, icon: <Activity />, color: 'var(--secondary)' },
    { title: 'Localidades', value: new Set(specimens.map(s => s.locality)).size, icon: <MapPin />, color: 'var(--warning)' },
    { title: 'Última Actualización', value: 'Hoy', icon: <Clock />, color: 'var(--success)' },
  ];

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)' }}>Dashboard Científico</h1>
          <p style={{ color: 'var(--text-muted)' }}>Resumen de la colección biológica.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de restablecer la colección? Se perderán todos los datos manuales.')) {
                resetCollection();
              }
            }}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--error)',
              border: '1px solid var(--error)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem'
            }}
          >
            Restablecer Datos
          </button>
          <Link to="/register" style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}>
            <Plus size={18} /> Nuevo Registro
          </Link>
        </div>
      </header>

      {hasLocalData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sci-card"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'white',
            padding: '25px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '50%' }}>
              <Database size={24} />
            </div>
            <div>
              <h3 style={{ marginBottom: '5px' }}>Datos locales detectados</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Tienes investigaciones guardadas localmente en este navegador. <br />
                ¿Deseas sincronizarlas con tu cuenta en la nube de Supabase?
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              await syncLocalData();
              setHasLocalData(false);
            }}
            style={{
              backgroundColor: 'white',
              color: 'var(--secondary)',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <RefreshCw size={18} /> Sincronizar Ahora
          </button>
        </motion.div>
      )}

      {/* Quick Activity Lists */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Recent Specimens List */}
        <div className="sci-card glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--primary)" /> Últimos Ejemplares
            </h3>
            <Link to="/catalog" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>Ver Todos</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentSpecimens.length > 0 ? recentSpecimens.map(s => (
              <Link to={`/specimen/${s.occurrenceID}`} key={s.occurrenceID} style={{
                textDecoration: 'none',
                color: 'inherit',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', fontStyle: 'italic', fontSize: '0.9rem' }}>{s.scientificName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.kingdom} • {s.family}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.eventDate}</div>
              </Link>
            )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No hay registros.</p>}
          </div>
        </div>

        {/* Recent Loans List */}
        <div className="sci-card glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--secondary)" /> Préstamos Recientes
            </h3>
            <Link to="/loans" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>Ver Todos</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLoans.length > 0 ? recentLoans.map(l => (
              <div key={l.id} style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{l.borrower}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.specimen?.scientificName || 'Ejemplar'}</div>
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: l.status === 'active' ? 'var(--primary-light)' : 'var(--border)',
                  color: l.status === 'active' ? 'var(--primary-dark)' : 'var(--text-muted)',
                  fontWeight: 'bold'
                }}>
                  {l.status === 'active' ? 'FUERA' : 'DEVUELTO'}
                </div>
              </div>
            )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No hay préstamos.</p>}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
