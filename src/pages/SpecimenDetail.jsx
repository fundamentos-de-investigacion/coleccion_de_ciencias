import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSpecimens } from '../context/SpecimenContext';
import { 
  ArrowLeft, Edit3, Trash2, MapPin, Calendar, User, 
  Tag, Info, ExternalLink, Clock, History, Database, Quote, Camera
} from 'lucide-react';
import loanService from '../services/loanService';
import mediaService from '../services/mediaService';
import auditService from '../services/auditService';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import { generateAPACitation, generateBibTeXCitation } from '../utils/citationUtils';

import LoanModal from '../components/LoanModal';

const SpecimenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { specimens, deleteSpecimen } = useSpecimens();

  const specimen = specimens.find(s => s.occurrenceID === id);
  const [specimenLoans, setSpecimenLoans] = React.useState([]);
  const [specimenMedia, setSpecimenMedia] = React.useState([]);
  const [specimenAudit, setSpecimenAudit] = React.useState([]);
  const [isLoanModalOpen, setIsLoanModalOpen] = React.useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = React.useState(false);
  const [citationModal, setCitationModal] = React.useState(null); // 'apa' | 'bibtex' | null
  const [currentImageIdx, setCurrentImageIdx] = React.useState(0);

  React.useEffect(() => {
    if (id) {
      loanService.getBySpecimen(id).then(setSpecimensLoans); // Note: I should fix the setter name if it's different in current state (checking...)
      mediaService.getBySpecimen(id).then(data => {
        setSpecimenMedia(data);
        setCurrentImageIdx(0);
      });
      auditService.getBySpecimen(id).then(setSpecimenAudit);
    }
  }, [id]);

  const setSpecimensLoans = (data) => setSpecimenLoans(data); // Adapter for the setter used above

  const refreshMedia = async () => {
    const data = await mediaService.getBySpecimen(id);
    setSpecimenMedia(data);
    setCurrentImageIdx(data.length - 1);
  };

  const handleReturnLoan = async (loanId) => {
    if (window.confirm('¿Confirmar que el ejemplar ha sido devuelto a la colección física?')) {
      await loanService.markAsReturned(loanId);
      const updated = await loanService.getBySpecimen(id);
      setSpecimenLoans(updated);
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este especimen de la colección?')) {
      deleteSpecimen(id);
      navigate('/catalog');
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
      {/* ... header logic (ArrowLeft, edit, delete buttons) ... */}
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} /> Volver
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setCitationModal('apa')}
            style={{ 
              backgroundColor: 'var(--surface)', 
              color: 'var(--secondary)', 
              border: '1px solid var(--secondary)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <Quote size={18} /> Generar Cita
          </button>
          {user && (
            <>
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
            </>
          )}
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

          {/* ADVANCED GALLERY INTEGRATION */}
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '5px', margin: 0 }}>
                Evidencia Biológica
              </h4>
              {user && (
                <button 
                  onClick={() => setIsAddMediaModalOpen(true)}
                  style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Camera size={14} /> Añadir Foto
                </button>
              )}
            </div>

            {specimenMedia.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'black', height: '350px' }}>
                  <img 
                    src={specimenMedia[currentImageIdx].url} 
                    alt={specimenMedia[currentImageIdx].caption} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{specimenMedia[currentImageIdx].caption || 'Sin pie de foto científico'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                  {specimenMedia.map((media, idx) => (
                    <button 
                      key={media.id} 
                      onClick={() => setCurrentImageIdx(idx)}
                      style={{ 
                        flexShrink: 0,
                        width: '80px', 
                        height: '60px', 
                        padding: 0,
                        borderRadius: 'var(--radius-sm)', 
                        overflow: 'hidden',
                        border: currentImageIdx === idx ? '3px solid var(--primary)' : '2px solid transparent',
                        opacity: currentImageIdx === idx ? 1 : 0.6,
                        transition: '0.2s'
                      }}
                    >
                      <img src={media.url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                backgroundColor: 'var(--surface)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px dashed var(--border)', 
                color: 'var(--text-muted)' 
              }}>
                <Camera size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
                <p style={{ fontSize: '0.9rem' }}>No hay documentación fotográfica cargada para este especímen.</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '30px' }}>
            <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '5px', marginBottom: '15px' }}>
              Georreferenciación
            </h4>
            {specimen.decimalLatitude && specimen.decimalLongitude ? (
              <MapComponent 
                center={[parseFloat(specimen.decimalLatitude), parseFloat(specimen.decimalLongitude)]}
                zoom={12}
                height="250px"
                points={[{
                  lat: parseFloat(specimen.decimalLatitude),
                  lng: parseFloat(specimen.decimalLongitude),
                  title: specimen.scientificName,
                  subtitle: specimen.locality
                }]}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Coordenadas no disponibles para este ejemplar.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="sci-card glass">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Info size={18} color="var(--primary)" /> Detalles Adicionales
            </h4>
            <div style={{ marginBottom: '15px' }}>
              <InfoRow label="Mueble" value={specimen.cabinet} />
              <InfoRow label="Cajón" value={specimen.drawer} />
              <InfoRow label="Estante" value={specimen.shelf} />
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', backgroundColor: 'var(--surface)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              "{specimen.description || 'Sin descripción adicional.'}"
            </p>
          </div>

          <div className="sci-card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <History size={18} color="var(--secondary)" /> Gestión de Préstamos
              </h4>
              {user && (
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
              )}
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
              <Clock size={18} color="var(--secondary)" /> Historial de Cambios (Auditoría)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {specimenAudit.length > 0 ? (
                specimenAudit.map(log => (
                  <div key={log.id} style={{ fontSize: '0.8rem', paddingBottom: '10px', borderBottom: '1px dashed var(--border)' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '3px' }}>
                      {log.user_email} corrigió <span style={{ color: 'var(--primary)' }}>{Object.keys(log.changed_fields).join(', ')}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '5px' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    {Object.entries(log.changed_fields).map(([field, values]) => (
                      <div key={field} style={{ padding: '5px', backgroundColor: 'var(--surface)', borderRadius: '4px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{field}:</span>
                        <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{values.old}</span> → <strong>{values.new}</strong>
                      </div>
                    ))}
                    {log.reason && (
                      <div style={{ marginTop: '5px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                        Motivo: "{log.reason}"
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No se han registrado modificaciones taxonómicas.
                </p>
              )}
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

      {isAddMediaModalOpen && (
        <AddMediaModal 
          specimenId={id} 
          onClose={() => setIsAddMediaModalOpen(false)} 
          onSuccess={refreshMedia}
        />
      )}

      {citationModal && (
        <CitationModal 
          specimen={specimen} 
          format={citationModal} 
          onClose={() => setCitationModal(null)} 
          onSwitch={(fmt) => setCitationModal(fmt)}
        />
      )}
    </div>
  );
};

const AddMediaModal = ({ specimenId, onClose, onSuccess }) => {
  const [file, setFile] = React.useState(null);
  const [caption, setCaption] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      await mediaService.uploadMedia(file, specimenId, caption);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error al subir la imagen. Verifica el almacenamiento de Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="sci-card fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Camera size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Cargar Evidencia Visual</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Archivo de Imagen</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setFile(e.target.files[0])} 
              style={{ width: '100%', marginTop: '5px' }} 
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Pie de Foto Científico</label>
            <textarea 
              value={caption} 
              onChange={e => setCaption(e.target.value)} 
              placeholder="Ej: Detalle de pétalos bajo lupa 40x..."
              style={{ width: '100%', marginTop: '5px', height: '80px', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading || !file} style={{ flex: 2, backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold' }}>
              {loading ? 'Subiendo...' : 'Cargar Foto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CitationModal = ({ specimen, format, onClose, onSwitch }) => {
  const citation = format === 'apa' ? generateAPACitation(specimen) : generateBibTeXCitation(specimen);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(citation);
    alert('Cita copiada al portapapeles');
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="sci-card fade-in" style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Cita Técnica Automática</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => onSwitch('apa')}
              style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: format === 'apa' ? 'var(--primary-light)' : 'transparent', color: format === 'apa' ? 'var(--primary-dark)' : 'var(--text-muted)' }}
            >APA</button>
            <button 
              onClick={() => onSwitch('bibtex')}
              style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: format === 'bibtex' ? 'var(--primary-light)' : 'transparent', color: format === 'bibtex' ? 'var(--primary-dark)' : 'var(--text-muted)' }}
            >BibTeX</button>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: 'var(--surface)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border)',
          fontFamily: format === 'bibtex' ? 'monospace' : 'inherit',
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap',
          marginBottom: '20px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {citation}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose} 
            style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >Cerrar</button>
          <button 
            onClick={copyToClipboard}
            style={{ flex: 2, backgroundColor: 'var(--secondary)', color: 'white', fontWeight: 'bold' }}
          >Copiar al Portapapeles</button>
        </div>
      </div>
    </div>
  );
};

export default SpecimenDetail;
