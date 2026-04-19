import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Calendar, Tag, ChevronRight, Edit3 } from 'lucide-react';

const SpecimenCard = ({ specimen }) => {
  return (
    <div className="sci-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
        <span style={{ 
          fontSize: '0.65rem', 
          color: 'var(--text-muted)',
          backgroundColor: 'var(--border)',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          id: {specimen.occurrenceID.slice(0, 8)}
        </span>
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
        <div style={{ display: 'flex', gap: '8px' }}>
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
