import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import loanService from '../services/loanService';
import { useSpecimens } from '../context/SpecimenContext';
import { History, User, Building, Calendar, ArrowRight, CheckCircle, Clock, PlusCircle, Trash2 } from 'lucide-react';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const { specimens } = useSpecimens();

  const fetchLoans = async () => {
    setLoading(true);
    const data = await loanService.getAll();
    setLoans(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleEdit = (loan) => {
    setEditingLoan(loan);
    setIsModalOpen(true);
  };

  const activeLoans = loans.filter(l => l.status === 'active');
  const finishedLoans = loans.filter(l => l.status !== 'active');

  // Find specimens that are NOT currently on an active loan (except the one being edited)
  const lentSpecimenIds = new Set(activeLoans.map(l => l.specimen_id));
  if (editingLoan) lentSpecimenIds.delete(editingLoan.specimen_id);
  
  const availableSpecimens = specimens.filter(s => !lentSpecimenIds.has(s.occurrenceID));

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Cargando gestión de préstamos...</div>;
  }

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Gestión de Préstamos Externos</h1>
          <p style={{ color: 'var(--text-muted)' }}>Seguimiento de ejemplares en préstamo a otras instituciones e investigadores.</p>
        </div>
        <button 
          onClick={() => {
            setEditingLoan(null);
            setIsModalOpen(true);
          }}
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
          <PlusCircle size={20} /> Registrar Nuevo Préstamo
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {/* Active Loans column */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--primary)" /> Préstamos Activos ({activeLoans.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {activeLoans.length > 0 ? activeLoans.map(loan => (
              <LoanCard key={loan.id} loan={loan} onUpdate={fetchLoans} onEdit={() => handleEdit(loan)} />
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay préstamos activos en este momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* History column */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={20} color="var(--text-muted)" /> Historial Reciente
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {finishedLoans.slice(0, 10).map(loan => (
              <LoanCard key={loan.id} loan={loan} isHistory onUpdate={fetchLoans} onEdit={() => handleEdit(loan)} />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <LoanModal 
          availableSpecimens={availableSpecimens}
          editingLoan={editingLoan}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchLoans();
          }}
        />
      )}
    </div>
  );
};

const LoanModal = ({ availableSpecimens, editingLoan, onClose, onSuccess }) => {
  const [specimenId, setSpecimenId] = useState(editingLoan?.specimen_id || '');
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
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="sci-card fade-in" style={{ width: '100%', maxWidth: '450px', padding: '30px' }}>
        <h2 style={{ marginBottom: '10px', color: 'var(--primary-dark)' }}>
          {editingLoan ? 'Editar Préstamo' : 'Registrar Salida de Ejemplar'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '25px' }}>
          {editingLoan ? 'Actualice los datos del préstamo seleccionado.' : 'Complete los datos del investigador e institución encargada del material.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Ejemplar *</label>
            <select 
              required 
              disabled={!!editingLoan}
              value={specimenId} 
              onChange={e => setSpecimenId(e.target.value)}
              style={{ width: '100%', padding: '10px' }}
            >
              {editingLoan ? (
                <option value={editingLoan.specimen_id}>{editingLoan.specimen?.scientificName}</option>
              ) : (
                <>
                  <option value="">Seleccione un ejemplar disponible...</option>
                  {availableSpecimens.map(s => (
                    <option key={s.occurrenceID} value={s.occurrenceID}>
                      {s.scientificName} ({s.kingdom}) - ID: {s.occurrenceID.slice(0,8)}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Investigador *</label>
              <input 
                required 
                value={borrower} 
                onChange={e => setBorrower(e.target.value)} 
                placeholder="Nombre completo"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Institución *</label>
              <input 
                required 
                value={institution} 
                onChange={e => setInstitution(e.target.value)} 
                placeholder="Univ / Herbario..."
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Fecha de Devolución Estimada</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              style={{ width: '100%' }}
            />
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

const LoanCard = ({ loan, isHistory, onUpdate, onEdit }) => {
  const handleReturn = async () => {
    if (window.confirm(`¿Confirmar devolución del ejemplar por parte de ${loan.borrower}?`)) {
      await loanService.markAsReturned(loan.id);
      if (onUpdate) onUpdate();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de préstamo? Esta acción no se puede deshacer.')) {
      await loanService.delete(loan.id);
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div className="sci-card glass" style={{ borderLeft: `4px solid ${isHistory ? 'var(--border)' : 'var(--primary)'}`, position: 'relative' }}>
      <div style={{ position: 'absolute', right: '15px', top: '15px', display: 'flex', gap: '10px' }}>
        {!isHistory && (
          <button 
            onClick={handleReturn}
            title="Marcar como devuelto"
            style={{ background: 'none', color: 'var(--success)', padding: '5px' }}
          >
            <CheckCircle size={18} />
          </button>
        )}
        <button 
          onClick={onEdit}
          title="Editar préstamo"
          style={{ background: 'none', color: 'var(--secondary)', padding: '5px' }}
        >
          <PlusCircle size={18} style={{ transform: 'rotate(45deg)' }} /> {/* Using PlusCircle rotated as an edit-ish icon or I could import Edit3 */}
        </button>
        <button 
          onClick={handleDelete}
          title="Eliminar registro"
          style={{ background: 'none', color: 'var(--error)', padding: '5px' }}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} color="var(--secondary)" />
          <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{loan.borrower}</span>
        </div>
        {isHistory && <CheckCircle size={16} color="var(--success)" />}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
        <Building size={14} />
        <span>{loan.institution}</span>
      </div>

      <div style={{ 
        backgroundColor: 'var(--surface)', 
        padding: '10px', 
        borderRadius: 'var(--radius-sm)',
        marginBottom: '15px',
        fontSize: '0.85rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <div style={{ fontStyle: 'italic', color: 'var(--primary-dark)', fontWeight: '600' }}>
            {loan.specimen?.scientificName || 'Ejemplar desconocido'}
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {loan.specimen?.kingdom} • ID: {loan.specimen_id?.slice(0,8)}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          <span>{loan.loan_date}</span>
          <ArrowRight size={12} />
          <span>{loan.return_date || loan.due_date || '...'}</span>
        </div>
        <Link 
          to={`/specimen/${loan.specimen_id}`}
          style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}
        >
          Ver Ficha
        </Link>
      </div>
    </div>
  );
};

export default Loans;
