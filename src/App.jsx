import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SpecimenProvider } from './context/SpecimenContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';

// Pages
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import SpecimenDetail from './pages/SpecimenDetail';
import RegisterSpecimen from './pages/RegisterSpecimen';
import DataVisualization from './pages/DataVisualization';
import DarwinCoreInfo from './pages/DarwinCoreInfo';
import ImportExport from './pages/ImportExport';
import Loans from './pages/Loans';
import About from './pages/About';
import Login from './pages/Login';
import TaxonomyExplorer from './pages/TaxonomyExplorer';

const ProtectedRoute = ({ children, publicAccess = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  // If route is publicAccess, allow everyone
  if (publicAccess) return children;
  
  // Otherwise, only authenticated users
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

import PublicPortal from './pages/PublicPortal';
import PublicNavbar from './components/PublicNavbar';

function AppLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // If user is logged in, show Admin Layout. If not, show Public Layout.
  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {user ? (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
          <Navbar 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            theme={theme} 
            toggleTheme={toggleTheme} 
          />
          <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
          
          <main style={{ 
            flex: 1, 
            padding: '80px 20px 20px', 
            marginLeft: isSidebarOpen && window.innerWidth > 1024 ? '260px' : '0',
            transition: 'margin-left 0.3s ease',
            backgroundColor: 'var(--background)'
          }}>
            <Routes>
              <Route path="/" element={<Dashboard theme={theme} />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/specimen/:id" element={<SpecimenDetail />} />
              <Route path="/taxonomy" element={<TaxonomyExplorer />} />
              <Route path="/register" element={<RegisterSpecimen />} />
              <Route path="/edit/:id" element={<RegisterSpecimen />} />
              <Route path="/visualizations" element={<DataVisualization />} />
              <Route path="/darwin-core" element={<DarwinCoreInfo />} />
              <Route path="/import-export" element={<ImportExport />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <PublicNavbar />
          <main style={{ padding: '70px 0 0 0' }}>
            <Routes>
              <Route path="/" element={<PublicPortal />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/specimen/:id" element={<SpecimenDetail />} />
              <Route path="/taxonomy" element={<TaxonomyExplorer />} />
              <Route path="/visualizations" element={<DataVisualization />} />
              <Route path="/darwin-core" element={<DarwinCoreInfo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}

      <Notifications />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SpecimenProvider>
          <AppLayout />
        </SpecimenProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
