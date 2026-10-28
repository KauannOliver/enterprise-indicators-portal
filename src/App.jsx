import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recupera dados salvos do localStorage ao iniciar
    const savedUser = localStorage.getItem('@PortalBI:user');
    const savedReports = localStorage.getItem('@PortalBI:reports');

    if (savedUser && savedReports) {
      setUser(JSON.parse(savedUser));
      setReports(JSON.parse(savedReports));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData, reportsData) => {
    setUser(userData);
    setReports(reportsData);
    setIsAuthenticated(true);
    
    // Salva no localStorage para manter a sessão
    localStorage.setItem('@PortalBI:user', JSON.stringify(userData));
    localStorage.setItem('@PortalBI:reports', JSON.stringify(reportsData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setReports([]);
    
    // Limpa o localStorage ao sair
    localStorage.removeItem('@PortalBI:user');
    localStorage.removeItem('@PortalBI:reports');
  };

  if (isLoading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>Carregando...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard user={user} reports={reports} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
