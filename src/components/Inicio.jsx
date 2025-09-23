import React from 'react';
import { 
  Shield, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  Users, 
  Plus,
  DollarSign,
  Calendar,
  Car,
  Clock
} from 'lucide-react';

const Inicio = ({ 
  polizas, 
  reclamos, 
  clientes, 
  setActiveModule,
  permissions 
}) => {
  
  // Función para verificar si el usuario puede acceder a un módulo
  const canAccessModule = (module) => {
    if (!permissions) return false;
    
    switch (module) {
      case 'clientes':
        return permissions.canViewClients;
      case 'fraudes':
        return permissions.canViewFraudes;
      case 'reportes':
        return permissions.canViewReports;
      default:
        return true; // inicio, polizas, cotizaciones, reclamos, accidentes están disponibles para todos
    }
  };

  return (
  <div className="space-y-5">
    {/* Header con más información */}
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-100 p-8">
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Shield className="w-12 h-12 mr-3" style={{color: '#1e3a72'}} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SecureTech Solutions</h1>
            <p className="text-sm text-gray-600">Sistema de Gestión de Seguros</p>
          </div>
        </div>
        <p className="text-lg text-gray-700 mb-2">¡Bienvenido de vuelta!</p>
        <p className="text-sm text-gray-600">Gestiona todo tu negocio de seguros desde una sola plataforma</p>
      </div>
    </div>

    {/* Resumen y módulos alineados */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
      {/* Estadísticas destacadas */}
      <div className="lg:col-span-1 flex flex-col">
        <div className="flex items-center mb-3 h-8">
          <h3 className="text-lg font-semibold text-gray-900">Resumen del día</h3>
        </div>
        <div className="space-y-3 flex-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>{polizas.length}</p>
                <p className="text-sm text-gray-600">Pólizas Activas</p>
              </div>
              <Shield className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.3}} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-2xl font-bold" style={{color: '#b7541a'}}>{reclamos.filter(r => r.estado === 'En revisión').length}</p>
                <p className="text-sm text-gray-600">Reclamos Pendientes</p>
              </div>
              <AlertTriangle className="w-8 h-8" style={{color: '#b7541a', opacity: 0.3}} />
            </div>
          </div>

          {canAccessModule('clientes') && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-2xl font-bold" style={{color: '#2d5016'}}>{clientes.length}</p>
                <p className="text-sm text-gray-600">Clientes Activos</p>
              </div>
              <Users className="w-8 h-8" style={{color: '#2d5016', opacity: 0.3}} />
            </div>
          </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>$24,500</p>
                <p className="text-sm text-gray-600">Ingresos del mes</p>
              </div>
              <DollarSign className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.3}} />
            </div>
          </div>
        </div>
      </div>

      {/* Módulos principales */}
      <div className="lg:col-span-3 flex flex-col">
        <div className="flex items-center mb-3 h-8">
          <h3 className="text-lg font-semibold text-gray-900">Módulos del sistema</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          <div 
            onClick={() => setActiveModule('cotizaciones')}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
          >
            <div className="text-center">
              <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                <Calculator className="w-6 h-6" style={{color: '#1e3a72'}} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Cotizaciones</h3>
              <p className="text-gray-600 text-xs">Genera cotizaciones personalizadas</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveModule('polizas')}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
          >
            <div className="text-center">
              <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                <FileText className="w-6 h-6" style={{color: '#1e3a72'}} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Pólizas</h3>
              <p className="text-gray-600 text-xs">Gestiona pólizas activas</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveModule('reclamos')}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
          >
            <div className="text-center">
              <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#fef3e8'}}>
                <AlertTriangle className="w-6 h-6" style={{color: '#b7541a'}} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Reclamos</h3>
              <p className="text-gray-600 text-xs">Procesa reclamos</p>
            </div>
          </div>

          {canAccessModule('fraudes') && (
          <div 
            onClick={() => setActiveModule('fraudes')}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
          >
            <div className="text-center">
              <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#f0f7ff'}}>
                <Shield className="w-6 h-6" style={{color: '#1e3a72'}} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Fraudes</h3>
              <p className="text-gray-600 text-xs">Detección inteligente</p>
            </div>
          </div>
          )}

          <div 
            onClick={() => setActiveModule('accidentes')}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
          >
            <div className="text-center">
              <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#fef3e8'}}>
                <Car className="w-6 h-6" style={{color: '#b7541a'}} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Accidentes</h3>
              <p className="text-gray-600 text-xs">Revisar accidentes</p>
            </div>
          </div>

          {canAccessModule('clientes') && (
          <div 
            onClick={() => setActiveModule('clientes')}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
          >
            <div className="text-center">
              <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#f0fdf4'}}>
                <Users className="w-6 h-6" style={{color: '#2d5016'}} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Clientes</h3>
              <p className="text-gray-600 text-xs">Gestiona clientes</p>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>

    {/* Actividad reciente y acciones rápidas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Actividad reciente */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" style={{color: '#1e3a72'}} />
          Actividad reciente
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#2d5016'}}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nueva póliza creada</p>
                <p className="text-xs text-gray-500">Juan Pérez - Seguro vehicular</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">Hace 2h</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#b7541a'}}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Reclamo procesado</p>
                <p className="text-xs text-gray-500">María González - Aprobado</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">Hace 4h</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#1e3a72'}}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Cotización generada</p>
                <p className="text-xs text-gray-500">Carlos Ruiz - Seguro de hogar</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">Hace 6h</span>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2" style={{color: '#1e3a72'}} />
          Acciones rápidas
        </h3>
        <div className="space-y-3">
          <button 
            onClick={() => setActiveModule('cotizaciones')}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center">
              <Calculator className="w-5 h-5 mr-3" style={{color: '#1e3a72'}} />
              <span className="text-sm font-medium text-gray-900">Nueva cotización</span>
            </div>
            <span className="text-xs text-gray-500">→</span>
          </button>

          <button 
            onClick={() => setActiveModule('polizas')}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3" style={{color: '#1e3a72'}} />
              <span className="text-sm font-medium text-gray-900">Crear póliza</span>
            </div>
            <span className="text-xs text-gray-500">→</span>
          </button>

          {canAccessModule('clientes') && (
          <button 
            onClick={() => setActiveModule('clientes')}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3" style={{color: '#2d5016'}} />
              <span className="text-sm font-medium text-gray-900">Registrar cliente</span>
            </div>
            <span className="text-xs text-gray-500">→</span>
          </button>
          )}

          <button 
            onClick={() => setActiveModule('reclamos')}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3" style={{color: '#b7541a'}} />
              <span className="text-sm font-medium text-gray-900">Procesar reclamo</span>
            </div>
            <span className="text-xs text-gray-500">→</span>
          </button>
        </div>
      </div>
    </div>

    {/* Footer con tips o información adicional */}
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: '#2d5016'}}></div>
          <span className="text-sm text-gray-600">
            💡 <strong>Tip del día:</strong> Revisa los reclamos pendientes para mantener la satisfacción del cliente alta
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Septiembre 21, 2025</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Inicio;