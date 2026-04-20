import React, { useMemo, useState } from 'react';
import { useSpecimens } from '../context/SpecimenContext';
import { 
  FolderTree, ChevronRight, ChevronDown, List, 
  Search, Database, Info, Filter
} from 'lucide-react';

const TaxonomyExplorer = () => {
  const { specimens, loading } = useSpecimens();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({});

  // Build the hierarchical tree from the flat specimens list
  const taxonomyTree = useMemo(() => {
    const tree = {};

    specimens.forEach(s => {
      const { kingdom, phylum, class: className, order, family, genus, scientificName } = s;
      
      if (!tree[kingdom]) tree[kingdom] = { count: 0, children: {} };
      tree[kingdom].count++;

      if (!tree[kingdom].children[phylum]) tree[kingdom].children[phylum] = { count: 0, children: {} };
      tree[kingdom].children[phylum].count++;

      if (!tree[kingdom].children[phylum].children[className]) tree[kingdom].children[phylum].children[className] = { count: 0, children: {} };
      tree[kingdom].children[phylum].children[className].count++;

      if (!tree[kingdom].children[phylum].children[className].children[order]) tree[kingdom].children[phylum].children[className].children[order] = { count: 0, children: {} };
      tree[kingdom].children[phylum].children[className].children[order].count++;

      if (!tree[kingdom].children[phylum].children[className].children[order].children[family]) tree[kingdom].children[phylum].children[className].children[order].children[family] = { count: 0, children: {} };
      tree[kingdom].children[phylum].children[className].children[order].children[family].count++;

      if (!tree[kingdom].children[phylum].children[className].children[order].children[family].children[genus]) tree[kingdom].children[phylum].children[className].children[order].children[family].children[genus] = { count: 0, children: {} };
      tree[kingdom].children[phylum].children[className].children[order].children[family].children[genus].count++;

      if (!tree[kingdom].children[phylum].children[className].children[order].children[family].children[genus].children[scientificName]) {
        tree[kingdom].children[phylum].children[className].children[order].children[family].children[genus].children[scientificName] = { count: 0, specimen_id: s.occurrenceID };
      }
      tree[kingdom].children[phylum].children[className].children[order].children[family].children[genus].children[scientificName].count++;
    });

    return tree;
  }, [specimens]);

  const toggleNode = (path) => {
    setExpandedNodes(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const TreeNode = ({ name, data, path, level }) => {
    const isExpanded = expandedNodes[path];
    const hasChildren = data.children && Object.keys(data.children).length > 0;
    const isSpecies = !data.children;

    if (searchTerm && !name.toLowerCase().includes(searchTerm.toLowerCase()) && !hasChildrenInSearch(data, searchTerm)) {
      return null;
    }

    return (
      <div style={{ marginLeft: level * 20 }}>
        <div 
          onClick={() => hasChildren && toggleNode(path)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 12px', 
            cursor: hasChildren ? 'pointer' : 'default',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isExpanded ? 'var(--primary-light)' : 'transparent',
            transition: 'var(--transition)',
            userSelect: 'none'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = isExpanded ? 'var(--primary-light)' : 'var(--surface)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = isExpanded ? 'var(--primary-light)' : 'transparent'}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} color="var(--primary)" /> : <ChevronRight size={14} color="var(--text-muted)" />
          ) : (
            <div style={{ width: '14px' }} />
          )}
          
          <span style={{ 
            fontWeight: hasChildren ? '600' : '400',
            fontStyle: isSpecies ? 'italic' : 'normal',
            fontSize: isSpecies ? '0.9rem' : '0.95rem',
            color: isExpanded ? 'var(--primary-dark)' : 'var(--text-main)'
          }}>
            {name || 'N/A'}
          </span>
          
          <span style={{ 
            fontSize: '0.75rem', 
            backgroundColor: 'var(--border)', 
            padding: '1px 6px', 
            borderRadius: '10px',
            color: 'var(--text-muted)'
          }}>
            {data.count}
          </span>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="fade-in">
            {Object.entries(data.children).map(([childName, childData]) => (
              <TreeNode 
                key={childName} 
                name={childName} 
                data={childData} 
                path={`${path}.${childName}`} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to check if any child matches the search
  const hasChildrenInSearch = (data, search) => {
    if (!data.children) return false;
    return Object.entries(data.children).some(([name, child]) => 
      name.toLowerCase().includes(search.toLowerCase()) || hasChildrenInSearch(child, search)
    );
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando jerarquía...</div>;
  }

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Explorador Filogenético</h1>
          <p style={{ color: 'var(--text-muted)' }}>Jerarquía taxonómica dinámica de la colección universitaria.</p>
        </div>
        <div style={{ backgroundColor: 'var(--primary-light)', padding: '10px 20px', borderRadius: 'var(--radius-lg)', color: 'var(--primary-dark)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderTree size={20} /> Darwin Core Tree View
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
        <div className="sci-card" style={{ padding: '25px', height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar taxón..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '35px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {Object.entries(taxonomyTree).map(([kingdomName, kingdomData]) => (
              <TreeNode 
                key={kingdomName} 
                name={kingdomName} 
                data={kingdomData} 
                path={kingdomName} 
                level={0} 
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="sci-card glass" style={{ padding: '30px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Info size={20} color="var(--primary)" /> Guía de Navegación
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              Este explorador genera dinámicamente un árbol de vida basado exclusivamente en los ejemplares físicos de la colección. 
              Utiliza la jerarquía **Darwin Core** (Reino → Filo → Clase → Orden → Familia → Género → Especie).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              <div style={{ padding: '15px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>ESPECIES ÚNICAS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {new Set(specimens.map(s => s.scientificName)).size}
                </div>
              </div>
              <div style={{ padding: '15px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>FAMILIAS REPRESENTADAS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
                  {new Set(specimens.map(s => s.family)).size}
                </div>
              </div>
            </div>
          </div>

          <div className="sci-card" style={{ padding: '30px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Database size={20} color="var(--warning)" /> Integridad de la Taxonomía
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Cualquier cambio realizado en la ficha técnica de un ejemplar (campo Clase, Orden, Familia) se reflejará instantáneamente en esta jerarquía. 
              Si encuentra inconsistencias en el árbol, por favor utilice la herramienta de edición para normalizar los campos Darwin Core.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyExplorer;
