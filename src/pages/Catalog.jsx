import React, { useState, useMemo } from 'react';
import { useSpecimens } from '../context/SpecimenContext';
import SpecimenCard from '../components/SpecimenCard';
import { Search, Filter, SlidersHorizontal, Grid, List as ListIcon, X } from 'lucide-react';

const Catalog = () => {
  const { specimens, loading } = useSpecimens();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKingdom, setFilterKingdom] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [viewType, setViewType] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Memoized unique values for filters
  const kingdoms = useMemo(() => ['All', ...new Set(specimens.map(s => s.kingdom))], [specimens]);
  const classes = useMemo(() => ['All', ...new Set(specimens.map(s => s.class))], [specimens]);

  // Combined search and filter logic (Memoized)
  const filteredSpecimens = useMemo(() => {
    return specimens.filter(s => {
      const matchesSearch = 
        s.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.recordedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.locality.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesKingdom = filterKingdom === 'All' || s.kingdom === filterKingdom;
      const matchesClass = filterClass === 'All' || s.class === filterClass;
      
      return matchesSearch && matchesKingdom && matchesClass;
    });
  }, [specimens, searchTerm, filterKingdom, filterClass]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>Cargando catálogo...</div>;
  }

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Catálogo de Especímenes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Explora la colección biológica registrada en el sistema.</p>
      </header>

      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '15px', 
        marginBottom: '30px', 
        alignItems: 'center',
        backgroundColor: 'var(--surface)',
        padding: '15px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, colector o ubicación..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              paddingLeft: '40px', 
              height: '42px', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)' 
            }} 
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0 15px', 
              height: '42px',
              backgroundColor: isFilterOpen ? 'var(--primary-light)' : 'white',
              color: isFilterOpen ? 'var(--primary-dark)' : 'var(--text-main)',
              border: `1px solid ${isFilterOpen ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              fontWeight: '500'
            }}
          >
            <Filter size={18} /> {isFilterOpen ? 'Cerrar Filtros' : 'Filtrar'}
          </button>
          
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button 
              onClick={() => setViewType('grid')}
              style={{ 
                padding: '0 12px', 
                height: '40px', 
                backgroundColor: viewType === 'grid' ? 'var(--primary)' : 'white',
                color: viewType === 'grid' ? 'white' : 'var(--text-muted)'
              }}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewType('list')}
              style={{ 
                padding: '0 12px', 
                height: '40px', 
                backgroundColor: viewType === 'list' ? 'var(--primary)' : 'white',
                color: viewType === 'list' ? 'white' : 'var(--text-muted)'
              }}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Filters */}
      {isFilterOpen && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Reino</label>
            <select 
              value={filterKingdom}
              onChange={(e) => setFilterKingdom(e.target.value)}
              style={{ width: '100%', height: '38px' }}
            >
              {kingdoms.map(k => <option key={k} value={k}>{k === 'All' ? 'Todos los reinos' : k}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Clase</label>
            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{ width: '100%', height: '38px' }}
            >
              {classes.map(c => <option key={c} value={c}>{c === 'All' ? 'Todas las clases' : c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={() => {
                setFilterKingdom('All');
                setFilterClass('All');
                setSearchTerm('');
              }}
              style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: '600', background: 'none' }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Mostrando <strong>{filteredSpecimens.length}</strong> de {specimens.length} especímenes.
        </p>
      </div>

      {/* Grid/List Display */}
      {filteredSpecimens.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: viewType === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', 
          gap: '24px' 
        }}>
          {filteredSpecimens.map(s => (
            <SpecimenCard key={s.occurrenceID} specimen={s} />
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          backgroundColor: 'var(--surface)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ marginBottom: '10px' }}>No se encontraron resultados</h3>
          <p style={{ color: 'var(--text-muted)' }}>Intenta ajustar los filtros o el término de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
