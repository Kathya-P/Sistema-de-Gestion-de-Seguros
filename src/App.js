import React, { useState, useEffect } from 'react';
import './App.css';
import { Shield, User, LogOut } from 'lucide-react';

// Importar componentes
import Login from './components/auth/Login';
import LandingPage from './components/LandingPage';
import Inicio from './components/Inicio';
import Cotizaciones from './components/modules/Cotizaciones';
import Polizas from './components/modules/Polizas';
import Clientes from './components/modules/Clientes';
import DeteccionFraudes from './components/modules/DeteccionFraudes';
import RevisarAccidentes from './components/modules/RevisarAccidentes';
import Reportes from './components/modules/Reportes';
import GuestBanner from './components/auth/GuestBanner';

// Importar datos y utilidades
import { getMenuForRole, getPageTitle } from './data/appData';
import { sessionManager, usePermissions, userManager } from './utils/sessionManager';

const SistemaSeguroVehicular = () => {
  // Estados para autenticación  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Estados principales
  const [activeModule, setActiveModule] = useState('inicio');
  const [polizas, setPolizas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [resultadoCotizacion, setResultadoCotizacion] = useState(null);

  // Obtener permisos actuales
  const permissions = usePermissions();
  
  // Obtener menú filtrado por rol del usuario
  const menuItems = getMenuForRole(permissions.userRole);

  // Verificar si el usuario tiene acceso al módulo actual
  const hasAccessToModule = (moduleId) => {
    return menuItems.some(item => item.id === moduleId);
  };

  // Función para cambiar módulo con validación de permisos
  const handleModuleChange = (moduleId) => {
    if (hasAccessToModule(moduleId)) {
      setActiveModule(moduleId);
    } else {
      console.warn(`Acceso denegado al módulo: ${moduleId}`);
      // Redirigir a inicio si no tiene acceso
      setActiveModule('inicio');
    }
  };

  // Verificar sesión al cargar la app y cargar datos del localStorage
  useEffect(() => {
    const savedSession = sessionManager.getSession();
    if (savedSession) {
      setIsAuthenticated(true);
      setCurrentUser(savedSession.user);
      setShowLandingPage(false); // Si hay sesión activa, ir directamente a la app
      console.log('🔄 Sesión restaurada:', savedSession.user);
    }

    // Cargar pólizas del localStorage al inicializar la app
    const polizasGuardadas = JSON.parse(localStorage.getItem('polizas') || '[]');
    setPolizas(polizasGuardadas);
    console.log('🔄 Pólizas cargadas:', polizasGuardadas);

    // Cargar usuarios registrados como clientes
    const registeredUsers = userManager.getAllUsers();
    console.log('Usuarios registrados:', registeredUsers);
    const clientesRegistrados = registeredUsers
      .filter(user => user.rol !== 'admin' && user.role !== 'Administrador') // Excluir administradores
      .map(user => ({
        id: user.id,
        nombre: user.name,
        email: user.email,
        numeroDocumento: user.username,
        telefono: user.phone || '',
        polizasActivas: polizasGuardadas.filter(p => p.cliente === user.name && p.estado === 'Aprobada').length,
        fechaRegistro: user.createdAt
      }));
    console.log('Clientes procesados:', clientesRegistrados);
    setClientes(clientesRegistrados);
  }, []);

  // Funciones de autenticación
  const handleLogin = (username, password) => {
    const user = userManager.authenticateUser(username, password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setShowLogin(false);
      setShowLandingPage(false); // Solo ocultar landing page después del login exitoso
      
      // Guardar sesión
      sessionManager.saveSession(user);
      console.log('✅ Login exitoso y sesión guardada:', user);

      // Actualizar lista de clientes si es necesario
      const registeredUsers = userManager.getAllUsers();
      const clientesRegistrados = registeredUsers
        .filter(u => u.rol !== 'admin' && u.role !== 'Administrador')
        .map(u => ({
          id: u.id,
          nombre: u.name,
          email: u.email,
          numeroDocumento: u.username,
          telefono: u.phone || '',
          polizasActivas: polizas.filter(p => p.cliente === u.name && p.estado === 'Aprobada').length,
          fechaRegistro: u.createdAt
        }));
      setClientes(clientesRegistrados);
      
      return true;
    }
    return false;
  };

  const handleRegister = (userData) => {
    const success = userManager.registerUser(userData);
    if (success) {
      // Después del registro exitoso, actualizar la lista de clientes
      const registeredUsers = userManager.getAllUsers();
      const clientesRegistrados = registeredUsers
        .filter(user => user.rol !== 'admin' && user.role !== 'Administrador')
        .map(user => ({
          id: user.id,
          nombre: user.name,
          email: user.email,
          numeroDocumento: user.username,
          telefono: user.phone || '',
          polizasActivas: polizas.filter(p => p.cliente === user.name && p.estado === 'Aprobada').length,
          fechaRegistro: user.createdAt
        }));
      setClientes(clientesRegistrados);
    }
    return success;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveModule('inicio');
    setShowLandingPage(true);
    setShowLogoutConfirmation(false);
    
    // Limpiar sesión guardada
    sessionManager.clearSession();
    console.log('👋 Logout y sesión eliminada');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    // Mantener la landing page visible
  };

  const handleShowRegister = () => {
    setShowLogin(true);
    // Mantener la landing page visible
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    // La landing page se mantiene visible si no está autenticado
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

    const resultado = {
      primaAnual: primaAnual.toFixed(2),
      primaMensual: primaMensual.toFixed(2),
      factorEdad,
      factorSiniestros,
      factorDeducible,
      ...formData
    };

    setResultadoCotizacion(resultado);
  };

  // Función para renderizar contenido según el módulo 
  const renderContent = () => {
    // Verificar acceso al módulo actual
    if (!hasAccessToModule(activeModule)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Denegado</h3>
            <p className="text-gray-600">No tienes permisos para acceder a este módulo.</p>
            <button 
              onClick={() => setActiveModule('inicio')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case 'inicio':
        return <Inicio polizas={polizas} clientes={clientes} setActiveModule={handleModuleChange} permissions={permissions} currentUser={currentUser} />;
      case 'polizas':
        return <Polizas polizas={polizas} setPolizas={setPolizas} permissions={permissions} setActiveModule={handleModuleChange} />;
      case 'clientes':
        return <Clientes clientes={clientes} setClientes={setClientes} permissions={permissions} />;
      case 'cotizaciones':
        return <Cotizaciones resultadoCotizacion={resultadoCotizacion} handleCalcular={handleCalcular} permissions={permissions} />;
      case 'fraudes':
        return <DeteccionFraudes permissions={permissions} />;
      case 'accidentes':
        return <RevisarAccidentes permissions={permissions} polizas={polizas} setActiveModule={handleModuleChange} />;
      case 'reportes':
        return <Reportes permissions={permissions} />;
      default:
        return <Inicio polizas={polizas} clientes={clientes} setActiveModule={handleModuleChange} permissions={permissions} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mostrar Landing Page como primera pantalla */}
      {showLandingPage && (
        <LandingPage 
          onShowLogin={handleLoginClick}
          onShowRegister={handleShowRegister}
        />
      )}

      {/* Modal de Login/Registro - Se muestra sobre la landing page */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Autenticación</h2>
              <button onClick={handleCloseLogin} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <Login onLogin={handleLogin} onRegister={handleRegister} />
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Logout */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Icono de logout */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              
              {/* Título */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Cerrar sesión?
              </h3>
              
              {/* Mensaje */}
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
              </p>
              
              {/* Información del usuario */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-gray-500">{currentUser?.role}</p>
                  </div>
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelLogout}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar aplicación principal solo cuando no es landing page */}
      {!showLandingPage && (
        <>
          {/* Contenido principal - Sistema */}
          <div className="flex">
            {/* Sidebar izquierdo */}
            <div className="sidebar">
              <div className="logo">
                <div className="user-logo">
                  <Shield className="w-6 h-6" style={{color: '#1e3a72'}} />
                </div>
                <div>
                  <h1>SecureTech</h1>
                </div>
              </div>

              {/* Navegación */}
              <nav className="nav-menu">
                <ul className="nav-list">
                  {menuItems.map((item) => (
                    <li key={item.id} className="nav-item">
                      <button
                        onClick={() => handleModuleChange(item.id)}
                        className={`nav-button ${activeModule === item.id ? 'active' : ''}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer del sidebar */}
              <div className="sidebar-footer">
                {isAuthenticated ? (
                  <div className="user-info-sidebar">
                    <div className="user-avatar">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="user-details">
                      <p className="user-name">{currentUser?.name}</p>
                      <p className="user-role">{currentUser?.role}</p>
                    </div>
                    <button 
                      onClick={handleLogoutClick}
                      className="logout-btn"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="guest-login-sidebar p-4">
                    <button 
                      onClick={handleLoginClick}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
              {/* Banner para usuarios invitados */}
              {!isAuthenticated && <GuestBanner onLoginClick={handleLoginClick} />}
              
              {/* Contenido principal */}
              {renderContent()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SistemaSeguroVehicular;