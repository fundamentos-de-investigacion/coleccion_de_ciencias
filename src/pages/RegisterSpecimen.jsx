import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpecimens } from '../context/SpecimenContext';
import { validateSpecimen } from '../utils/validationUtils';
import { normalizeSpecimenData } from '../utils/normalizationUtils';
import { 
  ArrowLeft, Save, AlertCircle, Info, Beaker, Map, 
  User as UserIcon, Calendar as CalendarIcon, Tag, Database, Camera, Upload, X
} from 'lucide-react';
import mediaService from '../services/mediaService';

const RegisterSpecimen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { specimens, addSpecimen, updateSpecimen } = useSpecimens();
  const isEditing = !!id;

  const initialFormState = {
    scientificName: '',
    kingdom: 'Animalia',
    phylum: '',
    class: '',
    order: '',
    family: '',
    genus: '',
    specificEpithet: '',
    locality: '',
    decimalLatitude: '',
    decimalLongitude: '',
    eventDate: new Date().toISOString().split('T')[0],
    recordedBy: '',
    description: '',
    cabinet: '',
    drawer: '',
    shelf: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtherKingdom, setIsOtherKingdom] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const standardKingdoms = ['Animalia', 'Plantae', 'Fungi', 'Protista', 'Monera'];

  useEffect(() => {
    if (isEditing) {
      const specimen = specimens.find(s => s.occurrenceID === id);
      if (specimen) {
        setFormData(specimen);
        if (specimen.kingdom && !standardKingdoms.includes(specimen.kingdom)) {
          setIsOtherKingdom(true);
        }
      }
    }
  }, [id, isEditing, specimens, standardKingdoms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateSpecimen(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    const normalizedData = normalizeSpecimenData(formData);

    try {
      let savedSpecimen;
      if (isEditing) {
        savedSpecimen = await updateSpecimen(id, normalizedData);
      } else {
        savedSpecimen = await addSpecimen(normalizedData);
      }

      // Handle multimedia uploads if there are any
      if (selectedFiles.length > 0) {
        setUploadStatus('Subiendo archivos multimedia...');
        const specimenId = isEditing ? id : savedSpecimen.occurrenceID;
        
        for (const file of selectedFiles) {
          await mediaService.uploadMedia(file, specimenId);
        }
      }

      navigate('/catalog');
    } catch (error) {
      console.error('Error saving specimen:', error);
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const FormSection = ({ title, icon, children }) => (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '20px',
        color: 'var(--primary-dark)',
        fontSize: '1.1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '10px'
      }}>
        {icon} {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = 'text', required = false, placeholder = '' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>
        {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
      </label>
      <input 
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ 
          borderColor: errors[name] ? 'var(--error)' : 'var(--border)',
          backgroundColor: errors[name] ? '#fff5f5' : 'var(--background)'
        }}
      />
      {errors[name] && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{errors[name]}</span>}
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} /> Volver
        </button>
        <h2 style={{ color: 'var(--primary-dark)' }}>
          {isEditing ? 'Editar Especimen' : 'Registrar Nuevo Especimen'}
        </h2>
        <div style={{ width: '80px' }}></div> {/* Spacer */}
      </header>

      <form onSubmit={handleSubmit} className="sci-card" style={{ padding: '40px' }}>
        <p style={{ marginBottom: '30px', padding: '15px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)', fontSize: '0.9rem' }}>
          <Info size={16} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          Por favor complete la información científica siguiendo el estándar Darwin Core. Los campos marcados con * son obligatorios.
        </p>

        <FormSection title="Identificación Taxonómica" icon={<Beaker size={20} color="var(--primary)" />}>
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField 
              label="Nombre Científico" 
              name="scientificName" 
              required 
              placeholder="Ej: Espeletia grandiflora" 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Reino *</label>
            <select 
              name="kingdom_select" 
              value={isOtherKingdom ? 'Other' : formData.kingdom} 
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Other') {
                  setIsOtherKingdom(true);
                  setFormData(prev => ({ ...prev, kingdom: '' }));
                } else {
                  setIsOtherKingdom(false);
                  setFormData(prev => ({ ...prev, kingdom: val }));
                }
              }}
            >
              <option value="Animalia">Animalia</option>
              <option value="Plantae">Plantae</option>
              <option value="Fungi">Fungi</option>
              <option value="Protista">Protista</option>
              <option value="Monera">Monera</option>
              <option value="Other">Otro (especificar...)</option>
            </select>
          </div>
          {isOtherKingdom && (
            <InputField 
              label="Especifique el Reino" 
              name="kingdom" 
              required 
              placeholder="Ej: Archaea, Chromista..." 
            />
          )}
          <InputField label="Filo / División" name="phylum" required placeholder="Ej: Tracheophyta" />
          <InputField label="Clase" name="class" required placeholder="Ej: Magnoliopsida" />
          <InputField label="Orden" name="order" required placeholder="Ej: Asterales" />
          <InputField label="Familia" name="family" required placeholder="Ej: Asteraceae" />
          <InputField label="Género" name="genus" required placeholder="Ej: Espeletia" />
          <InputField label="Epíteto Específico" name="specificEpithet" required placeholder="Ej: grandiflora" />
        </FormSection>

        <FormSection title="Localidad y Evento" icon={<Map size={20} color="var(--secondary)" />}>
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField label="Ubicación Detallada" name="locality" required placeholder="Ej: Páramo de Sumapaz, Colombia" />
          </div>
          <InputField label="Latitud Decimal" name="decimalLatitude" type="number" placeholder="Ej: 4.6097" />
          <InputField label="Longitud Decimal" name="decimalLongitude" type="number" placeholder="Ej: -74.0817" />
          <InputField label="Fecha de Registro" name="eventDate" type="date" required />
          <InputField label="Registrado por (Colector)" name="recordedBy" required placeholder="Nombre del investigador" />
        </FormSection>

        <FormSection title="Ubicación en Colección Física" icon={<Database size={20} color="var(--primary)" />}>
          <InputField label="Mueble" name="cabinet" placeholder="Ej: Mueble A1" />
          <InputField label="Cajón" name="drawer" placeholder="Ej: Cajón 12" />
          <InputField label="Estante" name="shelf" placeholder="Ej: Nivel 3" />
        </FormSection>

        <FormSection title="Información Adicional" icon={<Tag size={20} color="var(--warning)" />}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Descripción del Ejemplar</label>
            <textarea 
              name="description" 
              rows="4" 
              value={formData.description || ''} 
              onChange={handleChange}
              placeholder="Notas sobre el estado, comportamiento o características físicas..."
              style={{ padding: '12px' }}
            />
          </div>
        </FormSection>

        <FormSection title="Multimedia y Evidencia" icon={<Camera size={20} color="var(--primary)" />}>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '30px', 
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              transition: 'all 0.2s ease'
            }}>
              <Upload size={30} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                Arrastre o seleccione fotografías, micrografías o audios (JPG, PNG, MP3).
              </p>
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                style={{ opacity: 0, position: 'absolute', width: '1px', height: '1px' }} 
                id="file-upload" 
              />
              <label 
                htmlFor="file-upload"
                style={{ 
                  backgroundColor: 'white', 
                  color: 'var(--primary)', 
                  border: '1px solid var(--primary)', 
                  padding: '8px 20px', 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}
              >
                Seleccionar Archivos
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {selectedFiles.map((file, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '5px 12px', 
                    backgroundColor: 'white', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => removeFile(idx)}
                      style={{ background: 'none', color: 'var(--error)', padding: '2px', display: 'flex' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        {uploadStatus && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-dark)', fontWeight: '600' }}>
            <RefreshCw size={18} className="spin" /> {uploadStatus}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={{ 
              background: 'none', 
              color: 'var(--text-muted)', 
              fontWeight: '600',
              padding: '10px 20px'
            }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '12px 30px', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '700',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-md)',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            <Save size={20} /> {isEditing ? 'Guardar Cambios' : 'Registrar Especimen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterSpecimen;
