import React from 'react';
import { Award, Code, Database, Microscope, Github, Notebook, Terminal, Layers } from 'lucide-react';

const About = () => {
  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Microscope size={32} />
        </div>
        <h1 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '10px' }}>Sobre el Sistema de Gestión Biológica</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          Una plataforma científica diseñada para la digitalización, estandarización y gestión de colecciones de biodiversidad enfocada en especímenes naturales colombianos.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        <section className="sci-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Award size={20} color="var(--primary)" /> Objetivo del Proyecto
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-main)' }}>
            Este sistema ha sido desarrollado como una herramienta académica para demostrar las mejores prácticas en la digitalización de la biodiversidad.
            Busca facilitar el registro de especímenes biológicos asegurando que la información sea rica, coherente y cumpla con estándares internacionales como
            <strong> Darwin Core</strong>.
          </p>
        </section>

        <section className="sci-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Code size={20} color="var(--secondary)" /> Tecnologías Core
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              React 18 (Hooks)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              Vite (Build Tool)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              Recharts (Data Vis)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              React Router 6
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              Lucide React (Icons)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              Vanilla CSS (Theming)
            </div>
          </div>
        </section>
      </div>

      <div className="sci-card glass" style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Arquitectura y Principios de Ingeniería</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <Database size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '10px' }}>Persistencia Resiliente</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manejo de LocalStorage con sistema de failover a estado en memoria ante errores.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Layers size={24} color="var(--secondary)" style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '10px' }}>Arquitectura Limpia</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Separación estricta de lógica de negocio (Servicios) y lógica de presentación (Componentes).</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Terminal size={24} color="var(--warning)" style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '10px' }}>Estado Global</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uso de Context API para una fuente única de verdad e importación masiva de datos.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Notebook size={24} color="var(--success)" style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '10px' }}>Auditoría Científica</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trazabilidad completa con campos de creación, modificación y versionado de datos.</p>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '50px', textAlign: 'center', padding: '30px', borderTop: '1px solid var(--border)' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Desarrollado con propósitos académicos para la gestión de Ciencias Naturales <Github size={16} /> 2026
        </p>
      </footer>
    </div>
  );
};

export default About;
