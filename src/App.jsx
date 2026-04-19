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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

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

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {user && (
        <>
          <Navbar 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            theme={theme} 
            toggleTheme={toggleTheme} 
          />
          <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        </>
      )}
      
      <main style={{ 
        flex: 1, 
        padding: user ? '80px 20px 20px' : '0', 
        marginLeft: user && isSidebarOpen && window.innerWidth > 1024 ? '260px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/catalog" element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          } />
          
          <Route path="/specimen/:id" element={
            <ProtectedRoute>
              <SpecimenDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/register" element={
            <ProtectedRoute>
              <RegisterSpecimen />
            </ProtectedRoute>
          } />
          
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <RegisterSpecimen />
            </ProtectedRoute>
          } />
          
          <Route path="/visualizations" element={
            <ProtectedRoute>
              <DataVisualization />
            </ProtectedRoute>
          } />
          
          <Route path="/darwin-core" element={
            <ProtectedRoute>
              <DarwinCoreInfo />
            </ProtectedRoute>
          } />
          
          <Route path="/import-export" element={
            <ProtectedRoute>
              <ImportExport />
            </ProtectedRoute>
          } />
          
          <Route path="/loans" element={
            <ProtectedRoute>
              <Loans />
            </ProtectedRoute>
          } />
          
          <Route path="/about" element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

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
