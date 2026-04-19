import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useSpecimens } from '../context/SpecimenContext';
import { validateImportFile } from '../utils/validationUtils';
import { 
  Download, Upload, FileJson, AlertCircle, 
  CheckCircle2, HelpCircle, Database, RefreshCw, 
  FileSpreadsheet, BookOpen, Table, Info
} from 'lucide-react';

const ImportExport = () => {
  const { specimens, importData, addNotification } = useSpecimens();
  const [importStats, setImportStats] = useState(null);
  const [importMode, setImportMode] = useState('merge');
  const [isHovering, setIsHovering] = useState(false);

  const handleExport = () => {
    const dataToExport = {
      version: 1.0,
      exportDate: new Date().toISOString(),
      count: specimens.length,
      data: specimens
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bio-collection-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Colección exportada correctamente');
  };

  const handleExcelExport = () => {
    if (specimens.length === 0) {
      addNotification('No hay datos para exportar', 'warning');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(specimens);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Especímenes');
    XLSX.writeFile(workbook, `bio-collection-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    addNotification('Colección exportada a Excel correctamente');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        let records = [];

        if (fileExtension === 'json') {
          const json = JSON.parse(event.target.result);
          records = Array.isArray(json) ? json : (json.data || []);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          records = XLSX.utils.sheet_to_json(worksheet);
        }

        if (records.length === 0) {
          addNotification('El archivo no contiene registros válidos', 'error');
          return;
        }
        
        const validation = validateImportFile(records);
        if (!validation.isValid) {
          addNotification(validation.error, 'error');
          return;
        }

        const result = await importData(records, importMode);
        if (result.success) {
          setImportStats({
            total: records.length,
            success: records.length, 
            failed: 0,
            mode: importMode
          });
          addNotification(`Importación completada: ${records.length} registros`, 'success');
        }
      } catch (error) {
        addNotification(`Error al leer el archivo ${fileExtension.toUpperCase()}: Estructura corrupta`, 'error');
        console.error(error);
      }
    };

    if (fileExtension === 'json') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Gestión de Datos</h1>
        <p style={{ color: 'var(--text-muted)' }}>Intercambio de información biológica mediante archivos estandarizados JSON.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {/* Export Section */}
        <div className="sci-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary-dark)' }}>
              <Download size={24} />
            </div>
            <h3>Exportar Colección</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Descarga la base de datos completa en formato JSON compatible con Darwin Core. Incluye metadatos de versión y auditoría.
          </p>
          <div style={{ 
            padding: '15px', 
            backgroundColor: 'var(--surface)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border)',
            fontSize: '0.85rem'
          }}>
            <Database size={14} style={{ marginRight: '8px' }} />
            Total de especímenes a exportar: <strong>{specimens.length}</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button 
              onClick={handleExport}
              style={{ 
                flex: 1,
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '12px', 
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '0.85rem'
              }}
            >
              <FileJson size={20} /> JSON
            </button>
            <button 
              onClick={handleExcelExport}
              style={{ 
                flex: 1,
                backgroundColor: '#217346', // Excel Green
                color: 'white', 
                padding: '12px', 
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '0.85rem'
              }}
            >
              <FileSpreadsheet size={20} /> Excel
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="sci-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--secondary)', borderRadius: '12px', color: 'white' }}>
              <Upload size={24} />
            </div>
            <h3>Importar Datos</h3>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '10px' }}>
              Estrategia de Integración:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setImportMode('merge')}
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${importMode === 'merge' ? 'var(--secondary)' : 'var(--border)'}`,
                  backgroundColor: importMode === 'merge' ? 'var(--secondary)' : 'white',
                  color: importMode === 'merge' ? 'white' : 'var(--text-main)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <RefreshCw size={14} /> Fusionar (Merge)
              </button>
              <button 
                onClick={() => setImportMode('replace')}
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${importMode === 'replace' ? 'var(--error)' : 'var(--border)'}`,
                  backgroundColor: importMode === 'replace' ? 'var(--error)' : 'white',
                  color: importMode === 'replace' ? 'white' : 'var(--text-main)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <AlertCircle size={14} /> Sobrescribir
              </button>
            </div>
          </div>

          <label 
            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
            onDragLeave={() => setIsHovering(false)}
            onDrop={(e) => { e.preventDefault(); setIsHovering(false); handleFileUpload({ target: { files: e.dataTransfer.files } }); }}
            style={{
              border: `2px dashed ${isHovering ? 'var(--secondary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isHovering ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
              transition: 'var(--transition)'
            }}
          >
            <Upload size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}><strong>Haz clic para subir</strong> o arrastra un archivo</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Formatos compatibles: .json, .xlsx, .csv</p>
            <input type="file" accept=".json,.xlsx,.xls,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {importStats && (
        <div className="sci-card fade-in" style={{ marginTop: '30px', borderLeft: '5px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <CheckCircle2 size={24} color="var(--success)" />
            <h3 style={{ margin: 0 }}>Resumen de Importación</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Procesados</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{importStats.total}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Válidos (Éxito)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>{importStats.success}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fallidos</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--error)' }}>{importStats.failed}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Modo de Integración</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'capitalize' }}>{importStats.mode}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', gap: '15px' }}>
        <HelpCircle size={20} color="var(--secondary)" />
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <strong>Nota de compatibilidad:</strong> El sistema utiliza validación de esquema estricta basada en Darwin Core. Si elige el modo "Merge", los registros con el mismo <code>occurrenceID</code> serán actualizados.
        </p>
      </div>

      {/* Guide Section */}
      <section className="sci-card" style={{ marginTop: '40px', padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '15px' }}>
          <BookOpen size={28} color="var(--primary)" />
          <h2 style={{ margin: 0, color: 'var(--primary-dark)' }}>Guía de Estructura de Datos (Darwin Core)</h2>
        </div>

        <p style={{ marginBottom: '25px', fontSize: '0.95rem' }}>
          Para que los datos se importen correctamente, tanto los archivos JSON como las tablas de Excel deben seguir la estructura de campos definida a continuación. Cada fila (en Excel) u objeto (en JSON) representa un espécimen botánico o zoológico.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Campo (Encabezado)</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Tipo / Requisito</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><code>scientificName</code></td>
                <td style={{ padding: '12px' }}>Nombre científico del ejemplar.</td>
                <td style={{ padding: '12px' }}><span style={{ color: 'var(--error)' }}>Requerido</span></td>
                <td style={{ padding: '12px' }}><em>Espeletia grandiflora</em></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><code>kingdom</code></td>
                <td style={{ padding: '12px' }}>Reino taxonómico.</td>
                <td style={{ padding: '12px' }}><span style={{ color: 'var(--error)' }}>Requerido</span></td>
                <td style={{ padding: '12px' }}>Plantae, Animalia...</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><code>eventDate</code></td>
                <td style={{ padding: '12px' }}>Fecha de recolección/observación.</td>
                <td style={{ padding: '12px' }}>YYYY-MM-DD</td>
                <td style={{ padding: '12px' }}>2024-03-20</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><code>decimalLatitude</code></td>
                <td style={{ padding: '12px' }}>Latitud en grados decimales.</td>
                <td style={{ padding: '12px' }}>Numérico (-90 a 90)</td>
                <td style={{ padding: '12px' }}>4.5828</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><code>decimalLongitude</code></td>
                <td style={{ padding: '12px' }}>Longitud en grados decimales.</td>
                <td style={{ padding: '12px' }}>Numérico (-180 a 180)</td>
                <td style={{ padding: '12px' }}>-74.0817</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><code>recordedBy</code></td>
                <td style={{ padding: '12px' }}>Nombre del colector o investigador.</td>
                <td style={{ padding: '12px' }}>Texto</td>
                <td style={{ padding: '12px' }}>Helena Rodríguez</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><code>locality</code></td>
                <td style={{ padding: '12px' }}>Descripción de la ubicación.</td>
                <td style={{ padding: '12px' }}>Texto</td>
                <td style={{ padding: '12px' }}>Páramo de Sumapaz</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px', backgroundColor: '#e3f2fd', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '15px' }}>
          <Info size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary)' }}>Consejos para Excel</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              <li>La primera fila debe contener exactamente los nombres de los campos (Ej: <strong>scientificName</strong>).</li>
              <li>No deje filas vacías entre registros.</li>
              <li>Para decimales, use el punto (.) como separador si su configuración lo requiere para consistencia.</li>
              <li>El <code>occurrenceID</code> es opcional; si no se provee, el sistema generará uno nuevo automáticamente.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImportExport;
