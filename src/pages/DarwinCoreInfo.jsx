import React from 'react';
import darwinCoreService from '../services/darwinCoreService';
import { BookOpen, CheckCircle, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

const DarwinCoreInfo = () => {
  const fields = darwinCoreService.getFieldsDefinition();
  const example = darwinCoreService.getComparisonExample();

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Estándar Darwin Core (DwC)</h1>
        <p style={{ color: 'var(--text-muted)' }}>Entendiendo la base técnica de la digitalización de la biodiversidad.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        <div className="sci-card glass">
          <Globe size={32} color="var(--primary)" style={{ marginBottom: '15px' }} />
          <h3>¿Qué es Darwin Core?</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '10px' }}>
            Darwin Core es un estándar mantenido por la <strong>TDWG</strong> (Taxonomic Databases Working Group). 
            Proporciona un marco de referencia estable y común para compartir información sobre la diversidad biológica.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '10px' }}>
            Actúa como el "idioma universal" que permite que museos, universidades y centros de investigación de todo el mundo (como el GBIF) puedan integrar sus datos.
          </p>
        </div>

        <div className="sci-card glass">
          <ShieldCheck size={32} color="var(--secondary)" style={{ marginBottom: '15px' }} />
          <h3>Importancia de la Estandarización</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '10px' }}>
            Sin estándares, los datos científicos quedarían aislados en silos incompatibles. La estandarización permite:
          </p>
          <ul style={{ fontSize: '0.85rem', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', gap: '8px' }}><CheckCircle size={14} color="var(--success)" /> Interoperabilidad entre sistemas.</li>
            <li style={{ display: 'flex', gap: '8px' }}><CheckCircle size={14} color="var(--success)" /> Análisis masivos de datos para investigación climática.</li>
            <li style={{ display: 'flex', gap: '8px' }}><CheckCircle size={14} color="var(--success)" /> Verificabilidad y reproducibilidad científica.</li>
          </ul>
        </div>
      </div>

      {/* Comparison View */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ArrowRight size={20} color="var(--primary)" /> Ejemplo de Normalización
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', alignItems: 'center', gap: '20px' }}>
          <div className="sci-card" style={{ opacity: 0.7 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--error)', marginBottom: '10px' }}>DATOS NO ESTRUCTURADOS (Manual)</div>
            <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(example.before, null, 2)}</pre>
          </div>
          <ArrowRight size={32} color="var(--text-muted)" />
          <div className="sci-card" style={{ borderLeft: '5px solid var(--success)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '10px' }}>ESTRUCTURA DARWIN CORE (Estandarizado)</div>
            <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(example.after, null, 2)}</pre>
          </div>
        </div>
      </section>

      {/* Field Glossary */}
      <section className="sci-card">
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={20} color="var(--primary)" /> Glosario de Términos Implementados
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--primary-dark)' }}>Término DwC</th>
                <th style={{ padding: '12px', color: 'var(--primary-dark)' }}>Definición Técnica</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.term} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <code>{field.term}</code>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {field.definition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DarwinCoreInfo;
