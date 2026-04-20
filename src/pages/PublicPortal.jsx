import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Database, FolderTree, BarChart3, ArrowRight, ShieldCheck, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicPortal = () => {
  const heroImage = "https://images.unsplash.com/photo-1532187875605-2fe358a71e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"; 
  // I will use a placeholder or the one I generated if I can get the path. 
  // Since I can't guarantee the path in the code without a proper import system if it's not in public/
  // I'll use a high-quality online placeholder or a CSS gradient if preferred, 
  // but for "WOW" factor, I'll assume I can use the generated asset if I move it to public or use its path.
  // Let's use a beautiful science-themed background.

  return (
    <div className="public-portal">
      {/* Hero Section */}
      <section style={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        borderRadius: '0 0 40px 40px',
        marginBottom: '60px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            padding: '8px 20px', 
            borderRadius: 'var(--radius-full)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            Patrimonio Biológico Universitario
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: '900', 
            lineHeight: '1.1', 
            marginBottom: '25px',
            maxWidth: '900px',
            textShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            Explora la Biodiversidad desde la Academia
          </h1>
          <p style={{ 
            fontSize: 'var(--font-size-lg)', 
            maxWidth: '700px', 
            margin: '0 auto 40px', 
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Accede al catálogo abierto de la Colección de Ciencias. Un portal dedicado a la investigación, 
            la educación y la divulgación del patrimonio natural.
          </p>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '10px', 
            borderRadius: 'var(--radius-lg)', 
            display: 'flex', 
            maxWidth: '600px', 
            margin: '0 auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} style={{ position: 'absolute', left: '15px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Busca especies, familias o colectores..." 
                style={{ 
                  width: '100%', 
                  border: 'none', 
                  padding: '15px 15px 15px 50px', 
                  fontSize: '1rem',
                  outline: 'none',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <Link to="/catalog" style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '15px 30px', 
              borderRadius: 'var(--radius-md)', 
              textDecoration: 'none', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              Explorar <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Access Cards */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--primary-dark)', marginBottom: '15px' }}>Nuestros Recursos</h2>
          <p style={{ color: 'var(--text-muted)' }}>Herramientas diseñadas para estudiantes e investigadores externos.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px' 
        }}>
          <Link to="/catalog" style={{ textDecoration: 'none' }}>
            <div className="sci-card glass" style={{ padding: '40px', textAlign: 'center', height: '100%', transition: 'var(--transition)' }}>
              <div style={{ backgroundColor: 'var(--primary-light)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--primary)' }}>
                <Database size={30} />
              </div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>Catálogo Digital</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>Consulta miles de registros con geolocalización y datos técnicos Darwin Core.</p>
            </div>
          </Link>

          <Link to="/taxonomy" style={{ textDecoration: 'none' }}>
            <div className="sci-card glass" style={{ padding: '40px', textAlign: 'center', height: '100%' }}>
              <div style={{ backgroundColor: 'var(--secondary-light)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--secondary)' }}>
                <FolderTree size={30} />
              </div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>Explorador Jerárquico</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>Navega la colección desde el Reino hasta la Especie en nuestro árbol dinámico.</p>
            </div>
          </Link>

          <Link to="/visualizations" style={{ textDecoration: 'none' }}>
            <div className="sci-card glass" style={{ padding: '40px', textAlign: 'center', height: '100%' }}>
              <div style={{ backgroundColor: 'var(--warning-light)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--warning)' }}>
                <BarChart3 size={30} />
              </div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>Análisis Biogeográfico</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>Visualiza mapas de calor y distribución geográfica de los especímenes.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Researcher Call to Action */}
      <section style={{ 
        backgroundColor: 'var(--primary-dark)', 
        color: 'white', 
        padding: '80px 40px', 
        borderRadius: '40px', 
        maxWidth: '1200px', 
        margin: '0 auto 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>¿Eres un Curador o Investigador Autorizado?</h2>
          <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
            Ingresa al panel de administración para registrar nuevos ejemplares, gestionar préstamos 
            y mantener la integridad de los datos científicos de la Universidad.
          </p>
        </div>
        <Link to="/login" style={{ 
          backgroundColor: 'white', 
          color: 'var(--primary-dark)', 
          padding: '18px 36px', 
          borderRadius: 'var(--radius-md)', 
          textDecoration: 'none', 
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ShieldCheck size={24} /> Acceso Restringido
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          © 2024 Colección de Ciencias Biológicas. Universidad Darwin. <br />
          Implementado bajo estándares Darwin Core para la preservación del patrimonio natural.
        </p>
      </footer>
    </div>
  );
};

export default PublicPortal;
