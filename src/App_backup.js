import React, { useState, useEffect } from 'react';
import './App.css';
import { Shield, User, LogOut } from 'lucide-react';

// Importar componentes
import Login from './components/auth/Login';
import Inicio from './components/Inicio';
import Cotizaciones from './components/modules/Cotizaciones';
import Polizas from './components/modules/Polizas';
import Clientes from './components/modules/Clientes';
import Reclamos from './components/modules/Reclamos';
import DeteccionFraudes from './components/modules/DeteccionFraudes';
import RevisarAccidentes from './components/modules/RevisarAccidentes';
import Reportes from './components/modules/Reportes';
import GuestBanner from './components/auth/GuestBanner';

// Importar datos mock y utilidades
import { users, menuItems, mockPolizas, mockReclamos, mockClientes, getPageTitle } from './data/mockData';
import { sessionManager, usePermissions } from './utils/sessionManager';

const SistemaGestionSeguros = () => {
  // Estados para autenticación  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Estados principales
  const [activeModule, setActiveModule] = useState('inicio');
  const [polizas, setPolizas] = useState(mockPolizas);
  const [reclamos, setReclamos] = useState(mockReclamos);
  const [clientes, setClientes] = useState(mockClientes);
  const [resultadoCotizacion, setResultadoCotizacion] = useState(null);

  // Obtener permisos actuales
  const permissions = usePermissions();

  // Verificar sesión al cargar la app
  useEffect(() => {
    const savedSession = sessionManager.getSession();
    if (savedSession) {
      setIsAuthenticated(true);
      setCurrentUser(savedSession.user);
      console.log('🔄 Sesión restaurada:', savedSession.user);
    }
  }, []);

  // Funciones de autenticación
  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setShowLogin(false);
      
      // Guardar sesión
      sessionManager.saveSession(user);
      console.log('✅ Login exitoso y sesión guardada:', user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveModule('inicio');
    
    // Limpiar sesión guardada
    sessionManager.clearSession();
    console.log('👋 Logout y sesión eliminada');
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  // Función para calcular cotizaciones
  const handleCalcular = (formData) => {
    const valorNum = parseFloat(formData.valorAsegurado);
    const deducibleNum = parseFloat(formData.deducible);
    const edad = parseInt(formData.edad);

    let factorEdad = 1.0;
    if (edad < 25) factorEdad = 1.3;
    else if (edad < 35) factorEdad = 1.1;
    else if (edad < 50) factorEdad = 1.0;
    else factorEdad = 1.2;

    let factorSiniestros = 1.0;
    switch (formData.historialSiniestros) {
      case '1-siniestro': factorSiniestros = 1.2; break;
      case '2-siniestros': factorSiniestros = 1.5; break;
      case 'muchos-siniestros': factorSiniestros = 2.0; break;
      default: factorSiniestros = 1.0;
    }

    let factorTipo = 1.0;
    switch (formData.tipoSeguro) {
      case 'vehicular': factorTipo = 0.05; break;
      case 'hogar': factorTipo = 0.03; break;
      case 'vida': factorTipo = 0.08; break;
      case 'salud': factorTipo = 0.12; break;
      default: factorTipo = 0.05;
    }

    const factorDeducible = deducibleNum < 1000 ? 1.2 : deducibleNum > 2500 ? 0.9 : 1.0;
    const primaAnual = valorNum * factorTipo * factorEdad * factorSiniestros * factorDeducible;
    const primaMensual = primaAnual / 12;

    setResultadoCotizacion({
      primaAnual: primaAnual.toFixed(2),
      primaMensual: primaMensual.toFixed(2),
      cobertura: valorNum.toFixed(2),
      deducible: deducibleNum.toFixed(2)
    });
  };

  // Función para renderizar contenido según el módulo activo
  const renderContent = () => {
    switch (activeModule) {
      case 'inicio':
        return <Inicio polizas={polizas} reclamos={reclamos} clientes={clientes} setActiveModule={setActiveModule} permissions={permissions} />;
      case 'polizas':
        return <Polizas polizas={polizas} setPolizas={setPolizas} permissions={permissions} />;
      case 'clientes':
        return <Clientes clientes={clientes} setClientes={setClientes} permissions={permissions} />;
      case 'cotizaciones':
        return <Cotizaciones resultadoCotizacion={resultadoCotizacion} handleCalcular={handleCalcular} permissions={permissions} />;
      case 'reclamos':
        return <Reclamos reclamos={reclamos} setReclamos={setReclamos} permissions={permissions} />;
      case 'fraudes':
        return <DeteccionFraudes permissions={permissions} />;
      case 'accidentes':
        return <RevisarAccidentes permissions={permissions} />;
      case 'reportes':
        return <Reportes permissions={permissions} />;
      default:
        return <Inicio polizas={polizas} reclamos={reclamos} clientes={clientes} setActiveModule={setActiveModule} permissions={permissions} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de Login */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Iniciar Sesión</h2>
              <button onClick={handleCloseLogin} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <Login onLogin={handleLogin} />
          </div>
        </div>
      )}

      {/* Contenido principal - Siempre visible */}
      <div className="flex">
          {/* Sidebar izquierdo */}
          <div className="sidebar">
            <div className="logo">
              <div className="user-logo">
                <Shield className="w-6 h-6" style={{color: '#1e3a72'}} />
              </div>
              <div>
                <h1>SecureTech Solutions</h1>
              </div>
            </div>

            <nav className="nav-menu">
              <ul className="nav-list">
                {menuItems.map((item) => (
                  <li key={item.id} className="nav-item">
                    <button
                      onClick={() => setActiveModule(item.id)}
                      className={`nav-button ${activeModule === item.id ? 'active' : ''}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sidebar-footer">
              <div className="user-info-sidebar">
                <div className="user-avatar">
                  <User className="w-5 h-5" />
                </div>
                <div className="user-details">
                  <p className="user-name">{currentUser?.name}</p>
                  <p className="user-role">{currentUser?.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemaGestionSeguros;