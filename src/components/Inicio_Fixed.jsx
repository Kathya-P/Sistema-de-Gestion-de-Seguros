import React from 'react';
import NotificacionesCliente from './NotificacionesCliente';
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
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  BarChart3
} from 'lucide-react';

const Inicio = ({ 
  polizas, 
  clientes, 
  setActiveModule,
  permissions,
  currentUser
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
        return true;
    }
  };

  // Contenido para ADMIN
  const renderAdminContent = () => (
    <div className="space-y-8">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl shadow-md border border-slate-200 p-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg mr-4">
              <Shield className="w-14 h-14" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-lg text-slate-600 mt-1">Centro de control del sistema de seguros</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg px-6 py-4 mt-6">
            <p className="text-xl text-gray-800 mb-2">¡Bienvenido, {currentUser?.name || 'Administrador'}!</p>
            <p className="text-base text-gray-600">Gestiona clientes, supervisa operaciones y toma decisiones estratégicas</p>
          </div>
        </div>
      </div>

      {/* Métricas Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>{clientes.length}</p>
              <p className="text-sm text-gray-600 mt-1">Clientes Activos</p>
            </div>
            <Users className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.3}} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{color: '#2d5016'}}>{polizas.length}</p>
              <p className="text-sm text-gray-600 mt-1">Pólizas Vigentes</p>
            </div>
            <Shield className="w-8 h-8" style={{color: '#2d5016', opacity: 0.3}} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{color: '#b7541a'}}>3</p>
              <p className="text-sm text-gray-600 mt-1">Accidentes Recientes</p>
            </div>
            <AlertTriangle className="w-8 h-8" style={{color: '#b7541a', opacity: 0.3}} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{color: '#dc2626'}}>2</p>
              <p className="text-sm text-gray-600 mt-1">Casos de Fraude</p>
            </div>
            <Shield className="w-8 h-8" style={{color: '#dc2626', opacity: 0.3}} />
          </div>
        </div>
      </div>

      {/* Módulos Admin */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => setActiveModule('clientes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
              <Users className="w-8 h-8" style={{color: '#1e3a72'}} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clientes</h3>
            <p className="text-gray-600 text-sm">Gestionar base de clientes</p>
          </div>
        </div>

        <div onClick={() => setActiveModule('fraudes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#fef3f2'}}>
              <Shield className="w-8 h-8" style={{color: '#dc2626'}} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Detección Fraudes</h3>
            <p className="text-gray-600 text-sm">Revisar casos sospechosos</p>
          </div>
        </div>

        <div onClick={() => setActiveModule('accidentes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#fef3e8'}}>
              <Car className="w-8 h-8" style={{color: '#b7541a'}} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revisar Accidentes</h3>
            <p className="text-gray-600 text-sm">Supervisar reportes</p>
          </div>
        </div>

        <div onClick={() => setActiveModule('reportes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#f0f9f0'}}>
              <BarChart3 className="w-8 h-8" style={{color: '#2d5016'}} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes</h3>
            <p className="text-gray-600 text-sm">Análisis y métricas</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Contenido para CLIENTE
  const renderClienteContent = () => (
    <div className="space-y-8">
      {/* Header Cliente */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl shadow-md border border-slate-200 p-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg mr-4">
              <Users className="w-14 h-14" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Mi Portal Vehicular</h1>
              <p className="text-lg text-slate-600 mt-1">Tu espacio de seguros vehiculares personalizado</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg px-6 py-4 mt-6">
            <p className="text-xl text-gray-800 mb-2">¡Bienvenido, {currentUser?.name || 'Usuario'}!</p>
            <p className="text-base text-gray-600">Aquí puedes gestionar tus pólizas vehiculares, reportar accidentes y más</p>
          </div>
        </div>
      </div>

      {/* Notificaciones del Cliente */}
      <NotificacionesCliente currentUser={currentUser} />

      {/* Resumen del Cliente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>2</p>
              <p className="text-sm text-gray-600 mt-1">Mis Vehículos Asegurados</p>
            </div>
            <Shield className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.2}} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold" style={{color: '#b7541a'}}>0</p>
              <p className="text-sm text-gray-600 mt-1">Accidentes Reportados</p>
            </div>
            <AlertTriangle className="w-8 h-8" style={{color: '#b7541a', opacity: 0.2}} />
          </div>
        </div>
      </div>

      {/* Módulos para Cliente */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <div onClick={() => setActiveModule('polizas')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
              <FileText className="w-7 h-7" style={{color: '#1e3a72'}} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Mis Pólizas Vehiculares</h3>
            <p className="text-gray-600 text-xs">Ver mis seguros de vehículos</p>
          </div>
        </div>

        <div onClick={() => setActiveModule('cotizaciones')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
              <Calculator className="w-7 h-7" style={{color: '#1e3a72'}} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Cotizar Seguro</h3>
            <p className="text-gray-600 text-xs">Solicitar cotización vehicular</p>
          </div>
        </div>

        <div onClick={() => setActiveModule('accidentes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#fef3e8'}}>
              <Car className="w-7 h-7" style={{color: '#b7541a'}} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Reportar Accidente</h3>
            <p className="text-gray-600 text-xs">Informar incidente vehicular</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar contenido según el rol
  const renderContentByRole = () => {
    if (permissions.isAdmin) {
      return renderAdminContent();
    } else if (permissions.isCliente) {
      return renderClienteContent();
    } else {
      return renderAdminContent(); // fallback
    }
  };

  return (
    <div className="space-y-8">
      {renderContentByRole()}
      
      {/* Footer común */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl p-6 border border-gray-200 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: '#2d5016'}}></div>
            <span className="text-base text-gray-700">
              💡 <strong>Tip:</strong> {permissions.isAdmin ? 'Revisa los accidentes reportados regularmente' : 'Mantén tus pólizas vehiculares al día para una mejor protección'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Septiembre 24, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;