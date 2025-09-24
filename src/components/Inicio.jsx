import React, { useEffect, useState } from 'react';
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

const LOCALSTORAGE_ACCIDENTES_KEY = 'accidentes_data';

const Inicio = ({ 
  polizas, 
  clientes, 
  setActiveModule,
  permissions,
  currentUser
}) => {
  // Estado para accidentes reales
  const [accidentes, setAccidentes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCALSTORAGE_ACCIDENTES_KEY);
    if (stored) {
      try {
        setAccidentes(JSON.parse(stored));
      } catch (e) {
        setAccidentes([]);
      }
    } else {
      setAccidentes([]);
    }
  }, []);

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

  // Renderizar contenido según el rol
  const renderContentByRole = () => {
    if (permissions.isAdmin) {
      return renderAdminContent();
    } else if (permissions.isCliente) {
      return renderClienteContent();
    } else {
      return renderDefaultContent();
    }
  };

  // Contenido para ADMINISTRADOR
  const renderAdminContent = () => (
    <div className="space-y-8">
      {/* Header Administrador */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl shadow-md border border-slate-200 p-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg mr-4">
              <Shield className="w-14 h-14" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Inicio</h1>
              <p className="text-lg text-slate-600 mt-1">Panel de control de seguros vehiculares</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg px-6 py-4 mt-6">
            <p className="text-xl text-gray-800 mb-2">¡Bienvenido, {currentUser?.nombre || 'Administrador'}!</p>
            <p className="text-base text-gray-600">Gestiona todos los seguros vehiculares desde aquí</p>
          </div>
        </div>
      </div>

      {/* Métricas completas para Admin */}
      <div className="space-y-6">
        {/* Métricas Generales - Horizontal */}
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Métricas Generales</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-20 flex items-center hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>{polizas.length}</p>
                  <p className="text-xs text-gray-600 mt-1">Pólizas Vehiculares</p>
                </div>
                <Shield className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.2}} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-20 flex items-center hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#b7541a'}}>{accidentes.length}</p>
                  <p className="text-xs text-gray-600 mt-1">Accidentes Reportados</p>
                </div>
                <Car className="w-8 h-8" style={{color: '#b7541a', opacity: 0.2}} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-20 flex items-center hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#2d5016'}}>{clientes.length}</p>
                  <p className="text-xs text-gray-600 mt-1">Propietarios</p>
                </div>
                <Users className="w-8 h-8" style={{color: '#2d5016', opacity: 0.2}} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-20 flex items-center hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>$24,500</p>
                  <p className="text-xs text-gray-600 mt-1">Primas Cobradas</p>
                </div>
                <DollarSign className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.2}} />
              </div>
            </div>
          </div>
        </div>

        {/* Todos los módulos para Admin */}
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Módulos del Sistema</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Módulos enfocados en seguros vehiculares */}
            <div onClick={() => setActiveModule('polizas')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
              <div className="text-center">
                <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                  <FileText className="w-7 h-7" style={{color: '#1e3a72'}} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Pólizas Vehiculares</h3>
                <p className="text-gray-600 text-xs">Gestiona seguros de vehículos</p>
              </div>
            </div>

            <div onClick={() => setActiveModule('clientes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
              <div className="text-center">
                <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#f0fdf4'}}>
                  <Users className="w-7 h-7" style={{color: '#2d5016'}} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Propietarios</h3>
                <p className="text-gray-600 text-xs">Gestiona propietarios de vehículos</p>
              </div>
            </div>

            <div onClick={() => setActiveModule('accidentes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
              <div className="text-center">
                <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#fef3e8'}}>
                  <Car className="w-7 h-7" style={{color: '#b7541a'}} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Gestión de Accidentes</h3>
                <p className="text-gray-600 text-xs">Supervisar casos de accidentes</p>
              </div>
            </div>

            <div onClick={() => setActiveModule('fraudes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
              <div className="text-center">
                <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#f0f7ff'}}>
                  <Shield className="w-7 h-7" style={{color: '#1e3a72'}} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Fraudes Vehiculares</h3>
                <p className="text-gray-600 text-xs">Detectar fraudes en seguros</p>
              </div>
            </div>

            <div onClick={() => setActiveModule('cotizaciones')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
              <div className="text-center">
                <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                  <Calculator className="w-7 h-7" style={{color: '#1e3a72'}} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Cotizar Seguros</h3>
                <p className="text-gray-600 text-xs">Generar cotizaciones vehiculares</p>
              </div>
            </div>

            <div onClick={() => setActiveModule('reportes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
              <div className="text-center">
                <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#f0f7ff'}}>
                  <BarChart3 className="w-7 h-7" style={{color: '#1e3a72'}} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Reportes Vehiculares</h3>
                <p className="text-gray-600 text-xs">Analytics y métricas del negocio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Contenido para CLIENTE
  const renderClienteContent = () => {
    // Filtrar accidentes del usuario actual
    const misAccidentes = accidentes.filter(a => a.cliente === (currentUser?.name || ''));
    // Filtrar pólizas del usuario actual
    const misPolizas = polizas.filter(p => p.cliente === (currentUser?.name || ''));

    return (
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
              <p className="text-xl text-gray-800 mb-2">¡Bienvenido, {currentUser?.nombre || 'Usuario'}!</p>
              <p className="text-base text-gray-600">Aquí puedes gestionar tus pólizas vehiculares, reportar accidentes y más</p>
            </div>
          </div>
        </div>

        {/* Resumen personal para Cliente */}
        <div className="space-y-6">
          {/* Mi Resumen - Horizontal */}
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Mi Resumen</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-20 flex items-center hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>{misPolizas.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Mis Vehículos Asegurados</p>
                  </div>
                  <Shield className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.2}} />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-20 flex items-center hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-2xl font-bold" style={{color: '#b7541a'}}>{misAccidentes.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Accidentes Reportados</p>
                  </div>
                  <AlertTriangle className="w-8 h-8" style={{color: '#b7541a', opacity: 0.2}} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-20 flex items-center hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-2xl font-bold" style={{color: '#2d5016'}}>$850</p>
                    <p className="text-xs text-gray-600 mt-1">Prima Mensual</p>
                  </div>
                  <DollarSign className="w-8 h-8" style={{color: '#2d5016', opacity: 0.2}} />
                </div>
              </div>
            </div>
          </div>

          {/* Mi Información Personal */}
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Mi Información Personal</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nombre Completo</p>
                      <p className="text-base font-medium text-gray-900">{currentUser?.name || 'María López'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Correo Electrónico</p>
                      <p className="text-base font-medium text-gray-900">{currentUser?.email || 'maria.lopez@email.com'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="text-base font-medium text-gray-900">{currentUser?.phone || '2234-1111'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="text-base font-medium text-gray-900">San José, Costa Rica</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Módulos disponibles para Cliente */}
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">¿Qué deseas hacer?</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Solo módulos permitidos para cliente */}
              <div onClick={() => setActiveModule('polizas')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
                <div className="text-center">
                  <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                    <FileText className="w-7 h-7" style={{color: '#1e3a72'}} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Mis Pólizas Vehiculares</h3>
                  <p className="text-gray-600 text-xs">Ver mis seguros de vehículos</p>
                </div>
              </div>

              <div onClick={() => setActiveModule('cotizaciones')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
                <div className="text-center">
                  <div className="p-4 rounded-xl mb-4 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                    <Calculator className="w-7 h-7" style={{color: '#1e3a72'}} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Cotizar Seguro</h3>
                  <p className="text-gray-600 text-xs">Solicitar cotización vehicular</p>
                </div>
              </div>

              <div onClick={() => setActiveModule('accidentes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-center min-h-[140px]">
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
        </div>

        {/* Acciones rápidas para Cliente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <Plus className="w-6 h-6 mr-3" style={{color: '#2d5016'}} />
              Acciones Rápidas
            </h3>
            <div className="space-y-4">
              <button onClick={() => setActiveModule('cotizaciones')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300">
                <div className="flex items-center">
                  <Calculator className="w-6 h-6 mr-4" style={{color: '#2d5016'}} />
                  <span className="text-base font-medium text-gray-900">Cotizar seguro vehicular</span>
                </div>
                <span className="text-sm text-gray-500">→</span>
              </button>

              <button onClick={() => setActiveModule('accidentes')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300">
                <div className="flex items-center">
                  <Car className="w-6 h-6 mr-4" style={{color: '#b7541a'}} />
                  <span className="text-base font-medium text-gray-900">Reportar accidente</span>
                </div>
                <span className="text-sm text-gray-500">→</span>
              </button>
            </div>
          </div>

          {/* Próximos vencimientos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
              <Calendar className="w-6 h-6 mr-3" style={{color: '#b7541a'}} />
              Próximos Vencimientos
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-base font-medium text-gray-900">Seguro Honda Civic</p>
                  <p className="text-sm text-gray-500">Vence en 15 días</p>
                </div>
                <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">Próximo</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-base font-medium text-gray-900">Seguro Toyota Corolla</p>
                  <p className="text-sm text-gray-500">Vence en 2 meses</p>
                </div>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">Al día</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contenido por defecto (fallback)
  const renderDefaultContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl shadow-md border border-slate-200 p-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg mr-4">
              <Shield className="w-14 h-14" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">SecureAuto Pro</h1>
              <p className="text-lg text-slate-600 mt-1">Sistema de Seguros Vehiculares</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg px-6 py-4 mt-6">
            <p className="text-xl text-gray-800 mb-2">¡Bienvenido!</p>
            <p className="text-base text-gray-600">Accede a los módulos disponibles para tu rol</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
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
            <span>Septiembre 22, 2025</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inicio;