import React, { useState } from 'react';
import { X, User, Building, Calendar } from 'lucide-react';
import loanService from '../services/loanService';

/**
 * Shared Loan Modal component.
 * Can be used in "create" mode (specimenId or availableSpecimens needed)
 * or "edit" mode (editingLoan needed).
 */
const LoanModal = ({ 
  specimenId: initialSpecimenId, 
  availableSpecimens, 
  editingLoan, 
  onClose, 
  onSuccess 
}) => {
  const [specimenId, setSpecimenId] = useState(editingLoan?.specimen_id || initialSpecimenId || '');
  const [borrower, setBorrower] = useState(editingLoan?.borrower || '');
  const [institution, setInstitution] = useState(editingLoan?.institution || '');
  const [dueDate, setDueDate] = useState(editingLoan?.due_date || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!specimenId) return alert('Por favor seleccione un ejemplar');
    
    setIsSubmitting(true);
    try {
      const loanData = {
        specimen_id: specimenId,
        borrower,
        institution,
        due_date: dueDate
      };

      if (editingLoan) {
        await loanService.update(editingLoan.id, loanData);
      } else {
        await loanService.create(loanData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error handling loan:', error);
      alert('Error al gestionar el préstamo. Por favor intente de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
      <div className="sci-card fade-in" style={{ width: '100%', maxWidth: '450px', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, color: 'var(--primary-dark)' }}>
            {editingLoan ? 'Editar Préstamo' : 'Registrar Salida de Ejemplar'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '25px' }}>
          {editingLoan ? 'Actualice los datos del préstamo seleccionado.' : 'Complete los datos del investigador e institución encargada del material.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Ejemplar *</label>
            {initialSpecimenId && !editingLoan ? (
              <div style={{ padding: '10px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
                ID: {initialSpecimenId.slice(0, 8)}...
              </div>
            ) : (
              <select 
                required 
                disabled={!!editingLoan}
                value={specimenId} 
                onChange={e => setSpecimenId(e.target.value)}
                style={{ width: '100%', padding: '10px' }}
              >
                {editingLoan ? (
                  <option value={editingLoan.specimen_id}>{editingLoan.specimen?.scientificName || 'Ejemplar seleccionado'}</option>
                ) : (
                  <>
                    <option value="">Seleccione un ejemplar disponible...</option>
                    {availableSpecimens?.map(s => (
                      <option key={s.occurrenceID} value={s.occurrenceID}>
                        {s.scientificName} ({s.kingdom}) - ID: {s.occurrenceID.slice(0,8)}
                      </option>
                    ))}
                  </>
                )}
              </select>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Investigador *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  required 
                  value={borrower} 
                  onChange={e => setBorrower(e.target.value)} 
                  placeholder="Nombre completo"
                  style={{ width: '100%', paddingLeft: '35px' }}
                />
                <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Institución *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  required 
                  value={institution} 
                  onChange={e => setInstitution(e.target.value)} 
                  placeholder="Univ / Herbario..."
                  style={{ width: '100%', paddingLeft: '35px' }}
                />
                <Building size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Fecha de Devolución Estimada</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                style={{ width: '100%', paddingLeft: '35px' }}
              />
              <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ flex: 2, backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold' }}
            >
              {isSubmitting ? 'Procesando...' : (editingLoan ? 'Actualizar Préstamo' : 'Confirmar Salida')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanModal;
