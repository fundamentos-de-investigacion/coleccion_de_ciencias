import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Calendar, Tag, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { useSpecimens } from '../context/SpecimenContext';

const SpecimenCard = ({ specimen }) => {
  const { deleteSpecimen } = useSpecimens();

  const handleDelete = async (e) => {
    e.preventDefault(); // In case it's inside a link, though it's not here
    if (window.confirm('¿Estás seguro de que deseas eliminar este ejemplar permanentemente de la colección?')) {
      await deleteSpecimen(specimen.occurrenceID);
    }
  };

  return (
    <div className="sci-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ 
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          color: 'var(--text-muted)',
          fontWeight: '700'
        }}>
          {specimen.kingdom} • {specimen.family}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '0.65rem', 
            color: 'var(--text-muted)',
            backgroundColor: 'var(--border)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            id: {specimen.occurrenceID.slice(0, 8)}
          </span>
          <button 
            onClick={handleDelete}
            title="Eliminar ejemplar"
            style={{ background: 'none', color: 'var(--error)', padding: '2px', display: 'flex', alignItems: 'center' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 style={{ 
        fontStyle: 'italic', 
        fontSize: '1.2rem', 
        marginBottom: '15px',
        color: 'var(--primary-dark)' 
      }}>
        {specimen.scientificName}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <MapPin size={14} color="var(--primary)" />
          <span style={{ color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {specimen.locality}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <User size={14} color="var(--secondary)" />
          <span style={{ color: 'var(--text-main)' }}>{specimen.recordedBy}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Calendar size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-main)' }}>{specimen.eventDate}</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to={`/edit/${specimen.occurrenceID}`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            fontSize: '0.85rem', 
            color: 'var(--secondary)',
            fontWeight: '600'
          }}>
            <Edit3 size={16} /> Editar
          </Link>
        </div>
        <Link to={`/specimen/${specimen.occurrenceID}`} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          fontSize: '0.85rem', 
          color: 'var(--primary)',
          fontWeight: '600' 
        }}>
          Ver detalles <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default SpecimenCard;
