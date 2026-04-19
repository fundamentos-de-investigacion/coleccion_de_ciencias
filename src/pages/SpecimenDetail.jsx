import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSpecimens } from '../context/SpecimenContext';
import { 
  ArrowLeft, Edit3, Trash2, MapPin, Calendar, User, 
  Tag, Info, ExternalLink, Clock, History, Database
} from 'lucide-react';
import loanService from '../services/loanService';

const SpecimenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { specimens, deleteSpecimen } = useSpecimens();

  const specimen = specimens.find(s => s.occurrenceID === id);
  const [specimenLoans, setSpecimenLoans] = React.useState([]);
  const [isLoanModalOpen, setIsLoanModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      loanService.getBySpecimen(id).then(setSpecimenLoans);
    }
  }, [id]);

  const handleReturnLoan = async (loanId) => {
    if (window.confirm('¿Confirmar que el ejemplar ha sido devuelto a la colección física?')) {
      await loanService.markAsReturned(loanId);
      const updated = await loanService.getBySpecimen(id);
      setSpecimenLoans(updated);
    }
  };

  if (!specimen) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Especimen no encontrado</h2>
        <Link to="/catalog" style={{ color: 'var(--primary)' }}>Volver al catálogo</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este especimen de la colección?')) {
      deleteSpecimen(id);
      navigate('/catalog');
    }
  };

  const InfoRow = ({ label, value, italic = false }) => (
    <div style={{ 
      display: 'flex', 
      padding: '12px 0', 
      borderBottom: '1px solid var(--border)',
      justifyContent: 'space-between'
    }}>
      <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ 
        color: 'var(--text-main)', 
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: '500'
      }}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} /> Volver
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/edit/${id}`} style={{ 
            backgroundColor: 'var(--surface)', 
            color: 'var(--primary)', 
            border: '1px solid var(--primary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}>
            <Edit3 size={18} /> Editar
          </Link>
          <button 
            onClick={handleDelete}
            style={{ 
              backgroundColor: 'var(--error)', 
              color: 'white', 
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <Trash2 size={18} /> Eliminar
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {/* Scientific Card */}
        <div className="sci-card" style={{ padding: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: 'var(--primary-light)', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              color: 'var(--primary-dark)',
              fontSize: '2rem'
            }}>🌿</div>
            <h1 style={{ fontStyle: 'italic', color: 'var(--primary-dark)', marginBottom: '5px' }}>{specimen.scientificName}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700' }}>
              {specimen.kingdom.toUpperCase()} • {specimen.occurrenceID.slice(0, 13).toUpperCase()}
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '5px', marginBottom: '15px' }}>
              Clasificación Biológica
            </h4>
            <InfoRow label="Reino" value={specimen.kingdom} />
            <InfoRow label="Filo" value={specimen.phylum} />
            <InfoRow label="Clase" value={specimen.class} />
            <InfoRow label="Orden" value={specimen.order} />
            <InfoRow label="Familia" value={specimen.family} />
            <InfoRow label="Género" value={specimen.genus} italic />
            <InfoRow label="Epíteto específico" value={specimen.specificEpithet} italic />
          </div>

          <div>
            <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '5px', marginBottom: '15px' }}>
              Detalles de Registro
            </h4>
            <InfoRow label="Registrado por" value={specimen.recordedBy} />
            <InfoRow label="Fecha" value={specimen.eventDate} />
            <InfoRow label="Ubicación" value={specimen.locality} />
            <InfoRow label="Coordenadas" value={
              specimen.decimalLatitude && specimen.decimalLongitude 
                ? `${specimen.decimalLatitude}, ${specimen.decimalLongitude}` 
                : 'No registradas'
            } />
          </div>

          <div style={{ marginTop: '30px' }}>
            <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '5px', marginBottom: '15px' }}>
              Ubicación en Colección Física
            </h4>
            <InfoRow label="Mueble" value={specimen.cabinet} />
            <InfoRow label="Cajón" value={specimen.drawer} />
            <InfoRow label="Estante" value={specimen.shelf} />
          </div>
        </div>

        {/* Sidebar details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="sci-card glass">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Info size={18} color="var(--primary)" /> Descripción del Ejemplar
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
              "{specimen.description || 'Sin descripción adicional para este especimen.'}"
            </p>
          </div>

          <div className="sci-card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <History size={18} color="var(--secondary)" /> Gestión de Préstamos
              </h4>
              <button 
                onClick={() => setIsLoanModalOpen(true)}
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  fontSize: '0.75rem', 
                  padding: '4px 10px', 
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + Registrar Préstamo
              </button>
            </div>
            
            {specimenLoans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {specimenLoans.map(loan => (
                  <div key={loan.id} style={{ 
                    padding: '10px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: loan.status === 'active' ? 'var(--primary-light)' : 'var(--surface)',
                    fontSize: '0.85rem',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{loan.borrower}</span>
                      <span style={{ color: loan.status === 'active' ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                        {loan.status === 'active' ? 'EN PRÉSTAMO' : 'DEVUELTO'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{loan.institution}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                      {loan.loan_date} → {loan.return_date || loan.due_date || 'Pendiente'}
                    </div>
                    {loan.status === 'active' && (
                      <button 
                        onClick={() => handleReturnLoan(loan.id)}
                        style={{ marginTop: '8px', color: 'var(--primary)', background: 'none', fontWeight: 'bold', fontSize: '0.75rem', padding: 0 }}
                      >
                        Marcar como Devuelto
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sin historial de préstamos.</p>
            )}
          </div>

          <div className="sci-card glass">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <History size={18} color="var(--secondary)" /> Auditoría de Datos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <Clock size={14} color="var(--text-muted)" />
                <span><strong>Creado:</strong> {new Date(specimen.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <Clock size={14} color="var(--text-muted)" />
                <span><strong>Última Modificación:</strong> {new Date(specimen.lastModified).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <Tag size={14} color="var(--text-muted)" />
                <span><strong>Estructura:</strong> Darwin Core v{specimen.version || 1}</span>
              </div>
            </div>
          </div>

          <a 
            href="https://www.gbif.org/darwin-core" 
            target="_blank" 
            rel="noopener noreferrer"
            className="gbif-badge"
            style={{ 
              padding: '20px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary-dark)',
              fontSize: '0.85rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'var(--transition)',
              cursor: 'pointer',
              border: '1px solid transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              e.currentTarget.style.color = 'var(--primary-dark)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ExternalLink size={24} />
            <p style={{ margin: 0, fontWeight: '500' }}>
              Este especimen está estandarizado bajo los lineamientos del GBIF y el estándar Darwin Core para facilitar el intercambio académico.
            </p>
          </a>
        </div>
      </div>
      {isLoanModalOpen && (
        <LoanModal 
          specimenId={id} 
          onClose={() => setIsLoanModalOpen(false)} 
          onSuccess={async () => {
            setIsLoanModalOpen(false);
            const updated = await loanService.getBySpecimen(id);
            setSpecimenLoans(updated);
          }}
        />
      )}
    </div>
  );
};

const LoanModal = ({ specimenId, onClose, onSuccess }) => {
  const [borrower, setBorrower] = React.useState('');
  const [institution, setInstitution] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loanService.create({
      specimen_id: specimenId,
      borrower,
      institution,
      due_date: dueDate
    });
    onSuccess();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="sci-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 style={{ marginBottom: '20px' }}>Registrar Préstamo Externo</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Investigador / Receptor</label>
            <input required value={borrower} onChange={e => setBorrower(e.target.value)} style={{ width: '100%', marginTop: '5px' }} placeholder="Nombre completo" />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Institución Destino</label>
            <input required value={institution} onChange={e => setInstitution(e.target.value)} style={{ width: '100%', marginTop: '5px' }} placeholder="Universidad, Herbario..." />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Fecha Estimada de Entrega</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', marginTop: '5px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-muted)' }}>Cancelar</button>
            <button type="submit" style={{ flex: 2, backgroundColor: 'var(--primary)', color: 'white' }}>Confirmar Préstamo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecimenDetail;
